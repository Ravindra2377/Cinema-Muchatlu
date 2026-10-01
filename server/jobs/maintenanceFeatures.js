const { UserInterest, GameSession } = require('../models');

/**
 * Recommendation decay (2:00 AM IST)
 * Reduce all UserInterest scores by 5% so old habits age out.
 */
async function recommendationDecay() {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    let usersProcessed = 0;

    // Fetch all user interests
    const userInterests = await UserInterest.find({});
    for (const interest of userInterests) {
        let changed = false;

        // Helper to decay a map
        const decayMap = (map) => {
            if (!map) return;
            for (const [key, value] of map.entries()) {
                const newValue = value * 0.95;
                if (newValue < 0.1) {
                    map.delete(key);
                } else {
                    map.set(key, newValue);
                }
                changed = true;
            }
        };

        if (interest.entities) {
            decayMap(interest.entities.movies);
            decayMap(interest.entities.actors);
            decayMap(interest.entities.songs);
        }
        decayMap(interest.genres);
        decayMap(interest.contentTypes);

        if (changed) {
            interest.lastUpdated = new Date();
            await interest.save();
            usersProcessed++;
        }
    }

    return { processed_users: usersProcessed, date: today };
}

/**
 * Cleanup Rooms (Hourly)
 * Clean up abandoned rooms and sessions older than 2 hours.
 */
async function cleanupRooms() {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const result = await GameSession.updateMany(
        {
            status: { $in: ['waiting', 'active'] },
            createdAt: { $lt: twoHoursAgo }
        },
        {
            $set: { status: 'abandoned' }
        }
    );

    return { abandoned_sessions: result.modifiedCount };
}

module.exports = {
    recommendationDecay,
    cleanupRooms
};
