export type {
    Document as MongoDocument,
} from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { Document, MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

async function Connect(url: string) {
    const client = new MongoClient();
    const db_url = new URL(url);
    if (!db_url.searchParams.has("authMechanism")) {
        db_url.searchParams.set("authMechanism", "SCRAM-SHA-1");
    }
    await client.connect(db_url.toString());
    const db_name = db_url.pathname.split("/", 2)[1];
    const db = client.database(db_name);
    const BoxCollection = db.collection("box");
    async function ping() {
        await BoxCollection.findOne();
    }
    await ping();
    return db;
}

function rename_idToId(doc: any) {
    if (!doc) {
        return null;
    }
    const { _id, ...obj } = doc;
    return { id: _id, ...obj };
}

function renameIdTo_id(doc: any) {
    if (!doc) {
        return null;
    }
    const { id, ...obj } = doc;
    return { _id: id, ...obj };
}

export const ToMongoData = {
    Many<T>(records: T[]): Document[] {
        return records.map(renameIdTo_id);
    },
    One<T>(record: T): Document {
        return renameIdTo_id(record);
    }
}

export const FromMongoData = {
    Many<T>(docs: Document[]): T[] {
        return docs.map(rename_idToId);
    },
    One<T>(doc: Document | undefined): T {
        return rename_idToId(doc);
    }
}

import { logger } from "../lib/log.ts";

const DB_URL = Deno.env.get('DB_URL');

if (!DB_URL) {
    logger.error("missing DB_URL env");
    Deno.exit(1);
}

export const db = await Connect(DB_URL);

