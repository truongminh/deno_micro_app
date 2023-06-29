import { FromMongoData, db } from "./db.ts";

export interface User {
    id: string;
    username: string;
}

export async function ListUser() {
    const docs = await db.collection("user").find().toArray();
    const users: User[] = FromMongoData.Many(docs);
    return users;
}
