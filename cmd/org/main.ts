import router from "./router.ts";
import { logger } from "../../lib/log.ts";
import { NewHttpApp } from "../../lib/http.ts";
const PORT = Number(Deno.env.get('PORT')) || 3002;
const app = NewHttpApp(router);
logger.info(`listening on port ${PORT}`);
await app.listen({ port: PORT });
