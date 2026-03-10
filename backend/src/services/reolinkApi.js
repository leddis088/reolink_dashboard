const config = require("../config");
const { debug } = require("../util/logger");
// const axios = require("axios"); // Uncomment if you implement real HTTP calls
// const faceRecognition = require("./faceRecognition");

function getCameraMetadata() {
    // Only safe logical metadata
    return config.reolink.cameras.map((c) => ({
        id: c.id,
        name: c.name,
        location: c.location,
        // Public HLS path; nginx + ffmpeg will serve this
        streamPath: `/streams/${c.id}.m3u8`
    }));
}

// TODO: implement using Reolink HTTP API (GetDevInfo, GetAiState, etc.)
function getHealthSnapshot() {
    const now = new Date();
    const cams = getCameraMetadata();

    return cams.map((cam, index) => {
        const uptimeHours = 24 * (index + 1);
        const temp = 35 + (index % 4);
        const bitrate = 4 + (index % 3) * 0.7;

        let status = "ok";
        if (temp > 55) status = "warn";
        if (temp > 65) status = "crit";

        return {
            id: cam.id,
            name: cam.name,
            location: cam.location,
            status,
            uptimeHours,
            temperature: temp,
            bitrateMbps: bitrate,
            lastAiEvent:
                index % 3 === 0 ? "Person detected 2 min ago" : "No recent activity",
            lastCheck: now.toISOString()
        };
    });
}

// TODO: implement using Reolink AI + faceRecognition pipeline
function getAiEvents() {
    const cams = getCameraMetadata();
    const now = new Date();

    const events = cams.map((cam, index) => {
        const hasActivity = index % 3 === 0;
        const trustedCount = hasActivity ? (index % 2 === 0 ? 1 : 0) : 0;
        const unknownCount = hasActivity ? (index % 2 === 1 ? 1 : 0) : 0;
        const peopleCount = trustedCount + unknownCount;

        const trustedNames =
            trustedCount === 0 ? [] : ["Alice", "Bob"].slice(0, trustedCount);

        return {
            id: cam.id,
            name: cam.name,
            location: cam.location,
            peopleCount,
            trustedCount,
            unknownCount,
            trustedNames,
            lastEvent:
                peopleCount > 0
                    ? `Person detected at ${now.toISOString()}`
                    : "No activity"
        };
    });

    debug("Generated dummy AI events for", events.length, "cameras");
    return events;
}

module.exports = {
    getCameraMetadata,
    getHealthSnapshot,
    getAiEvents
};