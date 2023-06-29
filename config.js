const auth_app = {
    id: "auth",
    cwd: "cmd/auth",
    exe: "deno",
    args: ["run", "--watch", "--allow-net", "--allow-read", "--allow-env", "main.ts"],
    http: {
        port: 3001,
        path: "/api/auth",
    }
};

const mdata_app = {
    id: "mdata",
    cwd: "cmd/mdata",
    exe: "deno",
    args: ["run", "--watch", "--allow-net", "--allow-read", "--allow-env", "main.ts"],
    http: {
        port: 3002,
        path: "/api/mdata",
    }
};

export const apps = [auth_app, mdata_app];
