const denoApp = {
    args: ["run", "--watch", "--allow-net", "--allow-read", "--allow-env", "main.ts"],
}

const auth_app = {
    id: "auth",
    cwd: "cmd/auth",
    exe: "deno",
    args: denoApp.args,
    http: {
        port: 3001,
        path: "/api/auth",
    }
};

const mdata_app = {
    id: "mdata",
    cwd: "cmd/mdata",
    exe: "deno",
    args: denoApp.args,
    http: {
        port: 3003,
        path: "/api/mdata",
    }
};

const org_app = {
    id: "org",
    cwd: "cmd/org",
    exe: "deno",
    args: denoApp.args,
    http: {
        port: 3002,
        path: "/api/org",
    }
};

export const apps = [
    auth_app, org_app, mdata_app
];
