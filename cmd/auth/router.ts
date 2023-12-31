import { Router } from "https://deno.land/x/oak/mod.ts";
import { logger } from "../../lib/log.ts";

const router = new Router();

router.get("/ping", (ctx) => {
    ctx.response.body = new Date();
});

const router_list = [...router.values()].map(v => `${v.path} ${v.methods.join(",")}`);
logger.info(router_list.join(";"));

export default router;
