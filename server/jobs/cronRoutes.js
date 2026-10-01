const express = require('express');
const router = express.Router();
const { runJob } = require('./runJob');
const { JobRun } = require('../models');

const { pregeneratePuzzles, generateSongOfDay } = require('./dailyFeatures');
const { syncUpcomingReleases, sendReminders } = require('./upcomingFeatures');
const { recommendationDecay, cleanupRooms } = require('./maintenanceFeatures');
const { muchatluAutopost, memeDigest, streakNudge } = require('./cultureFeatures');

// Add job functions here as they are built
const JOBS = {
    'test': async () => { return { message: 'Test job completed' }; },
    'daily_puzzle': pregeneratePuzzles,
    'song_of_day': generateSongOfDay,
    'upcoming_sync': syncUpcomingReleases,
    'send_reminders': sendReminders,
    'recommendation_decay': recommendationDecay,
    'cleanup_rooms': cleanupRooms,
    'muchatlu_autopost': muchatluAutopost,
    'meme_digest': memeDigest,
    'streak_nudge': streakNudge
};

// POST /api/cron/:job - Run a specific job via HTTP
router.post('/:job', async (req, res) => {
    // Basic security: CRON_SECRET header
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';
    if (req.headers['x-cron-secret'] !== cronSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const jobName = req.params.job;
    const jobFn = JOBS[jobName];

    if (!jobFn) {
        return res.status(404).json({ error: 'Job not found' });
    }

    // Determine interval from query, default to daily
    const interval = req.query.interval === 'hourly' ? 'hourly' : 'daily';

    // We can await the job, or return 202 Accepted and let it run
    // For small jobs, awaiting is fine. For Render, we have a 100s timeout.
    try {
        const result = await runJob(jobName, jobFn, interval);
        if (result.skipped) {
            return res.json({ message: 'Job skipped', reason: result.reason });
        }
        res.json({ message: 'Job completed', result });
    } catch (err) {
        console.error(`Error executing cron endpoint for ${jobName}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/cron/status - Get all job runs (for admin dashboard)
router.get('/status', async (req, res) => {
    // Need admin auth here in a real app, but for now we'll just return it
    // assuming it's protected by the same mechanism or used internally
    try {
        const runs = await JobRun.find().sort({ startedAt: -1 }).limit(50);
        res.json(runs);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching job status' });
    }
});

module.exports = router;
