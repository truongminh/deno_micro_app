import { FromMongoData, db } from "./db.ts";

export interface MasterData {
    id: string;
    group: string;
    code: string;
    value: string;
    order: number;
    xp: any;
}

export async function ListMasterData(group?: string) {
    const filter = {} as any;
    if (group) {
        filter.group = group;
    }
    const docs = await db.collection("mdata").find(filter).toArray();
    const mdata_list: MasterData[] = FromMongoData.Many(docs);
    return mdata_list;
}