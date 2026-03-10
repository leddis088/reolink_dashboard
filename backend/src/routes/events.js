const express = require("express");
const reolinkApi = require("../services/reolinkApi");

const router = express.Router();

// GET /api/events
router.get("/", (req, res) => {
    const events = reolinkApi.getAiEvents();

    const totals = events.reduce(
        (acc, e) => {
            acc.people += e.peopleCount;
            acc.trusted += e.trustedCount;
            acc.unknown += e.unknownCount;
            return acc;
        },
        { people: 0, trusted: 0, unknown: 0 }
    );

    res.json({ events, totals });
});

module.exports = router;