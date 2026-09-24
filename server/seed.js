// ============================================
// Cinema Muchatlu - Database Seed Script
// Populates MongoDB with sample movies & discussions
// Run: node seed.js
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const { Movie, Discussion } = require('./models');

const SAMPLE_MOVIES = [
    {
        title: 'The Shawshank Redemption', year: 1994,
        genres: ['Drama'], rating: 9.3,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'], contentType: 'Movie'
    },
    {
        title: 'The Dark Knight', year: 2008,
        genres: ['Action', 'Drama'], rating: 9.0,
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'], contentType: 'Movie'
    },
    {
        title: 'Inception', year: 2010,
        genres: ['Sci-Fi', 'Action'], rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'], contentType: 'Movie'
    },
    {
        title: 'Pulp Fiction', year: 1994,
        genres: ['Drama', 'Thriller'], rating: 8.9,
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        director: 'Quentin Tarantino',
        cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'], contentType: 'Movie'
    },
    {
        title: 'Interstellar', year: 2014,
        genres: ['Sci-Fi', 'Drama'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], contentType: 'Movie'
    },
    {
        title: 'The Matrix', year: 1999,
        genres: ['Sci-Fi', 'Action'], rating: 8.7,
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        director: 'The Wachowskis',
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'], contentType: 'Movie'
    },
    {
        title: 'Goodfellas', year: 1990,
        genres: ['Drama', 'Thriller'], rating: 8.7,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.',
        director: 'Martin Scorsese',
        cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'], contentType: 'Movie'
    },
    {
        title: 'Fight Club', year: 1999,
        genres: ['Drama', 'Thriller'], rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much more.',
        director: 'David Fincher',
        cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'], contentType: 'Movie'
    },
    {
        title: 'Forrest Gump', year: 1994,
        genres: ['Drama', 'Comedy'], rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        director: 'Robert Zemeckis',
        cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'], contentType: 'Movie'
    },
    {
        title: 'The Godfather', year: 1972,
        genres: ['Drama', 'Thriller'], rating: 9.2,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        director: 'Francis Ford Coppola',
        cast: ['Marlon Brando', 'Al Pacino', 'James Caan'], contentType: 'Movie'
    },
    {
        title: 'Gladiator', year: 2000,
        genres: ['Action', 'Drama'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
        director: 'Ridley Scott',
        cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'], contentType: 'Movie'
    },
    {
        title: 'The Prestige', year: 2006,
        genres: ['Drama', 'Thriller'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have.',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Hugh Jackman', 'Scarlett Johansson'], contentType: 'Movie'
    },
    {
        title: 'The Departed', year: 2006,
        genres: ['Drama', 'Thriller'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.',
        director: 'Martin Scorsese',
        cast: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson'], contentType: 'Movie'
    },
    {
        title: 'Whiplash', year: 2014,
        genres: ['Drama'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.',
        director: 'Damien Chazelle',
        cast: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'], contentType: 'Movie'
    },
    {
        title: 'The Silence of the Lambs', year: 1991,
        genres: ['Thriller', 'Horror'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.',
        director: 'Jonathan Demme',
        cast: ['Jodie Foster', 'Anthony Hopkins', 'Lawrence A. Bonney'], contentType: 'Movie'
    },
    {
        title: 'Saving Private Ryan', year: 1998,
        genres: ['Action', 'Drama'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed.',
        director: 'Steven Spielberg',
        cast: ['Tom Hanks', 'Matt Damon', 'Tom Sizemore'], contentType: 'Movie'
    },
    {
        title: 'Se7en', year: 1995,
        genres: ['Thriller', 'Horror'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
        director: 'David Fincher',
        cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey'], contentType: 'Movie'
    },
    {
        title: 'The Green Mile', year: 1999,
        genres: ['Drama'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
        director: 'Frank Darabont',
        cast: ['Tom Hanks', 'Michael Clarke Duncan', 'David Morse'], contentType: 'Movie'
    },
    {
        title: 'The Usual Suspects', year: 1995,
        genres: ['Thriller', 'Drama'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met.',
        director: 'Bryan Singer',
        cast: ['Kevin Spacey', 'Gabriel Byrne', 'Chazz Palminteri'], contentType: 'Movie'
    },
    {
        title: 'The Lion King', year: 1994,
        genres: ['Drama', 'Comedy'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        director: 'Roger Allers, Rob Minkoff',
        cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'], contentType: 'Movie'
    }
];

const SAMPLE_DISCUSSIONS = [
    {
        userId: new mongoose.Types.ObjectId(),
        username: 'MuchatluAdmin',
        title: 'What makes a perfect movie ending?',
        content: "I've been thinking about what makes a movie ending truly memorable. Is it the twist, the emotional payoff, or something else entirely? What are your thoughts?",
        likes: 15, likedBy: [],
        timestamp: new Date(Date.now() - 86400000 * 2)
    },
    {
        userId: new mongoose.Types.ObjectId(),
        username: 'MuchatluAdmin',
        title: "Christopher Nolan's best work?",
        content: "Nolan has given us so many masterpieces - Inception, The Dark Knight, Interstellar, The Prestige. Which one do you think is his magnum opus and why?",
        likes: 23, likedBy: [],
        timestamp: new Date(Date.now() - 86400000 * 5)
    },
    {
        userId: new mongoose.Types.ObjectId(),
        username: 'MuchatluAdmin',
        title: 'Underrated movies that deserve more love',
        content: "Let's talk about those hidden gems that didn't get the recognition they deserved. What are some underrated movies you think everyone should watch?",
        likes: 18, likedBy: [],
        timestamp: new Date(Date.now() - 86400000 * 7)
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Movie.deleteMany({});
        await Discussion.deleteMany({});
        console.log('🗑️  Cleared existing movies and discussions');

        // Insert movies
        const movies = await Movie.insertMany(SAMPLE_MOVIES);
        console.log(`🎬 Inserted ${movies.length} sample movies`);

        // Insert discussions
        const discussions = await Discussion.insertMany(SAMPLE_DISCUSSIONS);
        console.log(`💬 Inserted ${discussions.length} sample discussions`);

        console.log('\n✅ Seed complete! Your database is ready.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
