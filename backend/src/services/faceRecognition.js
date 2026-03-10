function classifyDetectedPeople(rawDetections) {
    return rawDetections.map((det) => ({
        cameraId: det.cameraId,
        people: [
            // Example: one trusted, one unknown
            { name: "Alice", trusted: true },
            { name: null, trusted: false }
        ],
        timestamp: det.timestamp
    }));
}

module.exports = {
    classifyDetectedPeople
};