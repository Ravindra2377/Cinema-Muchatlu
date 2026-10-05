const { DailyFeature, Reminder, Notification } = require('../models');
const axios = require('axios');

const TMDB_API = 'https://api.tmdb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Sync upcoming releases from TMDB and cache them.
 */
async function syncUpcomingReleases() {
    const today = new Date().toISOString().split('T')[0];
    const indLangs = 'hi|te|ta|ml|kn|mr|bn';
    const enLangs = 'en';
    const urlInd = `${TMDB_API}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${indLangs}&primary_release_date.gte=${today}&sort_by=primary_release_date.asc&page=1`;
    const urlEn = `${TMDB_API}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${enLangs}&primary_release_date.gte=${today}&sort_by=primary_release_date.asc&page=1`;
    
    const [resInd, resEn] = await Promise.all([axios.get(urlInd), axios.get(urlEn)]);
    const movies = [...resInd.data.results, ...resEn.data.results]
        .filter(m => !JSON.stringify(m).toLowerCase().includes('ullu'))
        .slice(0, 20);
    
    // Save to DailyFeature so we don't hit TMDB directly on every request
    const dateKey = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    
    await DailyFeature.updateOne(
        { dateKey, type: 'upcoming_movies' },
        { data: movies },
        { upsert: true }
    );
    
    return { synced_count: movies.length, date: dateKey };
}

/**
 * Send "releasing today" notifications to everyone who tapped Remind Me.
 */
async function sendReminders() {
    // Determine 'today' in IST
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    
    // Find all reminders for movies releasing today that haven't been notified yet
    const pendingReminders = await Reminder.find({
        releaseDate: today,
        isNotified: false
    });
    
    let notificationsSent = 0;
    
    for (const reminder of pendingReminders) {
        // Create Notification
        await Notification.create({
            userId: reminder.userId,
            type: 'reminder',
            actorName: 'System', // Automated
            // Custom field for message or we handle 'reminder' type in frontend differently
        });
        
        // Mark as notified
        reminder.isNotified = true;
        await reminder.save();
        notificationsSent++;
    }
    
    return { notifications_sent: notificationsSent, date: today };
}

module.exports = {
    syncUpcomingReleases,
    sendReminders
};
