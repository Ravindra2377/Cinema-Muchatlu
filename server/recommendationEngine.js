const { UserInterest, CulturePost } = require('./models');

// Treat these as configuration, easy to experiment with later
const SIGNAL_WEIGHTS = {
  feed_impression: 0,
  post_open: 1,
  movie_open: 2,
  song_play: 2,
  meaningful_view: 3,
  reaction: 4,
  comment: 5,
  save: 6,
  share: 7,
  follow: 8,
  not_interested: -10
};

// Configurable constants
const DECAY_RATE_PER_DAY = parseFloat(process.env.INTEREST_DECAY || '0.05'); // Lose 5% (or configured amount) of interest score per day of inactivity
const PROPAGATION_MULTIPLIERS = {
    DIRECT: 1.0,
    ACTOR: 0.4,
    MOVIE: 0.5,
    SONG: 0.4,
    GENRE: 0.5
};

async function processUserEvent(userId, eventType, targetType, targetId, metadata) {
    if (!userId) return; // Skip anonymous for now, but ready for sessionId logic later

    try {
        let interest = await UserInterest.findOne({ userId });
        if (!interest) {
            interest = new UserInterest({ userId });
        }

        const now = new Date();
        const daysSinceUpdate = (now - interest.lastUpdated) / (1000 * 60 * 60 * 24);
        
        // Apply time decay if it's been more than a day
        if (daysSinceUpdate > 1) {
            const decayFactor = Math.max(0.1, 1 - (daysSinceUpdate * DECAY_RATE_PER_DAY));
            
            const applyDecay = (map) => {
                for (let [key, val] of map.entries()) {
                    const newVal = val * decayFactor;
                    if (newVal < 0.1) {
                        map.delete(key);
                    } else {
                        map.set(key, newVal);
                    }
                }
            };
            
            applyDecay(interest.entities.movies);
            applyDecay(interest.entities.actors);
            applyDecay(interest.entities.songs);
            applyDecay(interest.genres);
            applyDecay(interest.contentTypes);
        }
        interest.lastUpdated = now;

        const baseScore = SIGNAL_WEIGHTS[eventType] || 0;
        if (baseScore === 0) return; // e.g. impressions don't boost interest yet

        // Process based on target
        if (targetType === 'culturePost') {
            const post = await CulturePost.findById(targetId);
            if (post) {
                // Track Content Type Interest
                const currTypeScore = interest.contentTypes.get(post.type) || 0;
                interest.contentTypes.set(post.type, currTypeScore + baseScore);

                // Entity Propagation (Graph Walking)
                if (post.movieId) {
                    const currMovie = interest.entities.movies.get(post.movieId) || 0;
                    interest.entities.movies.set(post.movieId, currMovie + (baseScore * PROPAGATION_MULTIPLIERS.MOVIE));
                }
                if (post.actorId) {
                    const currActor = interest.entities.actors.get(post.actorId) || 0;
                    interest.entities.actors.set(post.actorId, currActor + (baseScore * PROPAGATION_MULTIPLIERS.ACTOR));
                }
                if (post.songId) {
                    const currSong = interest.entities.songs.get(post.songId) || 0;
                    interest.entities.songs.set(post.songId, currSong + (baseScore * PROPAGATION_MULTIPLIERS.SONG));
                }
            }
        } else if (targetType === 'movie') {
            const currMovie = interest.entities.movies.get(targetId) || 0;
            interest.entities.movies.set(targetId, currMovie + (baseScore * PROPAGATION_MULTIPLIERS.DIRECT));
        } else if (targetType === 'song') {
            const currSong = interest.entities.songs.get(targetId) || 0;
            interest.entities.songs.set(targetId, currSong + (baseScore * PROPAGATION_MULTIPLIERS.DIRECT));
        }

        await interest.save();
    } catch (err) {
        console.error('Error processing user interest:', err);
    }
}

module.exports = { processUserEvent, SIGNAL_WEIGHTS };
