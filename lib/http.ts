import { Application, Router } from "https://deno.land/x/oak/mod.ts";

export function NewHttpApp(router: Router) {
    const app = new Application();
    // Timing
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.response.headers.set("X-Response-Time", `${ms}ms`);
        console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
    });
    
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use((ctx) => {
        ctx.response.body = `not found`;
    });
    return app;
}