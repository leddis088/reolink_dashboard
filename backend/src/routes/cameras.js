const express = require("express");
const reolinkApi = require("../services/reolinkApi");

const router = express.Router();

// GET /api/cameras
router.get("/", (req, res) => {
    const cameras = reolinkApi.getCameraMetadata();
    res.json({ cameras });
});

module.exports = router;