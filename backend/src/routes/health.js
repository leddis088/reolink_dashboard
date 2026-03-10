const express = require("express");
const reolinkApi = require("../services/reolinkApi");

const router = express.Router();

// GET /api/health
router.get("/", (req, res) => {
    const health = reolinkApi.getHealthSnapshot();

    const totals = health.reduce(
        (acc, h) => {
            if (h.status === "ok") acc.ok++;
            if (h.status === "warn") acc.warn++;
            if (h.status === "crit") acc.crit++;
            acc.tempSum += h.temperature;
            acc.bitrateSum += h.bitrateMbps;
            return acc;
        },
        { ok: 0, warn: 0, crit: 0, tempSum: 0, bitrateSum: 0 }
    );

    const count = health.length || 1;

    res.json({
        health,
        summary: {
            online: totals.ok + totals.warn + totals.crit,
            ok: totals.ok,
            warn: totals.warn,
            crit: totals.crit,
            avgTemp: totals.tempSum / count,
            avgBitrate: totals.bitrateSum / count
        }
    });
});

module.exports = router;