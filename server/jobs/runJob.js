const { JobRun } = require('../models');

/**
 * Wraps a job function with logging, deduplication, and error handling.
 * @param {string} name - The name of the job
 * @param {function} fn - The async function to execute
 * @param {string} interval - 'daily' or 'hourly' to determine the run key
 */
async function runJob(name, fn, interval = 'daily') {
    let dateKey;
    if (interval === 'hourly') {
        dateKey = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Kolkata', hour12: false });
        // en-CA gives YYYY-MM-DD, so with time it looks like YYYY-MM-DD, HH:MM:SS
        // We just want YYYY-MM-DD-HH
        dateKey = dateKey.replace(/, /, '-').split(':')[0];
    } else {
        dateKey = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    }
    
    const runId = `${name}:${dateKey}`;
    
    try {
        // Unique index on runId prevents concurrent double runs
        await JobRun.create({ runId, name, status: 'running', startedAt: new Date() });
    } catch (e) {
        // If it already exists, another instance is running it or it already ran
        console.log(`[Job] ${name} skipped. Run ID ${runId} already exists.`);
        return { skipped: true, reason: 'Already running/completed' };
    }

    try {
        console.log(`[Job] ${name} starting (${runId})...`);
        const result = await fn();
        await JobRun.updateOne({ runId }, { status: 'success', finishedAt: new Date(), result });
        console.log(`[Job] ${name} completed successfully.`);
        return { success: true, result };
    } catch (err) {
        console.error(`[Job] ${name} failed:`, err);
        await JobRun.updateOne({ runId }, { status: 'failed', finishedAt: new Date(), error: err.message });
        return { success: false, error: err.message };
    }
}

module.exports = { runJob };
