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
  not_interested: -10,
  game_open: 1,
  game_start: 2,
  game_answer: 2,
  game_answer_correct: 5,
  game_answer_wrong: 1,
  game_complete: 6,
  game_room_created: 3,
  game_room_joined: 3,
  game_rematch: 4
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

async function processUserEvent(userIdOrEvent, eventType, targetType, targetId, metadata) {
    let userId = userIdOrEvent;
    if (typeof userIdOrEvent === 'object' && userIdOrEvent !== null) {
        userId = userIdOrEvent.userId;
        eventType = userIdOrEvent.eventType;
        targetType = userIdOrEvent.targetType;
        targetId = userIdOrEvent.targetId;
        metadata = userIdOrEvent.metadata;
    }
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
        } else if (targetType === 'game' || targetType === 'gameQuestion' || targetType === 'gameSession') {
            // Game Entity Propagation (e.g. answering question about Mahesh Babu or Pushpa)
            if (metadata && typeof metadata === 'object') {
                if (metadata.movieId) {
                    const curr = interest.entities.movies.get(String(metadata.movieId)) || 0;
                    interest.entities.movies.set(String(metadata.movieId), curr + (baseScore * PROPAGATION_MULTIPLIERS.MOVIE));
                }
                if (metadata.actorId) {
                    const curr = interest.entities.actors.get(String(metadata.actorId)) || 0;
                    interest.entities.actors.set(String(metadata.actorId), curr + (baseScore * PROPAGATION_MULTIPLIERS.ACTOR));
                }
                if (metadata.songId) {
                    const curr = interest.entities.songs.get(String(metadata.songId)) || 0;
                    interest.entities.songs.set(String(metadata.songId), curr + (baseScore * PROPAGATION_MULTIPLIERS.SONG));
                }
                if (metadata.genre) {
                    const curr = interest.genres.get(String(metadata.genre)) || 0;
                    interest.genres.set(String(metadata.genre), curr + (baseScore * PROPAGATION_MULTIPLIERS.GENRE));
                }
            }
        }

        await interest.save();
    } catch (err) {
        console.error('Error processing user interest:', err);
    }
}

async function generateCinemaWrapped(userId) {
    const interest = await UserInterest.findOne({ userId });
    
    const getTop = (map) => {
        if (!map || map.size === 0) return null;
        let topKey = null;
        let maxScore = -1;
        for (const [key, score] of map.entries()) {
            if (score > maxScore) {
                maxScore = score;
                topKey = key;
            }
        }
        return topKey;
    };
    
    const favoriteMovieId = interest && interest.entities ? getTop(interest.entities.movies) : null;
    const favoriteActor = interest && interest.entities ? getTop(interest.entities.actors) : null;
    const favoriteGenre = interest ? getTop(interest.genres) : null;
    
    const UserEvent = require('./models').UserEvent;
    const reactionEvents = await UserEvent.find({ userId, eventType: 'reaction' });
    
    let massCount = 0;
    let otherCount = 0;
    
    reactionEvents.forEach(e => {
        if (e.metadata && e.metadata.reaction === 'mass') {
            massCount++;
        } else {
            otherCount++;
        }
    });
    
    const totalReactions = massCount + otherCount;
    let massPercent = 50;
    let classPercent = 50;
    
    if (totalReactions > 0) {
        massPercent = Math.round((massCount / totalReactions) * 100);
        classPercent = 100 - massPercent;
    }
    
    return {
        favoriteMovieId,
        favoriteActor,
        favoriteGenre,
        vibe: `You're ${massPercent}% Mass, ${classPercent}% Class`,
        totalReactions
    };
}

module.exports = { processUserEvent, SIGNAL_WEIGHTS, generateCinemaWrapped };
