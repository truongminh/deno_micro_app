import { NewLogger } from "./log.ts";

export interface IApp {
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

export function NewApp(app: IApp, run_env: Record<string, string>) {
    const hostname = "127.0.0.1";
    const port = `${app.http?.port}`;
    const logger = NewLogger(app.id);
    let proc: Deno.ChildProcess;
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
        proc.stdout.pipeTo(Deno.stdout.writable);
        proc.stderr.pipeTo(Deno.stderr.writable);
        await sleep();
        await check();
    }

    const path = app.http?.path;
    const match = async (url: URL) => {
        if (!path) {
            return null;
        }
        if (!url.pathname.startsWith(path)) {
            return null;
        }
        url.pathname = url.pathname.substring("/api/auth".length);
        url.hostname = "127.0.0.1";
        url.port = port.toString();
        await spawn();
        return url;
    }

    return { match }
}
