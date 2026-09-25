require('dotenv').config();
const mongoose = require('mongoose');
const { Movie } = require('./models');

const TELUGU_MOVIES = [
    {
        title: 'RRR', year: 2022, genres: ['Action', 'Drama'], rating: 8.8,
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
        director: 'S.S. Rajamouli', cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt'], contentType: 'Movie'
    },
    {
        title: 'Baahubali: The Beginning', year: 2015, genres: ['Action', 'Drama'], rating: 8.0,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.',
        director: 'S.S. Rajamouli', cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'], contentType: 'Movie'
    },
    {
        title: 'Baahubali 2: The Conclusion', year: 2017, genres: ['Action', 'Drama'], rating: 8.2,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
        director: 'S.S. Rajamouli', cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'], contentType: 'Movie'
    },
    {
        title: 'Pushpa: The Rise', year: 2021, genres: ['Action', 'Thriller'], rating: 7.6,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate, making some powerful enemies in the process.',
        director: 'Sukumar', cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna'], contentType: 'Movie'
    },
    {
        title: 'Mahanati', year: 2018, genres: ['Biography', 'Drama'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'Biography of Savitri, an actress from South India movie industry, who ruled the industry for two decades during 50s and 60s.',
        director: 'Nag Ashwin', cast: ['Keerthy Suresh', 'Dulquer Salmaan', 'Samantha Ruth Prabhu'], contentType: 'Movie'
    },
    {
        title: 'Arjun Reddy', year: 2017, genres: ['Drama', 'Romance'], rating: 8.0,
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'A short-tempered house surgeon gets used to drugs and drinks when his girlfriend is forced to marry another person.',
        director: 'Sandeep Reddy Vanga', cast: ['Vijay Deverakonda', 'Shalini Pandey', 'Jia Sharma'], contentType: 'Movie'
    },
    {
        title: 'Eega', year: 2012, genres: ['Action', 'Comedy'], rating: 7.7,
        posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: 'A murdered man is reincarnated as a housefly and seeks to avenge his death.',
        director: 'S.S. Rajamouli', cast: ['Sudeep', 'Nani', 'Samantha Ruth Prabhu'], contentType: 'Movie'
    },
    {
        title: 'Jersey', year: 2019, genres: ['Drama', 'Sport'], rating: 8.5,
        posterUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'A failed cricketer decides to revive his cricketing career in his late 30s despite everyone being skeptical of his ability to do so.',
        director: 'Gowtam Tinnanuri', cast: ['Nani', 'Shraddha Srinath', 'Sathyaraj'], contentType: 'Movie'
    },
    {
        title: 'Ala Vaikunthapurramuloo', year: 2020, genres: ['Action', 'Comedy'], rating: 7.3,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'Fate plays a vital role in the life of Bantu, who discovers his true parentage and sets out to carve a place for himself within the family he truly belongs to.',
        director: 'Trivikram Srinivas', cast: ['Allu Arjun', 'Pooja Hegde', 'Tabu'], contentType: 'Movie'
    },
    {
        title: 'Rangasthalam', year: 2018, genres: ['Action', 'Drama'], rating: 8.4,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'The fear of his elder brother\'s death forces a partially deaf sound engineer to act against the village\'s tyrannical leader.',
        director: 'Sukumar', cast: ['Ram Charan', 'Samantha Ruth Prabhu', 'Aadhi Pinisetty'], contentType: 'Movie'
    },
    {
        title: 'Sita Ramam', year: 2022, genres: ['Action', 'Drama', 'Romance'], rating: 8.6,
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'An orphan soldier, Lieutenant Ram\'s life changes, after he gets a letter from a girl named Sita. He meets her and love blossoms between them.',
        director: 'Hanu Raghavapudi', cast: ['Dulquer Salmaan', 'Mrunal Thakur', 'Rashmika Mandanna'], contentType: 'Movie'
    },
    {
        title: 'C/o Kancharapalem', year: 2018, genres: ['Drama'], rating: 8.9,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'Four unconventional love stories set in the town and neighborhood of Kancharapalem.',
        director: 'Venkatesh Maha', cast: ['Subba Rao Vepada', 'Radha Bessy', 'Kesava Karri'], contentType: 'Movie'
    },
    {
        title: 'Agent Sai Srinivasa Athreya', year: 2019, genres: ['Comedy', 'Crime'], rating: 8.4,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'A brilliant, underrated detective from Nellore gets into trouble when he investigates the case of a dead body found near a railway track.',
        director: 'Swaroop Rsj', cast: ['Naveen Polishetty', 'Shruti Sharma', 'Shredha Rajagopalan'], contentType: 'Movie'
    },
    {
        title: 'Pellichoopulu', year: 2016, genres: ['Comedy', 'Romance'], rating: 8.2,
        posterUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: 'Prashanth is a lazy youngster whose father wants him to get married so that he will become responsible. He meets Chitra during a matchmaking event and things change.',
        director: 'Tharun Bhascker Dhaassyam', cast: ['Vijay Deverakonda', 'Ritu Varma', 'Priyadarshi'], contentType: 'Movie'
    },
    {
        title: 'Goodachari', year: 2018, genres: ['Action', 'Thriller'], rating: 7.9,
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'A young NSA agent is framed for the murder of his bosses, making him realize that his mission is darker than expected.',
        director: 'Sashi Kiran Tikka', cast: ['Adivi Sesh', 'Sobhita Dhulipala', 'Jagapathi Babu'], contentType: 'Movie'
    },
    {
        title: 'Mathu Vadalara', year: 2019, genres: ['Comedy', 'Crime'], rating: 8.2,
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'A delivery boy trying to make a quick buck gets involved in a murder mystery.',
        director: 'Ritesh Rana', cast: ['Sri Simha Koduri', 'Satya', 'Naresh Agastya'], contentType: 'Movie'
    },
    {
        title: 'Kshanam', year: 2016, genres: ['Mystery', 'Thriller'], rating: 8.2,
        posterUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'Rishi comes to India from the US to help his ex-girlfriend find her kidnapped daughter.',
        director: 'Ravikanth Perepu', cast: ['Adivi Sesh', 'Adah Sharma', 'Anasuya Bharadwaj'], contentType: 'Movie'
    },
    {
        title: 'Magadheera', year: 2009, genres: ['Action', 'Drama', 'Fantasy'], rating: 7.7,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'A bike stuntman recalls his previous life as a warrior, and pursues his love\'s reincarnation.',
        director: 'S.S. Rajamouli', cast: ['Ram Charan', 'Kajal Aggarwal', 'Dev Gill'], contentType: 'Movie'
    },
    {
        title: 'Evaru', year: 2019, genres: ['Crime', 'Drama'], rating: 8.2,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'Sub-inspector Vikram Vasudev is entrusted with the task of investigating the murder of a high-ranking officer who was killed by his alleged rape victim.',
        director: 'Venkat Ramji', cast: ['Adivi Sesh', 'Regina Cassandra', 'Naveen Chandra'], contentType: 'Movie'
    },
    {
        title: 'HIT: The First Case', year: 2020, genres: ['Action', 'Crime'], rating: 7.6,
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'An officer of the \'Homicide Intervention Team\' who frequently suffers from panic attacks must overcome his past trauma to solve a missing person case.',
        director: 'Sailesh Kolanu', cast: ['Vishwak Sen', 'Ruhani Sharma', 'Murli Sharma'], contentType: 'Movie'
    }
];

async function seedTelugu() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing movies to only have Telugu ones
        await Movie.deleteMany({});
        console.log('🗑️  Cleared existing movies');

        // Insert movies
        const movies = await Movie.insertMany(TELUGU_MOVIES);
        console.log(`🎬 Inserted ${movies.length} Telugu movies into the database!`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seedTelugu();
