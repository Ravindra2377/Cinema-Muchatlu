const { CulturePost, DailyFeature, Notification, User, UserEvent, GameSession } = require('../models');

/**
 * Muchatlu Autopost (7:00 AM)
 * Auto-post threads such as "🎵 Song of the Day", "🧩 Today's Puzzle" into the culture graph.
 */
async function muchatluAutopost() {
    const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    let createdPosts = 0;

    // 1. Post Song of the Day
    const songFeature = await DailyFeature.findOne({ dateKey: todayKey, type: 'song' });
    if (songFeature) {
        const songData = songFeature.data;
        const songPostExists = await CulturePost.findOne({ 'metadata.isDailySong': true, 'metadata.dateKey': todayKey });
        if (!songPostExists) {
            await CulturePost.create({
                type: 'trivia',
                title: `🎵 Song of the Day: ${songData.title}`,
                content: `Today's featured track is ${songData.title} by ${songData.artist}. What's your favorite line from this song?`,
                media: songData.thumbnailUrl,
                songId: songData.providerId,
                authorName: 'Cinema Muchatlu Bot',
                tags: ['SongOfTheDay', 'Music'],
                metadata: { isDailySong: true, dateKey: todayKey }
            });
            createdPosts++;
        }
    }

    // 2. Post Today's Puzzle
    const puzzleFeature = await DailyFeature.findOne({ dateKey: todayKey, type: 'puzzle' });
    if (puzzleFeature) {
        const puzzleData = puzzleFeature.data;
        const puzzlePostExists = await CulturePost.findOne({ 'metadata.isDailyPuzzle': true, 'metadata.dateKey': todayKey });
        if (!puzzlePostExists) {
            await CulturePost.create({
                type: 'poll',
                title: `🧩 Today's Puzzle is Live!`,
                content: `Test your knowledge with today's ${puzzleData.gameType} challenge. Play now in the Arcade!`,
                authorName: 'Cinema Muchatlu Bot',
                tags: ['Puzzle', 'DailyChallenge'],
                metadata: { isDailyPuzzle: true, dateKey: todayKey }
            });
            createdPosts++;
        }
    }

    return { created_posts: createdPosts, date: todayKey };
}

/**
 * Meme Digest (9:00 AM)
 * Fetch the most-reacted meme of the last 24h and notify active users.
 */
async function memeDigest() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find the most reacted meme in the last 24 hours
    const memes = await CulturePost.find({ 
        type: 'meme', 
        createdAt: { $gte: yesterday } 
    }).sort({ 'reactions.mass': -1, 'reactions.lol': -1 }).limit(1);

    if (memes.length > 0) {
        const topMeme = memes[0];
        
        // Find users who have been active recently (e.g. users who have UserEvents in the last 7 days)
        const activeUsersDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUserIds = await UserEvent.distinct('userId', { timestamp: { $gte: activeUsersDate }, userId: { $ne: null } });

        let notificationsSent = 0;
        for (const userId of activeUserIds) {
            await Notification.create({
                userId,
                type: 'mention', // using mention as a fallback for generic alert
                actorName: 'Meme Bot',
                discussionId: topMeme._id // Linking to the post
            });
            notificationsSent++;
        }

        return { meme_id: topMeme._id, notifications_sent: notificationsSent };
    }

    return { message: 'No memes found in the last 24h' };
}

/**
 * Streak Nudge (8:00 PM)
 * Remind users to play the puzzle if they haven't yet today.
 */
async function streakNudge() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all users who played ANY game recently to constitute "active game users"
    // To keep it simple, find users with a streak > 0 in any game mode, or just users who haven't played today.
    // We check UserEvent for 'game_complete' today.
    const activeTodayUserIds = await UserEvent.distinct('userId', { 
        eventType: 'game_complete',
        timestamp: { $gte: today },
        userId: { $ne: null }
    });

    // Find all active users overall
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPlayers = await UserEvent.distinct('userId', {
        eventType: 'game_complete',
        timestamp: { $gte: thirtyDaysAgo },
        userId: { $ne: null }
    });

    // Users to nudge are recent players who haven't played today
    const usersToNudge = recentPlayers.filter(id => !activeTodayUserIds.map(String).includes(String(id)));

    let notificationsSent = 0;
    for (const userId of usersToNudge) {
        await Notification.create({
            userId,
            type: 'reminder',
            actorName: 'Arcade Master'
        });
        notificationsSent++;
    }

    return { users_nudged: notificationsSent };
}

module.exports = {
    muchatluAutopost,
    memeDigest,
    streakNudge
};
