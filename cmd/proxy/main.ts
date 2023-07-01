import "https://deno.land/x/dotenv/load.ts";
import * as path from 'https://deno.land/std/path/mod.ts';

import { logger } from "./log.ts";
import { NewAppList } from "./app.ts";

const config_file = path.toFileUrl(path.join(Deno.cwd(), Deno.args[0]));
logger.info("config file", config_file.href);
const config = await import(config_file.toString());

const Config = {
    Port: Number(Deno.env.get("PORT")) || 3000,
};

const env = {
    DB_URL: Deno.env.get("DB_URL") || ''
}

// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: Config.Port });
logger.info(`HTTP webserver running.  Access it at:  http://localhost:${Config.Port}/`);
const app_list = NewAppList(config.apps, env);

async function serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        try {
            const _url = new URL(requestEvent.request.url);
            const url = await app_list.match(_url);
            if (!url) {
                requestEvent.respondWith(new Response("not found", { status: 404 }));
                logger.info(new Date(), requestEvent.request.method, requestEvent.request.url, `not found`);
                return;
            }
            logger.info("proxy", url.toString());
            const start = new Date();
            const request: RequestInit = {
                method: requestEvent.request.method,
            };
            if (request.method === "POST" || request.method === "PATCH" || request.method === "PUT") {
                const buf = await requestEvent.request.arrayBuffer();
                request.body = buf;
            };
            const resp = await fetch(url.toString(), request);
            await requestEvent.respondWith(resp);
            const end = new Date();
            const ellapsed = end.getTime() - start.getTime();
            logger.info(start, requestEvent.request.method, requestEvent.request.url, `${ellapsed}ms`);
        } catch (e) {
            logger.error(e);
            const message = "internal server error";
            requestEvent.respondWith(new Response(message, { status: 500 }));
        }
    }
}

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection individually
    // without awaiting the function
    serveHttp(conn);
}
