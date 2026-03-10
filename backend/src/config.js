const fs = require("fs");
const path = require("path");
require("dotenv").config();

function loadJsonSafe(filePath, fallback) {
    try {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

const localCfgPath = path.join(__dirname, "..", "config", "config.local.json");
const exampleCfgPath = path.join(
    __dirname,
    "..",
    "config",
    "config.example.json"
);

const fileConfig = loadJsonSafe(
    localCfgPath,
    loadJsonSafe(exampleCfgPath, { server: {}, reolink: { cameras: [] } })
);

const env = process.env.NODE_ENV || "development";

const config = {
    env,
    server: {
        port: parseInt(process.env.PORT || fileConfig.server.port || 4000, 10),
        allowedOrigin:
            process.env.ALLOWED_ORIGIN ||
            fileConfig.server.allowedOrigin ||
            "http://localhost:8080"
    },
    reolink: {
        defaultUser: process.env.REOLINK_DEFAULT_USER || "admin",
        defaultPassword: process.env.REOLINK_DEFAULT_PASSWORD || "",
        cameras: fileConfig.reolink.cameras || []
    }
};

module.exports = config;