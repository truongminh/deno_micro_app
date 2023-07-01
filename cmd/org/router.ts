import { Router } from "https://deno.land/x/oak/mod.ts";
import { logger } from "../../lib/log.ts";
import { Org } from "../../repo/org.ts";
import { FromMongoData, ToMongoData, db } from "../../repo/db.ts";
import { Rand } from "../../lib/sys.ts";

const OrgCollection = db.collection("org");
const newOrgId = () => Rand.uppercase(8);

async function listOrg() {
    const docs = await OrgCollection.find().toArray();
    const orgs = FromMongoData.Many<Org>(docs);
    return orgs;
}

async function addOrg(input: Partial<Org>) {
    const org = input;
    org.id = newOrgId();
    if (!org.code) {
        org.code = org.id;
    }
    if (!org.name) {
        org.name = org.code;
    }
    const doc = ToMongoData.One(org);
    await OrgCollection.insertOne(doc);
    return org;
}

async function getOrg(org_id:string) {
    const doc = await OrgCollection.findOne({_id: org_id});
    const org = FromMongoData.One<Org>(doc);
    return org;
}

async function updateOrg(org: Org, input: Partial<Org>) {
    if (input.code) {
        org.code = input.code;
    }
    if (input.name) {
        org.name = input.name;
    }
    const doc = ToMongoData.One(org);
    await OrgCollection.updateOne({_id: doc._id}, {$set: doc});
    return org;
}

async function deleteOrg(org: Org) {
    await OrgCollection.deleteOne({
        _id: org.id
    });
    return org;
}

/********************************************************************* */
const router = new Router();

router.get("/ping", (ctx) => {
    ctx.response.body = new Date();
});


router.get("/", async (ctx) => {
    ctx.response.body = await listOrg();
});

router.get("/:id", async (ctx) => {
    const org_id = ctx.params.id;
    ctx.response.body = await getOrg(org_id);
});

router.post("/", async (ctx) => {
    const body = ctx.request.body({ type: "json" });
    const input: Partial<Org> = await body.value;
    const org = await addOrg(input);
    ctx.response.body = org;
});

router.patch("/:id", async (ctx) => {
    const org_id = ctx.params.id;
    const org = await getOrg(org_id);
    const body = ctx.request.body({ type: "json" });
    const input: Partial<Org> = await body.value;
    await updateOrg(org, input);
    ctx.response.body = org;
});

router.delete("/:id", async (ctx) => {
    const org_id = ctx.params.id;
    const org = await getOrg(org_id);
    await deleteOrg(org);
    ctx.response.body = org;
});

const router_list = [...router.values()].map(v => `${v.path} ${v.methods.join(",")}`);
logger.info(router_list.join(";"));

export default router;
