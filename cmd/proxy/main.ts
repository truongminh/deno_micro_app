import "https://deno.land/x/dotenv/load.ts";

import { logger } from "./log.ts";
import { IApp, NewApp } from "./app.ts";

const Config = {
    Port: Number(Deno.env.get("PORT")) || 3000,
};

const env = {
    DB_URL: Deno.env.get("DB_URL") || ''
}

// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: Config.Port });
logger.info(`HTTP webserver running.  Access it at:  http://localhost:${Config.Port}/`);

const auth_app: IApp = {
    id: "auth",
    cwd: "cmd/auth",
    exe: "deno",
    args: ["run", "--watch", "--allow-net", "--allow-read", "--allow-env", "main.ts"],
    http: {
        port: 3001,
        path: "/api/auth",
    }
};

const apps = [
    NewApp(auth_app, env)
];

async function matchAppUrl(url: URL) {
    for (const app of apps) {
        const match_url = await app.match(url);
        if (match_url) {
            return match_url;
        }
    }
    return null;
}

async function serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        try {
            const _url = new URL(requestEvent.request.url);
            let url = await matchAppUrl(_url);
            if (!url) {
                requestEvent.respondWith(new Response("not found", { status: 404 }));
                return;
            }
            const start = new Date();
            await requestEvent.respondWith(fetch(url.toString(), requestEvent.request));
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
