const config = require("../config");

function log(...args) {
    console.log("[reolink-dashboard]", ...args);
}

function debug(...args) {
    if (config.env === "development") {
        console.debug("[reolink-dashboard:debug]", ...args);
    }
}

function error(...args) {
    console.error("[reolink-dashboard:error]", ...args);
}

module.exports = { log, debug, error };