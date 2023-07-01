import { NewLogger } from "./log.ts";

interface IApp {
    id: string;
    cwd: string;
    exe: string;
    args: string[];
    http?: {
        port?: number;
        path: string;
    };
}

const sleep = (t = 1000) => new Promise(r => setTimeout(r, t));

function NewApp(app: IApp, run_env: Record<string, string>) {
    const hostname = "127.0.0.1";
    const port = `${app.http?.port}`;
    const logger = NewLogger(app.id);
    let proc: Deno.ChildProcess | null;
    const check = async () => {
        const check_url = `http://${hostname}:${port}/ping`;
        while (true) {
            try {
                logger.info("check", check_url);
                const response = await fetch(check_url);
                logger.info(response.statusText);
                if (response.status == 200) {
                    return true;
                }
            } catch (e) {
                await sleep();
            }
        }
        return false;
    }

    const pipe = async (stream: ReadableStream<Uint8Array>) => {
        while (stream.locked) {
            await sleep();
        }
        const reader = stream.getReader();
        while (true) {
            const data = await reader.read();
            if (data.done) {
                reader.releaseLock();
                return;
            } else {
                Deno.stdout.write(data.value);
            }
        }
    }

    const spawn = async () => {
        if (proc) {
            return true;
        }
        const env: Record<string, string> = {
            ...run_env,
            port: port,
        }
        const command = new Deno.Command(
            app.exe,
            {
                args: app.args,
                env: env,
                cwd: app.cwd,
                stderr: "piped",
                stdout: "piped",
            }
        );
        logger.info("spawn", app);
        proc = command.spawn();
        pipe(proc.stdout);
        pipe(proc.stderr);
        await sleep();
        await check();
        proc.status.then(() => proc = null);
    }

    const path = app.http?.path;
    const match = async (url: URL) => {
        if (!path) {
            return null;
        }
        if (!url.pathname.startsWith(path)) {
            return null;
        }
        url.pathname = url.pathname.substring(path.length);
        url.hostname = "127.0.0.1";
        url.port = port.toString();
        await spawn();
        return url;
    }

    return { match }
}

export function NewAppList(apps: IApp[], run_env: Record<string, string>) {
    const app_list = apps.map(app => NewApp(app, run_env));
    const match = async (url: URL) => {
        for (const app of app_list) {
            const match_url = await app.match(url);
            if (match_url) {
                return match_url;
            }
        }
        return null;
    }
    return {
        match
    }
}