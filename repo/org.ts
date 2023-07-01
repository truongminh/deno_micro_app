import { FromMongoData, db } from "./db.ts";

export interface Org {
    id: string;
    name: string;
    code: string;
    parent_id?: string;
}

export async function ListOrg() {
    const filter = {};
    const docs = await db.collection("org").find(filter).toArray();
    const orgs = FromMongoData.Many<Org>(docs);
    return orgs;
}
