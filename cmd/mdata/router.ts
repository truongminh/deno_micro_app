import { Router } from "https://deno.land/x/oak/mod.ts";
import { logger } from "../../lib/log.ts";
import { ListMasterData } from "../../repo/mdata.ts";

const router = new Router();

router.get("/mdata/list", async (ctx) => {
    ctx.response.body = await ListMasterData();
});

router.get("/ping", (ctx) => {
    ctx.response.body = new Date();
});

const router_list = [...router.values()].map(v => `${v.path} ${v.methods.join(",")}`);
logger.info(router_list.join(";"));

export default router;
