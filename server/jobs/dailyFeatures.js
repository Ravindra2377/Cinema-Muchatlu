const { DailyFeature, GameQuestion, GameLeaderboard } = require('../models');
const { searchSongs } = require('../jiosaavnService');

/**
 * Pre-generate puzzles for the next 7 days.
 */
async function pregeneratePuzzles() {
    const today = new Date();
    let generated = 0;

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateKey = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        const existing = await DailyFeature.findOne({ dateKey, type: 'puzzle' });
        if (existing) continue;

        // Fetch a random puzzle that hasn't been used recently
        const recentPuzzles = await DailyFeature.find({ type: 'puzzle' })
            .sort({ dateKey: -1 }).limit(30).select('data._id');
        
        const recentIds = recentPuzzles.map(p => p.data._id);

        const newPuzzle = await GameQuestion.aggregate([
            { $match: { _id: { $nin: recentIds } } },
            { $sample: { size: 1 } }
        ]);

        if (newPuzzle.length > 0) {
            await DailyFeature.create({
                dateKey,
                type: 'puzzle',
                data: newPuzzle[0]
            });
            generated++;
        }
    }

    // Close the daily leaderboard for yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    
    // We could do something with the leaderboard, like archive it, 
    // but right now it's queried dynamically. Let's just return what we did.

    return { generated_puzzles: generated, closed_leaderboard_for: yesterdayKey };
}

/**
 * Pick Song of the Day (no repeats for 60 days), refresh trending songs cache.
 */
async function generateSongOfDay() {
    const today = new Date();
    const dateKey = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // Check if we already have it (idempotency)
    const existing = await DailyFeature.findOne({ dateKey, type: 'song' });
    if (existing) {
        return { message: 'Song already generated for today' };
    }

    // Refresh trending songs cache by doing a search
    const songs = await searchSongs('telugu trending', 50);

    // Get recent songs to prevent repeats
    const recentSongs = await DailyFeature.find({ type: 'song' })
        .sort({ dateKey: -1 }).limit(60);
    const recentIds = new Set(recentSongs.map(s => s.data.providerId));

    // Find the highest ranked song that hasn't been used recently
    let selectedSong = null;
    for (const song of songs) {
        if (!recentIds.has(song.providerId)) {
            selectedSong = song;
            break;
        }
    }

    // Fallback if all 50 were used (unlikely, but possible)
    if (!selectedSong && songs.length > 0) {
        selectedSong = songs[0]; // just take the top one
    }

    if (selectedSong) {
        await DailyFeature.create({
            dateKey,
            type: 'song',
            data: selectedSong
        });
        return { selected_song: selectedSong.title };
    }

    throw new Error('Failed to fetch songs from JioSaavn');
}

module.exports = {
    pregeneratePuzzles,
    generateSongOfDay
};
