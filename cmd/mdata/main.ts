import app from "./app.ts";
import { logger } from "../../lib/log.ts";
const PORT = Number(Deno.env.get('PORT')) || 3001;

logger.info(`listening on port ${PORT}`);
await app.listen({ port: PORT });
