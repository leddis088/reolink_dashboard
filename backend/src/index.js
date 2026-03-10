const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config");
const { log } = require("./util/logger");

const camerasRouter = require("./routes/cameras");
const eventsRouter = require("./routes/events");
const healthRouter = require("./routes/health");

const app = express();

// Security headers – CSP is better set in nginx for static files
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

// CORS: only your frontend origin
app.use(
    cors({
        origin: config.server.allowedOrigin,
        methods: ["GET"],
        credentials: false
    })
);

// Logging
app.use(
    morgan(config.env === "development" ? "dev" : "combined")
);

app.use(express.json());

// API routes
app.use("/api/cameras", camerasRouter);
app.use("/api/events", eventsRouter);
app.use("/api/health", healthRouter);

// In dev you can also serve the frontend from here
if (config.env === "development") {
    const publicDir = path.join(__dirname, "..", "..", "frontend", "public");
    app.use("/", express.static(publicDir));
}

// 404 for unknown API paths
app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Generic error handler – don't leak details
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(config.server.port, () => {
    log(
        `Backend listening on port ${config.server.port} in ${config.env} mode`
    );
});