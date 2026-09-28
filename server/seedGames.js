// ============================================
// Cinema Muchatlu - Game Question Bank Seeder
// Seeds rich, curated Telugu pop-culture questions
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const { Game, GameQuestion } = require('./models');

const INITIAL_GAMES = [
    {
        gameType: 'guess_movie',
        title: 'Guess the Movie',
        description: 'Test your Telugu cinema knowledge with plot clues, emojis, cast, and posters!',
        icon: '🎬',
        supportedModes: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        defaultRounds: 10,
        difficultyLevels: ['easy', 'medium', 'hard'],
        isActive: true
    },
    {
        gameType: 'guess_dialogue',
        title: 'Guess the Dialogue',
        description: 'Identify iconic punch dialogues, characters, and epic one-liners from Tollywood history!',
        icon: '🗣️',
        supportedModes: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        defaultRounds: 10,
        difficultyLevels: ['easy', 'medium', 'hard'],
        isActive: true
    },
    {
        gameType: 'guess_song',
        title: 'Guess the Song',
        description: 'Listen to short musical previews and guess the track, movie, singer, or composer!',
        icon: '🎵',
        supportedModes: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        defaultRounds: 10,
        difficultyLevels: ['easy', 'medium', 'hard'],
        isActive: true
    }
];

// ============================================
// 1. GUESS THE MOVIE (55+ questions)
// ============================================
const MOVIE_QUESTIONS = [
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Which Telugu blockbuster matches these emojis?',
        clues: ['🪓', '🪵', '🔴', '🚛'],
        options: ['Pushpa: The Rise', 'Rangasthalam', 'KGF', 'Waltair Veerayya'],
        correctAnswer: 'Pushpa: The Rise',
        explanation: 'Red sandalwood smuggling syndicate led by Pushpa Raj (Allu Arjun).',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Pushpa: The Rise'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['👑', '🗡️', '🐘', '🏰'],
        options: ['Baahubali: The Beginning', 'Magadheera', 'Sye Raa Narasimha Reddy', 'Rudramadevi'],
        correctAnswer: 'Baahubali: The Beginning',
        explanation: 'S.S. Rajamouli’s epic Mahishmati kingdom saga starring Prabhas.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Baahubali: The Beginning'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🪰', '🕶️', '💉', '💥'],
        options: ['Eega', 'Robo', 'Aparichithudu', 'Awe!'],
        correctAnswer: 'Eega',
        explanation: 'A murdered lover reincarnates as a housefly to take revenge on Sudeep.',
        difficulty: 'easy',
        actorId: 'Nani',
        movieId: 'Eega'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🏏', '❤️', '🩺', '🚂'],
        options: ['Jersey', 'Majili', 'Dear Comrade', 'Golconda High School'],
        correctAnswer: 'Jersey',
        explanation: 'Nani plays Arjun, a 36-year-old cricketer fighting for his son Nani\'s jersey wish.',
        difficulty: 'easy',
        actorId: 'Nani',
        movieId: 'Jersey'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🏍️', '⏳', '⚔️', '🦅'],
        options: ['Magadheera', 'Bimbisara', 'Karthikeya 2', 'Yamadonga'],
        correctAnswer: 'Magadheera',
        explanation: 'Kala Bhairava is reincarnated 400 years later as Harsha the stunt biker.',
        difficulty: 'easy',
        actorId: 'Ram Charan',
        movieId: 'Magadheera'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['👨‍⚕️', '💊', '🕶️', '🏍️'],
        options: ['Arjun Reddy', 'Baby', 'Geetha Govindam', 'RX 100'],
        correctAnswer: 'Arjun Reddy',
        explanation: 'Vijay Deverakonda plays a high-functioning alcoholic house surgeon.',
        difficulty: 'easy',
        actorId: 'Vijay Deverakonda',
        movieId: 'Arjun Reddy'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🕵️‍♂️', '🔍', '🚂', '🍟'],
        options: ['Agent Sai Srinivasa Athreya', 'Goodachari', 'HIT', 'Kshanam'],
        correctAnswer: 'Agent Sai Srinivasa Athreya',
        explanation: 'Naveen Polishetty runs FBI Nellore and cracks an unclaimed railway bodies racket.',
        difficulty: 'easy',
        actorId: 'Naveen Polishetty',
        movieId: 'Agent Sai Srinivasa Athreya'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['👂', '📻', '🚜', '🐍'],
        options: ['Rangasthalam', 'Palasa 1978', 'Dasara', 'Uppena'],
        correctAnswer: 'Rangasthalam',
        explanation: 'Chitti Babu (Ram Charan) with hearing impairment fights the President of Rangasthalam.',
        difficulty: 'easy',
        actorId: 'Ram Charan',
        movieId: 'Rangasthalam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Which movie featured this powerhouse combo?',
        clues: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Director: S.S. Rajamouli'],
        options: ['RRR', 'Simhadri', 'Magadheera', 'Aravinda Sametha'],
        correctAnswer: 'RRR',
        explanation: 'Komaram Bheem and Alluri Sitarama Raju unite against the British Crown.',
        difficulty: 'easy',
        actorId: 'Ram Charan',
        movieId: 'RRR'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Which film starred Allu Arjun and Pooja Hegde, directed by Trivikram?',
        clues: ['Allu Arjun', 'Pooja Hegde', 'Tabu', 'Music by Thaman S'],
        options: ['Ala Vaikunthapurramuloo', 'DJ: Duvvada Jagannadham', 'Julayi', 'Race Gurram'],
        correctAnswer: 'Ala Vaikunthapurramuloo',
        explanation: 'Bantu discovers he was switched at birth by Valmiki (Murali Sharma).',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Ala Vaikunthapurramuloo'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A delivery boy trying to make quick cash finds a dead body inside an apartment flat.',
        clues: ['Delivery boy protagonist', 'Sleeping pills drama', 'Crime comedy'],
        options: ['Mathu Vadalara', 'Brochevarevarura', 'Jathi Ratnalu', 'Cinema Bandi'],
        correctAnswer: 'Mathu Vadalara',
        explanation: 'Sri Simha and Satya star in this hilarious thriller directed by Ritesh Rana.',
        difficulty: 'medium',
        actorId: 'Sri Simha',
        movieId: 'Mathu Vadalara'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'Three jobless friends from Jogipet go to Hyderabad and land up in prison on assassination charges.',
        clues: ['Jogipet Srikanth', 'Anudeep K.V. direction', 'Swan comedy'],
        options: ['Jathi Ratnalu', 'Pellichoopulu', 'MAD', 'Ee Nagaraniki Emaindi'],
        correctAnswer: 'Jathi Ratnalu',
        explanation: 'Naveen Polishetty, Priyadarshi, and Rahul Ramakrishna in Jogipet madness.',
        difficulty: 'easy',
        actorId: 'Naveen Polishetty',
        movieId: 'Jathi Ratnalu'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'Four friends meet at a bachelor party in Goa and decide to finally make a short film.',
        clues: ['Goa trip', 'Director Vivek Athreya', 'Pelli Choopulu spiritual cousin'],
        options: ['Ee Nagaraniki Emaindi', 'Pellichoopulu', 'C/o Kancharapalem', 'Keedaa Cola'],
        correctAnswer: 'Ee Nagaraniki Emaindi',
        explanation: 'Tharun Bhascker\'s cult buddy-comedy with Vishwak Sen and Abhinav Gomatam.',
        difficulty: 'medium',
        actorId: 'Vishwak Sen',
        movieId: 'Ee Nagaraniki Emaindi'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A professional hitman takes shelter in a quiet joint family in a Godavari village after a political killing goes wrong.',
        clues: ['Nandu / Pardhu', 'Directed by Trivikram Srinivas', 'Trisha & Mahesh Babu'],
        options: ['Athadu', 'Pokiri', 'Khaleja', 'Okkadu'],
        correctAnswer: 'Athadu',
        explanation: 'Mahesh Babu as Nandu pretending to be Pardhu in Basarlapudi.',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Athadu'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A taxi driver goes to a remote desert village in Rajasthan and is revered as God by the dying villagers.',
        clues: ['Siddha theology', 'Trivikram + Mahesh Babu', 'Anushka Shetty as Subashini'],
        options: ['Khaleja', 'Athadu', '1: Nenokkadine', 'Spyder'],
        correctAnswer: 'Khaleja',
        explanation: 'Mahesh Babu as Alluri Seetharama Raju in the cult classic Khaleja.',
        difficulty: 'medium',
        actorId: 'Mahesh Babu',
        movieId: 'Khaleja'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Which movie featured Mahesh Babu as an undercover cop infiltrator Krishna Manohar?',
        clues: ['Ileana D\'Cruz', 'Puri Jagannadh', 'Ali as Beggar Ali'],
        options: ['Pokiri', 'Dookudu', 'Businessman', 'Aagadu'],
        correctAnswer: 'Pokiri',
        explanation: 'Pandu reveals himself as IPS Krishna Manohar in the iconic climax.',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Pokiri'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An orphan soldier stationed in Kashmir receives romantic letters from an unknown girl named Sita Mahalakshmi.',
        clues: ['Lieutenant Ram', 'Dulquer Salmaan & Mrunal Thakur', '1960s war backdrop'],
        options: ['Sita Ramam', 'Mahanati', 'Kanche', 'Major'],
        correctAnswer: 'Sita Ramam',
        explanation: 'Hanu Raghavapudi’s poetic period romance.',
        difficulty: 'easy',
        actorId: 'Dulquer Salmaan',
        movieId: 'Sita Ramam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'year_clue',
        prompt: 'Which game-changing Tollywood hit released in 2017 showed Vijay Deverakonda as a fiery non-conformist doctor?',
        clues: ['Released in August 2017', 'Music by Radhan', 'Directed by Sandeep Reddy Vanga'],
        options: ['Arjun Reddy', 'Fidaa', 'Ninnu Kori', 'Middle Class Abbayi'],
        correctAnswer: 'Arjun Reddy',
        explanation: 'Arjun Reddy redefined new-age Telugu cinema in 2017.',
        difficulty: 'easy',
        actorId: 'Vijay Deverakonda',
        movieId: 'Arjun Reddy'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'Four cross-generational love stories unfold in a quaint seaside suburb of Visakhapatnam.',
        clues: ['Venkatesh Maha debut', 'Non-professional local actors', 'Sundaram, Joseph, Radha'],
        options: ['C/o Kancharapalem', 'Palasa 1978', 'Balagam', 'Color Photo'],
        correctAnswer: 'C/o Kancharapalem',
        explanation: 'Critically acclaimed anthology indie film by Venkatesh Maha.',
        difficulty: 'medium',
        actorId: 'Subba Rao',
        movieId: 'C/o Kancharapalem'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An ex-policeman returns from the US to help his former sweetheart find her mysteriously kidnapped 3-year-old daughter.',
        clues: ['Adivi Sesh', 'Adah Sharma', 'Ravikanth Perepu direction'],
        options: ['Kshanam', 'Goodachari', 'Evaru', 'HIT: The First Case'],
        correctAnswer: 'Kshanam',
        explanation: 'Kshanam launched the modern resurgence of Telugu tight thrillers.',
        difficulty: 'medium',
        actorId: 'Adivi Sesh',
        movieId: 'Kshanam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'A young RAW-style agent codenamed 116 must prove his innocence after his mentor is killed.',
        clues: ['Adivi Sesh', 'Sobhita Dhulipala', 'Trinetra Agency'],
        options: ['Goodachari', 'Major', 'Kshanam', 'Spyder'],
        correctAnswer: 'Goodachari',
        explanation: 'Adivi Sesh as Agent Gopi / 116 in Sashi Kiran Tikka\'s espionage hit.',
        difficulty: 'easy',
        actorId: 'Adivi Sesh',
        movieId: 'Goodachari'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An HIT officer suffering from panic attacks searches for a missing young college girl named Preethi.',
        clues: ['Vishwak Sen as Vikram Rudraraju', 'Directed by Sailesh Kolanu', 'KD forensic thriller'],
        options: ['HIT: The First Case', 'HIT: The Second Case', 'Evaru', 'Agent Sai Srinivasa Athreya'],
        correctAnswer: 'HIT: The First Case',
        explanation: 'Vishwak Sen leads the crime branch investigative thriller.',
        difficulty: 'medium',
        actorId: 'Vishwak Sen',
        movieId: 'HIT: The First Case'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Which biopic saw Keerthy Suresh win a National Award for depicting the legendary South Indian actress?',
        clues: ['Directed by Nag Ashwin', 'Dulquer as Gemini Ganesan', 'Samantha as Madhuravani'],
        options: ['Mahanati', 'Miss India', 'Sita Ramam', 'NTR Kathanayakudu'],
        correctAnswer: 'Mahanati',
        explanation: 'Keerthy Suresh portrayed the legendary Savitri Garu.',
        difficulty: 'easy',
        actorId: 'Keerthy Suresh',
        movieId: 'Mahanati'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🍲', '🚚', '💑', '💸'],
        options: ['Pellichoopulu', 'Ee Nagaraniki Emaindi', 'Chalo', 'Fidaa'],
        correctAnswer: 'Pellichoopulu',
        explanation: 'Prashanth and Chitra start a food truck business and find love.',
        difficulty: 'easy',
        actorId: 'Vijay Deverakonda',
        movieId: 'Pellichoopulu'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A greedy king usurps his brother\'s throne while the queen mother sends the newborn prince down a waterfall in a basket.',
        clues: ['Bhallaladeva', 'Sivagami holding infant out of water', 'Kattappa'],
        options: ['Baahubali: The Beginning', 'Baahubali 2: The Conclusion', 'Magadheera', 'Arundhati'],
        correctAnswer: 'Baahubali: The Beginning',
        explanation: 'The opening scene with Sivagami rescuing Mahendra Baahubali.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Baahubali: The Beginning'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A police officer poses as a corrupt cop in Coonoor to investigate an alleged sexual assault murder.',
        clues: ['Adivi Sesh as Vikram Vasudev', 'Regina Cassandra as Sameera', 'Inspired by The Invisible Guest'],
        options: ['Evaru', 'Kshanam', 'HIT', 'Goodachari'],
        correctAnswer: 'Evaru',
        explanation: 'Twist-filled courtroom and interrogation thriller directed by Venkat Ramji.',
        difficulty: 'hard',
        actorId: 'Adivi Sesh',
        movieId: 'Evaru'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A superstitious boy thinks bad luck follows him, while an antique golden fly-shaped bottle holds dark secrets.',
        clues: ['Tharun Bhascker in acting role', 'Brahmanandam in a wheelchair', 'Cockroach/Cola capsule'],
        options: ['Keedaa Cola', 'Mathu Vadalara', 'Agent Sai', 'Jathi Ratnalu'],
        correctAnswer: 'Keedaa Cola',
        explanation: 'Tharun Bhascker\'s eccentric crime caper with Chaitanya Rao and Brahmanandam.',
        difficulty: 'hard',
        actorId: 'Brahmanandam',
        movieId: 'Keedaa Cola'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A villager passes away, but the crow refuses to touch the funeral offerings until the divided family makes amends.',
        clues: ['Priyadarshi as Sailu', 'Telangana village funeral ritual', 'Directed by Venu Yeldandi'],
        options: ['Balagam', 'Mail', 'Cinema Bandi', 'Care of Kancharapalem'],
        correctAnswer: 'Balagam',
        explanation: 'Heartwarming village drama capturing cultural traditions and family ego.',
        difficulty: 'medium',
        actorId: 'Priyadarshi',
        movieId: 'Balagam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🐦‍⬛', '🌾', '🥁', '👨‍👩‍👧‍👦'],
        options: ['Balagam', 'Rangasthalam', 'Palasa 1978', 'Dasara'],
        correctAnswer: 'Balagam',
        explanation: 'Balagam’s central motif is the village crow offering ceremony.',
        difficulty: 'medium',
        actorId: 'Priyadarshi',
        movieId: 'Balagam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'In a rustic coal-mining town of Veerlapally, Dharani steals coal trains and fights for his friend Suri\'s love.',
        clues: ['Nani with de-glam rugged avatar', 'Keerthy Suresh as Vennela', 'Chammakkandra song'],
        options: ['Dasara', 'Pushpa', 'Rangasthalam', 'Shyam Singha Roy'],
        correctAnswer: 'Dasara',
        explanation: 'Srikanth Odela\'s gritty rustic action drama starring Nani.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Dasara'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['⛏️', '🚂', '🥃', '🩸'],
        options: ['Dasara', 'KGF', 'Pushpa', 'Salaar'],
        correctAnswer: 'Dasara',
        explanation: 'Veerlapally coal theft and high-octane local bar rivalries.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Dasara'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A young boy is obsessed with building a film camera found in an auto-rickshaw to show movies to his village.',
        clues: ['Auto driver Veera', 'P2 Panasonic camera', 'Indie hit on Netflix'],
        options: ['Cinema Bandi', 'Mail', 'C/o Kancharapalem', 'Mithunam'],
        correctAnswer: 'Cinema Bandi',
        explanation: 'Praveen Kandregula\'s delightful film celebrating rural filmmaking.',
        difficulty: 'hard',
        movieId: 'Cinema Bandi'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A writer who can remember his previous life fights to establish copyright on stories he wrote in 1970s Bengal.',
        clues: ['Nani as Vasu & Bengali reformer', 'Sai Pallavi as Rosie', 'Krithi Shetty'],
        options: ['Shyam Singha Roy', 'Magadheera', 'Eega', 'Manam'],
        correctAnswer: 'Shyam Singha Roy',
        explanation: 'Rahul Sankrityan directed Nani as the social reformer Shyam Singha Roy.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Shyam Singha Roy'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'Three generations of the Akkineni family reunite across reincarnations where parents become kids of their own children.',
        clues: ['ANR, Nagarjuna, Naga Chaitanya, Akhil', 'Samantha and Shriya Saran', 'Vikram Kumar direction'],
        options: ['Manam', 'Soggade Chinni Nayana', 'Bangarraju', 'Hello'],
        correctAnswer: 'Manam',
        explanation: 'Classic family reincarnation drama celebrating legendary ANR Garu.',
        difficulty: 'easy',
        actorId: 'Nagarjuna',
        movieId: 'Manam'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Which movie featured Pawan Kalyan as a cop in a rugged Rayalaseema town named Kondaveedu?',
        clues: ['Shruti Haasan', 'Harish Shankar direction', 'Kevvu Keka item song'],
        options: ['Gabbar Singh', 'Vakeel Saab', 'Attarintiki Daredi', 'Bheemla Nayak'],
        correctAnswer: 'Gabbar Singh',
        explanation: 'Pawan Kalyan as the swaggering Gabbar Singh.',
        difficulty: 'easy',
        actorId: 'Pawan Kalyan',
        movieId: 'Gabbar Singh'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A billionaire heir travels from Milan to Hyderabad pretending to be a car driver to reunite his estranged aunt with his grandfather.',
        clues: ['Gowtham Nanda / Siddhu', 'Nadiya as Sunanda Atta', 'Samantha & Pranitha Subhash'],
        options: ['Attarintiki Daredi', 'Ala Vaikunthapurramuloo', 'Julayi', 'S/O Satyamurthy'],
        correctAnswer: 'Attarintiki Daredi',
        explanation: 'Pawan Kalyan and Trivikram\'s industry hit of 2013.',
        difficulty: 'easy',
        actorId: 'Pawan Kalyan',
        movieId: 'Attarintiki Daredi'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Pawan Kalyan and Rana Daggubati clash as a strict police sub-inspector and an arrogant ex-havildar.',
        clues: ['Saagar K Chandra direction', 'Trivikram dialogues', 'Nithya Menen'],
        options: ['Bheemla Nayak', 'Vakeel Saab', 'Baahubali', 'Bro'],
        correctAnswer: 'Bheemla Nayak',
        explanation: 'Bheemla Nayak vs Daniel Shekar showdown.',
        difficulty: 'medium',
        actorId: 'Pawan Kalyan',
        movieId: 'Bheemla Nayak'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An arrogant engineering student falls for a feisty village girl in Bhanumathi who is pure Telangana grit.',
        clues: ['Varun Tej & Sai Pallavi', 'Shekhar Kammula direction', 'Vachinde song'],
        options: ['Fidaa', 'Love Story', 'Anand', 'Happy Days'],
        correctAnswer: 'Fidaa',
        explanation: 'Sai Pallavi stole hearts as the iconic Bhanumathi in Fidaa.',
        difficulty: 'easy',
        actorId: 'Sai Pallavi',
        movieId: 'Fidaa'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'Revanth, a Zumba instructor from an oppressed background, and Mounica, an upper-caste techie, bond over their shared passion for dance.',
        clues: ['Naga Chaitanya and Sai Pallavi', 'Zumba academy in Hyderabad', 'Saranga Dariya song'],
        options: ['Love Story', 'Fidaa', 'Majili', 'Shyam Singha Roy'],
        correctAnswer: 'Love Story',
        explanation: 'Shekhar Kammula\'s sensitive romance dealing with caste and survival.',
        difficulty: 'medium',
        actorId: 'Sai Pallavi',
        movieId: 'Love Story'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An aggressive former cricketer lives a sorrowful married life with his wife Sravani after being separated from his college love Anshu.',
        clues: ['Naga Chaitanya and Samantha', 'Cricket coach in Vizag', 'Priyamvada / Poorna character'],
        options: ['Majili', 'Jersey', 'Venky Mama', 'Ye Maaya Chesave'],
        correctAnswer: 'Majili',
        explanation: 'Naga Chaitanya and Samantha in Shiva Nirvana\'s heart-wrenching drama.',
        difficulty: 'medium',
        actorId: 'Naga Chaitanya',
        movieId: 'Majili'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Naga Chaitanya as Kartik falls in love with Jessie (Samantha) who lives upstairs in a Christian household.',
        clues: ['Gautham Vasudev Menon', 'A.R. Rahman soundtrack', 'Iconic Kerala church sequences'],
        options: ['Ye Maaya Chesave', 'Manam', 'Majili', '100% Love'],
        correctAnswer: 'Ye Maaya Chesave',
        explanation: 'The magical launch film of Samantha and Naga Chaitanya.',
        difficulty: 'easy',
        actorId: 'Naga Chaitanya',
        movieId: 'Ye Maaya Chesave'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🚢', '🌊', '🦈', '🗡️'],
        options: ['Devara: Part 1', 'Waltair Veerayya', 'Chatrapathi', 'Acharya'],
        correctAnswer: 'Devara: Part 1',
        explanation: 'NTR Jr. stars in Koratala Siva\'s coastal smuggling sea battle saga.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'Devara: Part 1'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'In a dystopian futuristic world set in Kasi, an ancient warrior Ashwatthama protects an unborn child from Supreme Yaskin.',
        clues: ['Prabhas as Bhairava', 'Amitabh Bachchan as Ashwatthama', 'Nag Ashwin direction'],
        options: ['Kalki 2898 AD', 'Salaar', 'Adipurush', 'Radhe Shyam'],
        correctAnswer: 'Kalki 2898 AD',
        explanation: 'Nag Ashwin\'s mythological sci-fi blockbuster.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Kalki 2898 AD'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Prabhas plays Deva who promises his friend Varadha that he will come whenever called in the brutal city-state of Khansaar.',
        clues: ['Prashanth Neel direction', 'Prithviraj Sukumaran', 'Shruti Haasan'],
        options: ['Salaar: Part 1 – Ceasefire', 'KGF', 'Kalki 2898 AD', 'Saaho'],
        correctAnswer: 'Salaar: Part 1 – Ceasefire',
        explanation: 'Prabhas as Devaratha Raisaar in the brutal action universe.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Salaar: Part 1 – Ceasefire'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A corrupt circle inspector in Hanamkonda pretends to lose his memory after an accident to escape an internal inquiry.',
        clues: ['Nani as Daya', 'Priyadarshi', 'Directed by Vivek Athreya'],
        options: ['Saripodhaa Sanivaaram', 'Ante Sundaraniki', 'Tuck Jagadish', 'Nenu Local'],
        correctAnswer: 'Saripodhaa Sanivaaram',
        explanation: 'Nani controls his rage throughout the week and unleashes it only on Saturdays.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Saripodhaa Sanivaaram'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'An orthodox Brahmin boy Sundar and a Christian girl Leela concoct elaborate fake medical stories to convince their conservative families.',
        clues: ['Nani and Nazriya Fahadh', 'Vivek Athreya direction', 'Hilarious lies spiral'],
        options: ['Ante Sundaraniki', 'Pellichoopulu', 'Sammohanam', 'Ninnu Kori'],
        correctAnswer: 'Ante Sundaraniki',
        explanation: 'Nani and Nazriya star in this charming family comedy-drama.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Ante Sundaraniki'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A brilliant student enters engineering college, falls in love, and forms lifelong friendship bonds through four university years.',
        clues: ['Chandu, Tyson, Rajesh, Appu', 'Sekhar Kammula direction', 'Mickey J Meyer music'],
        options: ['Happy Days', 'Premam', 'MAD', 'Kirrak Party'],
        correctAnswer: 'Happy Days',
        explanation: 'The iconic 2007 college youth film by Sekhar Kammula.',
        difficulty: 'easy',
        movieId: 'Happy Days'
    },
    {
        gameType: 'guess_movie',
        questionType: 'emoji_clue',
        prompt: 'Guess the movie from emojis:',
        clues: ['🚗', '⏳', '⌚', '🧠'],
        options: ['1: Nenokkadine', 'Spyder', 'Game Changer', 'Project Z'],
        correctAnswer: '1: Nenokkadine',
        explanation: 'Mahesh Babu as rockstar Gautham dealing with schizophrenia and revenge.',
        difficulty: 'medium',
        actorId: 'Mahesh Babu',
        movieId: '1: Nenokkadine'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A street-smart young man named Lucky has memory loss whenever he gets distracted, leading to hilarious complications with his girlfriend\'s father.',
        clues: ['Nani and Lavanya Tripathi', 'Maruthi direction', 'Murali Sharma as father'],
        options: ['Bhale Bhale Magadivoy', 'Nenu Local', 'Gentleman', 'Krishna Gaadi Veera Prema Gaadha'],
        correctAnswer: 'Bhale Bhale Magadivoy',
        explanation: 'Nani\'s landmark comedy blockbuster directed by Maruthi.',
        difficulty: 'easy',
        actorId: 'Nani',
        movieId: 'Bhale Bhale Magadivoy'
    },
    {
        gameType: 'guess_movie',
        questionType: 'plot_clue',
        prompt: 'A clever wedding photographer falls for a Muslim girl in old city Hyderabad and embarks on a high-stakes search for the hidden treasure of Lord Krishna.',
        clues: ['Nikhil Siddharth & Anupama Parameswaran', 'Dwaraka mystery', 'Directed by Chandoo Mondeti'],
        options: ['Karthikeya 2', 'Karthikeya', 'Spy', '18 Pages'],
        correctAnswer: 'Karthikeya 2',
        explanation: 'Pan-Indian adventure mystery hit centered around Lord Krishna\'s anklet.',
        difficulty: 'medium',
        actorId: 'Nikhil Siddharth',
        movieId: 'Karthikeya 2'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Balakrishna plays an NRI who returns to his father’s faction-ridden village in Seema to establish peace without lifting weapons initially.',
        clues: ['Boyapati Srinu direction', 'Radhika Apte', 'Double role with Jaidev'],
        options: ['Legend', 'Simha', 'Akhanda', 'Veera Simha Reddy'],
        correctAnswer: 'Legend',
        explanation: 'Balakrishna\'s blockbuster with Jagapathi Babu as ruthless villain Jitendra.',
        difficulty: 'easy',
        actorId: 'Balakrishna',
        movieId: 'Legend'
    },
    {
        gameType: 'guess_movie',
        questionType: 'actor_clue',
        prompt: 'Balakrishna plays a fierce Aghora who emerges from the Himalayas to protect innocent devotees and nature from a mining baron.',
        clues: ['Boyapati Srinu direction', 'Thaman S roaring BGM', 'Pragya Jaiswal'],
        options: ['Akhanda', 'Veera Simha Reddy', 'Legend', 'Bhagavanth Kesari'],
        correctAnswer: 'Akhanda',
        explanation: 'Balayya roaring as Akhanda in Boyapati\'s mass blockbuster.',
        difficulty: 'easy',
        actorId: 'Balakrishna',
        movieId: 'Akhanda'
    }
];

// ============================================
// 2. GUESS THE DIALOGUE (45+ questions)
// ============================================
const DIALOGUE_QUESTIONS = [
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Evadu kodithe dimma thirigi mind block aipoddo... aade Pandu gaadu!" Who delivered this iconic punch line?',
        clues: ['Superstar of Tollywood', 'Undercover IPS officer character', 'Directed by Puri Jagannadh'],
        options: ['Mahesh Babu', 'Pawan Kalyan', 'Allu Arjun', 'Ravi Teja'],
        correctAnswer: 'Mahesh Babu',
        explanation: 'Mahesh Babu delivered this historic punch dialogue in Pokiri (2006).',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Pokiri'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Taggede le!" (తగ్గేదే లే!) belongs to which blockbuster movie?',
        clues: ['Red sandalwood backdrop', 'Chittoor dialect', 'Directed by Sukumar'],
        options: ['Pushpa: The Rise', 'Rangasthalam', 'Arya 2', 'Ala Vaikunthapurramuloo'],
        correctAnswer: 'Pushpa: The Rise',
        explanation: 'Allu Arjun made "Taggede Le" a worldwide viral catchphrase in Pushpa.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Pushpa: The Rise'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'complete_dialogue',
        prompt: 'Complete the dialogue: "Okka saari commit aithe naa maata..."',
        clues: ['Pandu mindset', 'Absolute resolution', 'Pokiri punch'],
        options: ['Nene vinanu', 'Evvaru vinakkarledu', 'Nenante nene', 'Duniya motham vintadi'],
        correctAnswer: 'Nene vinanu',
        explanation: '"Okka saari commit aithe naa maata nene vinanu" — Pokiri.',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Pokiri'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Nee yamma thodu addamgaa narikestha!" — Who gave this blood-boiling declaration at the port?',
        clues: ['Directed by S.S. Rajamouli', 'Port refugee revolt', 'Young Rebel Star'],
        options: ['Prabhas', 'NTR Jr.', 'Gopichand', 'Ram Charan'],
        correctAnswer: 'Prabhas',
        explanation: 'Prabhas delivered this iconic dialogue as Shivaji in Chatrapathi (2005).',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Chatrapathi'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Okkokkadini kaadu saaho... vandalani okkesari pampu!" Which movie features this legendary battlefield line?',
        clues: ['Bhairavakona battle', '100 warriors fight', 'Reincarnation drama'],
        options: ['Magadheera', 'Baahubali', 'RRR', 'Simhadri'],
        correctAnswer: 'Magadheera',
        explanation: 'Ram Charan as Kala Bhairava in Rajamouli\'s Magadheera (2009).',
        difficulty: 'easy',
        actorId: 'Ram Charan',
        movieId: 'Magadheera'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Flute jinka mundu oodu, simham mundu kaadu!" Who uttered this high-voltage mass line?',
        clues: ['God of Masses', 'Boyapati Srinu film', 'Double role as Jaidev'],
        options: ['Nandamuri Balakrishna', 'Chiranjeevi', 'Nagarjuna', 'Venkatesh'],
        correctAnswer: 'Nandamuri Balakrishna',
        explanation: 'Balakrishna in Legend (2014) to Jagapathi Babu.',
        difficulty: 'easy',
        actorId: 'Balakrishna',
        movieId: 'Legend'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Naaku konchem thikka vundi... kaani daaniko lekkundi!" Which blockbuster movie is this from?',
        clues: ['Power Star Pawan Kalyan', 'Cop character', 'Harish Shankar direction'],
        options: ['Gabbar Singh', 'Attarintiki Daredi', 'Badri', 'Jalsa'],
        correctAnswer: 'Gabbar Singh',
        explanation: 'Pawan Kalyan as Gabbar Singh in 2012.',
        difficulty: 'easy',
        actorId: 'Pawan Kalyan',
        movieId: 'Gabbar Singh'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'complete_dialogue',
        prompt: 'Complete this epic Baahubali line: "Nenu Mahishmati Samrajya Senadhipathi Baahubali..."',
        clues: ['Coronation oath', 'Rana vs Prabhas', 'Rajamouli masterpiece'],
        options: ['Prajalane Daivamga Bhaavistu...', 'Anisina maata thappanu...', 'Nyayanni kaapadathaanu...', 'Sathyam kosam pranamistha...'],
        correctAnswer: 'Prajalane Daivamga Bhaavistu...',
        explanation: 'Amarendra Baahubali\'s oath during Bhallaladeva\'s coronation.',
        difficulty: 'medium',
        actorId: 'Prabhas',
        movieId: 'Baahubali 2: The Conclusion'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Preminchadam kante preminchabadadam lo unna sukham vere!" Which director-actor dialogue king made this famous?',
        clues: ['Matala Maanthrikudu writer', 'Son of Satyamurthy / Jalsa', 'Mahesh / Pawan films'],
        options: ['Trivikram Srinivas (Writer)', 'Puri Jagannadh', 'Sukumar', 'Koratala Siva'],
        correctAnswer: 'Trivikram Srinivas (Writer)',
        explanation: 'Classic philosophical dialogue crafted by Trivikram Srinivas.',
        difficulty: 'medium',
        movieId: 'Jalsa'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_character',
        prompt: '"Evvariki cheppoddu... cinema super hit!" Which beloved comedy character made this quote legendary?',
        clues: ['Food truck partner', 'Pellichoopulu', 'Played by Priyadarshi'],
        options: ['Kaushik', 'Chitra', 'Prashanth', 'Vivek'],
        correctAnswer: 'Kaushik',
        explanation: 'Priyadarshi played Kaushik in Tharun Bhascker\'s Pelli Choopulu.',
        difficulty: 'easy',
        actorId: 'Priyadarshi',
        movieId: 'Pellichoopulu'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Nenu meeku telusa? Nenu meeku baaga telusu... meeru nannu chudaledu, nenu mimmalni roju chustanu." Which movie opens with this eerie line?',
        clues: ['Directed by Trivikram', 'Mahesh Babu sniper intro', 'Keeravani/Mani Sharma music'],
        options: ['Athadu', 'Pokiri', 'Khaleja', '1: Nenokkadine'],
        correctAnswer: 'Athadu',
        explanation: 'Opening voiceover of Mahesh Babu as Nandu in Athadu (2005).',
        difficulty: 'medium',
        actorId: 'Mahesh Babu',
        movieId: 'Athadu'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Thokkukuntu povaale!" (తొక్కుకుంటూ పోవాలే!) Who roared this line during an emotional hospital scene?',
        clues: ['Komaram Bheem character', 'NTR Jr. in RRR', 'S.S. Rajamouli epic'],
        options: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Samuthirakani'],
        correctAnswer: 'N.T. Rama Rao Jr.',
        explanation: 'NTR Jr. as Bheem in RRR (2022).',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'RRR'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Choodu oka vaipu choosthe maro vaipu choodalanukoku... thadisthe thadisipothav!" Which movie features this lion roar?',
        clues: ['Faculty member vs Factionist', 'Directed by Boyapati', 'Sneha & Namitha'],
        options: ['Simha', 'Legend', 'Samarasimha Reddy', 'Narasimha Naidu'],
        correctAnswer: 'Simha',
        explanation: 'Balakrishna as Professor Srimannarayana in Simha (2010).',
        difficulty: 'easy',
        actorId: 'Balakrishna',
        movieId: 'Simha'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'complete_dialogue',
        prompt: 'Complete this iconic dialouge: "City ki eppudo vachamannadi kaadannayya... bullet digindaa..."',
        clues: ['Mahesh Babu', 'Puri Jagannadh', 'Surya Bhai in Mumbai'],
        options: ['Leda!', 'Chusava!', 'Kaalada!', 'Digaleda!'],
        correctAnswer: 'Leda!',
        explanation: '"City ki eppudo vachamannadi kaadannayya... bullet digindaa ledaa!" — Businessman (2012).',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Businessman'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Kopam ekkuva anukunte thappu... baadha ekkuva!" Who said this about his unhealed trauma?',
        clues: ['Directed by Gowtam Tinnanuri', 'Jersey cricketer', 'Shraddha Srinath co-star'],
        options: ['Nani', 'Vijay Deverakonda', 'Naga Chaitanya', 'Ram Charan'],
        correctAnswer: 'Nani',
        explanation: 'Nani as Arjun in the emotional sports drama Jersey.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Jersey'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Aravinda, Sametha Veera Raghava!" Which film is named after this profound peacemaking arc?',
        clues: ['Trivikram Srinivas direction', 'NTR Jr. & Pooja Hegde', 'Rayalaseema faction cessation'],
        options: ['Aravinda Sametha Veera Raghava', 'Janatha Garage', 'Nannaku Prematho', 'Dammu'],
        correctAnswer: 'Aravinda Sametha Veera Raghava',
        explanation: 'Trivikram and NTR Jr.\'s emotional reflection on the cost of faction violence.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'Aravinda Sametha Veera Raghava'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Aasa ki hadduntundi... guddalo dhammundali!" Which gritty Vijay Deverakonda film features this raw dialogue?',
        clues: ['Medical college dean conversation', 'Directed by Sandeep Reddy Vanga', 'Shalini Pandey'],
        options: ['Arjun Reddy', 'World Famous Lover', 'Dear Comrade', 'Liger'],
        correctAnswer: 'Arjun Reddy',
        explanation: 'Arjun Reddy Deshmukh confronting authority.',
        difficulty: 'medium',
        actorId: 'Vijay Deverakonda',
        movieId: 'Arjun Reddy'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Kattappa... Nuvvu kooda na?!" Who uttered this agonizing sentence before breathing his last?',
        clues: ['The question that shook India for 2 years', 'Mahishmati heir', 'Prabhas'],
        options: ['Amarendra Baahubali', 'Bhallaladeva', 'Bijjaladeva', 'Mahendra Baahubali'],
        correctAnswer: 'Amarendra Baahubali',
        explanation: 'Amarendra Baahubali asks Kattappa when struck from behind.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Baahubali 2: The Conclusion'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'complete_dialogue',
        prompt: 'Complete this line by Allu Arjun: "Nenu konchem soft ga kanipisthanu kaani... lopalunna vadu..."',
        clues: ['Race Gurram', 'Surender Reddy direction', 'Frustration mode'],
        options: ['Chaala violent!', 'Very dangerous!', 'Mentalodu!', 'Psychopath!'],
        correctAnswer: 'Chaala violent!',
        explanation: 'Allu Arjun as Lucky in Race Gurram (2014).',
        difficulty: 'medium',
        actorId: 'Allu Arjun',
        movieId: 'Race Gurram'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Babu chitti... asalu em jarigindante!" Which viral comedy movie made this narrative hook famous?',
        clues: ['Jogipet trio', 'Anudeep KV', 'Naveen Polishetty'],
        options: ['Jathi Ratnalu', 'Agent Sai Srinivasa Athreya', 'Mathu Vadalara', 'MAD'],
        correctAnswer: 'Jathi Ratnalu',
        explanation: 'Naveen Polishetty explaining his case in court in Jathi Ratnalu.',
        difficulty: 'easy',
        actorId: 'Naveen Polishetty',
        movieId: 'Jathi Ratnalu'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Nenu thaluchukunte nee aasthulanni teesi road meeda padeyagalanu!" Who played the menacing President in Rangasthalam?',
        clues: ['Veteran character artist', 'Erra kaluva leader', 'Phani Bhushan'],
        options: ['Jagapathi Babu', 'Prakash Raj', 'Rao Ramesh', 'Samuthirakani'],
        correctAnswer: 'Jagapathi Babu',
        explanation: 'Jagapathi Babu gave a chill-inducing performance as the village President.',
        difficulty: 'medium',
        actorId: 'Jagapathi Babu',
        movieId: 'Rangasthalam'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Gurtukostunnayi... gurtukostunnayi..." Which film featuring 4 friends has this famous drunk terrace scene?',
        clues: ['Tharun Bhascker film', 'Abhinav Gomatam dialogue', 'Kaushik hangover'],
        options: ['Ee Nagaraniki Emaindi', 'Pellichoopulu', 'MAD', 'Keedaa Cola'],
        correctAnswer: 'Ee Nagaraniki Emaindi',
        explanation: 'Abhinav Gomatam\'s iconic drunk comedy monologue in Ee Nagaraniki Emaindi.',
        difficulty: 'easy',
        actorId: 'Abhinav Gomatam',
        movieId: 'Ee Nagaraniki Emaindi'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Nuvvu nannu champalavu... kaani nenu ninnu champagalanu, elaago telusa? Neelo nannu brathikinchukoni!" Who said this romantic punch in Sita Ramam?',
        clues: ['Lieutenant Ram letter', 'Dulquer Salmaan', 'Mrunal Thakur'],
        options: ['Dulquer Salmaan', 'Sumanth', 'Tarun Bhascker', 'Tharun'],
        correctAnswer: 'Dulquer Salmaan',
        explanation: 'Ram wrote this unforgettable farewell letter to Sita Mahalakshmi.',
        difficulty: 'medium',
        actorId: 'Dulquer Salmaan',
        movieId: 'Sita Ramam'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_character',
        prompt: '"Cinema choodadaniki dabbulu kavali ra... dabbulu sampadinchadaniki cinema choodakkarledu!" Which character in Athadu said this witty satire?',
        clues: ['Sunil comedy role', 'Teashop / friend sequence', 'Trivikram writing'],
        options: ['Bujji', 'Nandu', 'Pardhu', 'Sadhu'],
        correctAnswer: 'Bujji',
        explanation: 'Sunil as Bujji in Athadu delivering classic Trivikram comedy lines.',
        difficulty: 'hard',
        actorId: 'Sunil',
        movieId: 'Athadu'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Cinema ante entertainment, entertainment, and entertainment!" Who roared this at a pre-release celebration?',
        clues: ['Megastar of Telugu Cinema', 'Indra, Tagore, Khaidi No. 150', 'Padma Vibhushan awardee'],
        options: ['Chiranjeevi', 'Balakrishna', 'Nagarjuna', 'Venkatesh'],
        correctAnswer: 'Chiranjeevi',
        explanation: 'Megastar Chiranjeevi celebrating the pure emotion of cinema.',
        difficulty: 'easy',
        actorId: 'Chiranjeevi',
        movieId: 'Khaidi No. 150'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Neeku maths vachu emo... naaku physics vachu!" In which movie does Nani deliver this smart class hero punch?',
        clues: ['Directed by Trinadha Rao Nakkina', 'Keerthy Suresh co-star', 'Nenu Local'],
        options: ['Nenu Local', 'Bhale Bhale Magadivoy', 'Gentleman', 'Middle Class Abbayi'],
        correctAnswer: 'Nenu Local',
        explanation: 'Nani as Babu in Nenu Local (2017).',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Nenu Local'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'complete_dialogue',
        prompt: 'Complete this dialogue: "Rey Sambha... raasuko!"',
        clues: ['Bala Krishna in Rayalaseema', 'Faction diary', 'Samarasimha Reddy'],
        options: ['Ninna jarigina charithra!', 'Inko murder add chey!', 'Malli record baddalaipoddi!', 'Nenu modalupettina yuddham!'],
        correctAnswer: 'Inko murder add chey!',
        explanation: 'Iconic faction trope popularized across Telugu cinema.',
        difficulty: 'easy',
        actorId: 'Balakrishna',
        movieId: 'Samarasimha Reddy'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'who_said_it',
        prompt: '"Yevadi gola vaadidi!" Who made this phrase immortal through his comedy title and acting?',
        clues: ['King of Comedy', 'Guinness World Record for acting', 'Over 1000 films'],
        options: ['Brahmanandam', 'Ali', 'M.S. Narayana', 'Dharmavarapu Subramanyam'],
        correctAnswer: 'Brahmanandam',
        explanation: 'Dr. Brahmanandam Garu made every dialogue he delivered unforgettable.',
        difficulty: 'easy',
        actorId: 'Brahmanandam',
        movieId: 'Yevadi Gola Vaadidi'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Devudu manishila puttadu antaru... manishi devudayithe ela untado chusara?" Which movie contemplates divinity in humanity?',
        clues: ['Mahesh Babu as savior Raju', 'Anushka Shetty', 'Rajasthan village setup'],
        options: ['Khaleja', 'Athadu', 'Okkadu', 'Maharshi'],
        correctAnswer: 'Khaleja',
        explanation: 'Prakash Raj\'s character discussing Mahesh Babu\'s accidental divinity in Khaleja.',
        difficulty: 'medium',
        actorId: 'Mahesh Babu',
        movieId: 'Khaleja'
    },
    {
        gameType: 'guess_dialogue',
        questionType: 'which_movie',
        prompt: '"Kopam tho kaadu... gouravam tho namaskaram pette roju vasthundi!" Which film features this dignified underdog line?',
        clues: ['Adivi Sesh', 'Trinetra recruitment', 'Spy thriller'],
        options: ['Goodachari', 'Major', 'Kshanam', 'Evaru'],
        correctAnswer: 'Goodachari',
        explanation: 'Adivi Sesh as Agent 116 in Goodachari.',
        difficulty: 'medium',
        actorId: 'Adivi Sesh',
        movieId: 'Goodachari'
    }
];

// ============================================
// 3. GUESS THE SONG (35+ questions)
// ============================================
const SONG_QUESTIONS = [
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: 'Which movie features the Oscar-winning dance anthem "Naatu Naatu"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        clues: ['Composed by M.M. Keeravaani', 'Choreographed by Prem Rakshith', 'NTR Jr. & Ram Charan hook step'],
        options: ['RRR', 'Pushpa: The Rise', 'Baahubali 2', 'Magadheera'],
        correctAnswer: 'RRR',
        explanation: '"Naatu Naatu" won the Academy Award for Best Original Song.',
        difficulty: 'easy',
        songId: 'naatu_naatu',
        movieId: 'RRR'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the viral romantic chartbuster "Srivalli" (చూపే బంగారమాయెనే శ్రీవల్లి)?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/188/Srivalli-From-Pushpa-The-Rise-Part-01-Telugu-2021-20211013110903-500x500.jpg',
        clues: ['Allu Arjun & Rashmika Mandanna', 'Music by Devi Sri Prasad', 'Famous slipper drag step'],
        options: ['Sid Sriram', 'Armaan Malik', 'Anurag Kulkarni', 'Javed Ali'],
        correctAnswer: 'Sid Sriram',
        explanation: 'Sid Sriram rendered this melody with soulful vocal ornamentations.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Pushpa: The Rise'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the soothing melodic soundtrack of "Kushi", including "Naa Roja Nuvve"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/712/Kushi-Telugu-2023-20230829141042-500x500.jpg',
        clues: ['Malayalam music director who did Hridayam', 'Vijay Deverakonda & Samantha', 'Kashmir visuals'],
        options: ['Hesham Abdul Wahab', 'Anirudh Ravichander', 'G.V. Prakash Kumar', 'Radhan'],
        correctAnswer: 'Hesham Abdul Wahab',
        explanation: 'Hesham Abdul Wahab made an astonishing Telugu debut with Kushi.',
        difficulty: 'medium',
        actorId: 'Vijay Deverakonda',
        movieId: 'Kushi'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the sensuous beach chartbuster "Chuttamalle" from Devara: Part 1?',
        audioPreviewUrl: 'https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/814/Summer-Hot-Romatic-Waves-Telugu-2026-20260601162119-500x500.jpg',
        clues: ['Rockstar composer', 'NTR Jr. & Janhvi Kapoor', 'Sung by Shilpa Rao'],
        options: ['Anirudh Ravichander', 'Thaman S', 'Devi Sri Prasad', 'M.M. Keeravaani'],
        correctAnswer: 'Anirudh Ravichander',
        explanation: 'Anirudh created the viral rhythmic loop for Chuttamalle.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'Devara: Part 1'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: 'Which Trivikram-directed movie featured the record-breaking hit "Samajavaragamana"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/712/Kushi-Telugu-2023-20230829141042-500x500.jpg',
        clues: ['Allu Arjun leg-shake hook step', 'Music by Thaman S', 'Lyrics by Sirivennela Seetharama Sastry'],
        options: ['Ala Vaikunthapurramuloo', 'Julayi', 'Race Gurram', 'S/O Satyamurthy'],
        correctAnswer: 'Ala Vaikunthapurramuloo',
        explanation: 'Samajavaragamana became the first Telugu track to hit 100M views rapidly.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Ala Vaikunthapurramuloo'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the dance craze "Butta Bomma" from Ala Vaikunthapurramuloo?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        clues: ['Popular Bollywood & South singer', 'Composed by Thaman S', 'Allu Arjun & Pooja Hegde'],
        options: ['Armaan Malik', 'Sid Sriram', 'Arijit Singh', 'Nakash Aziz'],
        correctAnswer: 'Armaan Malik',
        explanation: 'Armaan Malik lent his youthful voice to the viral sensation Butta Bomma.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Ala Vaikunthapurramuloo'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Inkem Inkem Inkem Kaavaale... Chaalle Idhi Chaaley" belongs to which Vijay Deverakonda movie?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        clues: ['Rashmika Mandanna co-star', 'Music by Gopi Sundar', 'Sung by Sid Sriram'],
        options: ['Geetha Govindam', 'Arjun Reddy', 'Dear Comrade', 'Taxiwala'],
        correctAnswer: 'Geetha Govindam',
        explanation: 'Parasuram\'s family romance Geetha Govindam was propelled by this anthem.',
        difficulty: 'easy',
        actorId: 'Vijay Deverakonda',
        movieId: 'Geetha Govindam'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the folk sensation "Saranga Dariya" from Love Story?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        clues: ['High-pitch Telangana folk singer', 'Sai Pallavi dancing marvel', 'Composed by Pawan Ch'],
        options: ['Mangli', 'Geetha Madhuri', 'Ramya Behara', 'Sunitha'],
        correctAnswer: 'Mangli',
        explanation: 'Mangli gave high-energy folk authenticity to Saranga Dariya.',
        difficulty: 'easy',
        actorId: 'Sai Pallavi',
        movieId: 'Love Story'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Dheevara... Prasara Shourya Bhaara" is the epic waterfall climbing anthem of which film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        clues: ['Shivadudu climbing Athirappilly waterfalls', 'Prabhas & Tamannaah', 'M.M. Keeravaani music'],
        options: ['Baahubali: The Beginning', 'Baahubali 2: The Conclusion', 'Chatrapathi', 'Magadheera'],
        correctAnswer: 'Baahubali: The Beginning',
        explanation: 'Ramya Behara and Deepu rendered this thrilling waterfall climb.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Baahubali: The Beginning'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the classic youth album "Happy Days", including "Arare Arare"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        clues: ['Mickey J. Meyer', 'Sekhar Kammula direction', 'College nostalgia'],
        options: ['Mickey J. Meyer', 'Devi Sri Prasad', 'Mani Sharma', 'Koti'],
        correctAnswer: 'Mickey J. Meyer',
        explanation: 'Mickey J. Meyer achieved legendary status with his Happy Days score.',
        difficulty: 'medium',
        movieId: 'Happy Days'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Undiporaadhey... Gundelona Undiporaadhey" became an instant acoustic heartbreak classic in which 2018 movie?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        clues: ['Composed by Radhan', 'Sung by Sid Sriram', 'Youth film starring 4 bachelors'],
        options: ['Hushaaru', 'Pellichoopulu', 'Ee Nagaraniki Emaindi', 'Chalo'],
        correctAnswer: 'Hushaaru',
        explanation: 'Undiporaadhey from Hushaaru is one of Sid Sriram\'s most celebrated renditions.',
        difficulty: 'medium',
        songId: 'undiporaadhey',
        movieId: 'Hushaaru'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the pulsating background score and songs for Jersey (2019)?',
        audioPreviewUrl: 'https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        clues: ['Tamil sensation rockstar', 'Spirit of Jersey track', 'Nani at railway station screaming'],
        options: ['Anirudh Ravichander', 'Santosh Narayanan', 'Thaman S', 'Gopi Sundar'],
        correctAnswer: 'Anirudh Ravichander',
        explanation: 'Anirudh provided the emotional soul of Jersey with tracks like Spirit of Jersey.',
        difficulty: 'easy',
        actorId: 'Nani',
        movieId: 'Jersey'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Kalaavathi... Maangalyam Tanthunanena" became a wedding dance craze in which Mahesh Babu film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        clues: ['Keerthy Suresh co-star', 'Music by Thaman S', 'Penny song, Murari Vaa'],
        options: ['Sarkaru Vaari Paata', 'Maharshi', 'Sarileru Neekevvaru', 'Bharat Ane Nenu'],
        correctAnswer: 'Sarkaru Vaari Paata',
        explanation: 'Kalaavathi from Sarkaru Vaari Paata crossed hundreds of millions of views.',
        difficulty: 'easy',
        actorId: 'Mahesh Babu',
        movieId: 'Sarkaru Vaari Paata'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the bold and raw item song "Oo Antava Mawa... Oo Oo Antava" in Pushpa: The Rise?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/188/Srivalli-From-Pushpa-The-Rise-Part-01-Telugu-2021-20211013110903-500x500.jpg',
        clues: ['Sister of Mangli', 'Samantha Ruth Prabhu special appearance', 'Lyrics by Chandrabose'],
        options: ['Indravathi Chauhan', 'Mangli', 'Shravana Bhargavi', 'Geetha Madhuri'],
        correctAnswer: 'Indravathi Chauhan',
        explanation: 'Indravathi Chauhan shot to pan-Indian fame with this recording.',
        difficulty: 'medium',
        actorId: 'Samantha Ruth Prabhu',
        movieId: 'Pushpa: The Rise'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Hoyna Hoyna... Nuvve Nannu Chustunte" is from which Nani and Priyanka Mohan film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        clues: ['Directed by Vikram K Kumar', 'Music by Anirudh Ravichander', 'Five women seeking revenge'],
        options: ['Nani\'s Gang Leader', 'Saripodhaa Sanivaaram', 'Ante Sundaraniki', 'V'],
        correctAnswer: 'Nani\'s Gang Leader',
        explanation: 'Anirudh and Inno Genga created Hoyna Hoyna in 2019.',
        difficulty: 'easy',
        actorId: 'Nani',
        movieId: 'Nani\'s Gang Leader'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Ramuloo Ramulaa... Nannu Aagam Chesindiro" took the world by storm in which film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        clues: ['Sung by Anurag Kulkarni', 'Thaman S beat', 'Allu Arjun & Murali Sharma step'],
        options: ['Ala Vaikunthapurramuloo', 'Pushpa', 'Sarileru Neekevvaru', 'DJ'],
        correctAnswer: 'Ala Vaikunthapurramuloo',
        explanation: 'Ramuloo Ramulaa was one of the biggest viral dance party tracks.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Ala Vaikunthapurramuloo'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the immortal vintage-sounding melodies of "Mahanati"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        clues: ['Mickey J. Meyer', 'Sada Nannu song', 'Nag Ashwin direction'],
        options: ['Mickey J. Meyer', 'A.R. Rahman', 'Ilayaraja', 'M.M. Keeravaani'],
        correctAnswer: 'Mickey J. Meyer',
        explanation: 'Mickey J. Meyer rendered the classical golden era soundscape for Mahanati.',
        difficulty: 'medium',
        actorId: 'Keerthy Suresh',
        movieId: 'Mahanati'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the haunting patriotic melody "Chuttamalle" from Devara?',
        audioPreviewUrl: 'https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/814/Summer-Hot-Romatic-Waves-Telugu-2026-20260601162119-500x500.jpg',
        clues: ['National Award winner for Besharam Rang', 'Anirudh music', 'Janhvi Kapoor visuals'],
        options: ['Shilpa Rao', 'Shreya Ghoshal', 'Chinmayi', 'Neeti Mohan'],
        correctAnswer: 'Shilpa Rao',
        explanation: 'Shilpa Rao sang Chuttamalle with a distinct velvety vocal charm.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'Devara: Part 1'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Saami Saami... Yevvaada Yevvaadu" featuring Rashmika Mandanna is from which movie?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/188/Srivalli-From-Pushpa-The-Rise-Part-01-Telugu-2021-20211013110903-500x500.jpg',
        clues: ['Devi Sri Prasad composition', 'Mounika Yadav vocal', 'Srivalli character praise'],
        options: ['Pushpa: The Rise', 'Sarileru Neekevvaru', 'Geetha Govindam', 'Varisu'],
        correctAnswer: 'Pushpa: The Rise',
        explanation: 'Saami Saami became a global dance reels phenomenon.',
        difficulty: 'easy',
        actorId: 'Allu Arjun',
        movieId: 'Pushpa: The Rise'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the infectious energetic soundtrack for "Rangasthalam", including "Jigelu Rani"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        clues: ['Rockstar DSP', 'Sukumar collaboration', 'Ranga Ranga Rangasthalana'],
        options: ['Devi Sri Prasad', 'Thaman S', 'M.M. Keeravaani', 'Anirudh Ravichander'],
        correctAnswer: 'Devi Sri Prasad',
        explanation: 'Devi Sri Prasad brought 1980s rural folk-rock authenticity in Rangasthalam.',
        difficulty: 'easy',
        actorId: 'Ram Charan',
        movieId: 'Rangasthalam'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the soul-stirring melody "O Rendu Prema Meghaalila" from Baby (2023)?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        clues: ['Malayalam music director Hesham Abdul Wahab & Sreerama Chandra', 'Anand Deverakonda & Vaishnavi Chaitanya', 'Vijai Bulganin composer'],
        options: ['Sreerama Chandra', 'Sid Sriram', 'Armaan Malik', 'Karthik'],
        correctAnswer: 'Sreerama Chandra',
        explanation: 'Sreerama Chandra rendered this modern heartbreak anthem composed by Vijai Bulganin.',
        difficulty: 'medium',
        movieId: 'Baby'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Komuram Bheemudo... Komuram Bheemudo" is the emotional peak song of which film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        clues: ['Sung by Kaala Bhairava', 'Whipping sequence in Delhi', 'NTR Jr. tearful performance'],
        options: ['RRR', 'Baahubali 2', 'Sye Raa Narasimha Reddy', 'Rudramadevi'],
        correctAnswer: 'RRR',
        explanation: 'Kaala Bhairava\'s stirring song when Bheem is flogged in public in RRR.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'RRR'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the timeless melodious score for "Ye Maaya Chesave" (2010)?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        clues: ['Mozart of Madras', 'Gautham Vasudev Menon collaboration', 'Kundanapu Bomma, Hosanna'],
        options: ['A.R. Rahman', 'Harris Jayaraj', 'Devi Sri Prasad', 'M.M. Keeravaani'],
        correctAnswer: 'A.R. Rahman',
        explanation: 'A.R. Rahman gave Telugu cinema one of its finest romantic scores in Ye Maaya Chesave.',
        difficulty: 'easy',
        actorId: 'Naga Chaitanya',
        movieId: 'Ye Maaya Chesave'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the foot-tapping party song "Mind Block" in Sarileru Neekevvaru?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        clues: ['Blaaze and Ranina Reddy', 'Mahesh Babu & Rashmika Mandanna dance', 'Devi Sri Prasad music'],
        options: ['Ranina Reddy & Blaaze', 'Mangli', 'Geetha Madhuri', 'Shravana Bhargavi'],
        correctAnswer: 'Ranina Reddy & Blaaze',
        explanation: 'Ranina Reddy provided the energetic vocals alongside Blaaze.',
        difficulty: 'hard',
        actorId: 'Mahesh Babu',
        movieId: 'Sarileru Neekevvaru'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Emitemitemito... Idhekkadi Prema" is an acoustic romantic track from which 2017 hit?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        clues: ['Radhan composition', 'Alphonse Joseph vocal', 'Vijay Deverakonda & Shalini Pandey'],
        options: ['Arjun Reddy', 'Pellichoopulu', 'Geetha Govindam', 'Dear Comrade'],
        correctAnswer: 'Arjun Reddy',
        explanation: 'Radhan composed Emitemitemito for Arjun Reddy.',
        difficulty: 'medium',
        actorId: 'Vijay Deverakonda',
        movieId: 'Arjun Reddy'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who composed the music for the comedy mystery "Agent Sai Srinivasa Athreya"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        clues: ['Sherlock Holmes theme inspired Telugu tracks', 'Mark K. Robin', 'Naveen Polishetty'],
        options: ['Mark K. Robin', 'Kaala Bhairava', 'Prashanth R Vihari', 'Vivek Sagar'],
        correctAnswer: 'Mark K. Robin',
        explanation: 'Mark K. Robin gave the quirky brass-heavy detective score for Agent Sai.',
        difficulty: 'hard',
        actorId: 'Naveen Polishetty',
        movieId: 'Agent Sai Srinivasa Athreya'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Kaadhani Nenannana... Kalale Neekannana" is the iconic melancholy melody from which Tharun Bhascker film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        clues: ['Composed by Vivek Sagar', 'Sung by Karthik', 'Vijay Deverakonda & Ritu Varma'],
        options: ['Pellichoopulu', 'Ee Nagaraniki Emaindi', 'Keedaa Cola', 'Fidaa'],
        correctAnswer: 'Pellichoopulu',
        explanation: 'Vivek Sagar and Karthik created the dreamy romance Kaadhani.',
        difficulty: 'medium',
        actorId: 'Vijay Deverakonda',
        movieId: 'Pellichoopulu'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_singer',
        prompt: 'Who sang the devotional energetic powerhouse "Oorantha Sankranthi" / "Jaragandi" in Game Changer?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        clues: ['Daler Mehndi & Sunidhi Chauhan', 'Thaman S composition', 'Ram Charan & Kiara Advani'],
        options: ['Daler Mehndi & Sunidhi Chauhan', 'Nakash Aziz', 'Shankar Mahadevan', 'Anurag Kulkarni'],
        correctAnswer: 'Daler Mehndi & Sunidhi Chauhan',
        explanation: 'Daler Mehndi teamed with Sunidhi Chauhan for Jaragandi.',
        difficulty: 'medium',
        actorId: 'Ram Charan',
        movieId: 'Game Changer'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Fear Song... All Hail The Tiger" is the thunderous introduction song of which movie?',
        audioPreviewUrl: 'https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4',
        mediaUrl: 'https://c.saavncdn.com/814/Summer-Hot-Romatic-Waves-Telugu-2026-20260601162119-500x500.jpg',
        clues: ['Sung by Anirudh Ravichander', 'NTR Jr. as Devara', 'Red sea battle visualizer'],
        options: ['Devara: Part 1', 'RRR', 'Janatha Garage', 'Aravinda Sametha'],
        correctAnswer: 'Devara: Part 1',
        explanation: 'Fear Song set records on YouTube with Anirudh\'s electrifying vocals.',
        difficulty: 'easy',
        actorId: 'NTR Jr.',
        movieId: 'Devara: Part 1'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_composer',
        prompt: 'Who scored the music for the pan-Indian mythological sci-fi "Kalki 2898 AD"?',
        audioPreviewUrl: 'https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        clues: ['Santhosh Narayanan', 'Bhairava Anthem featuring Diljit Dosanjh', 'Nag Ashwin direction'],
        options: ['Santhosh Narayanan', 'M.M. Keeravaani', 'Anirudh Ravichander', 'Mickey J. Meyer'],
        correctAnswer: 'Santhosh Narayanan',
        explanation: 'Santhosh Narayanan produced the grand dystopian score and Bhairava Anthem.',
        difficulty: 'easy',
        actorId: 'Prabhas',
        movieId: 'Kalki 2898 AD'
    },
    {
        gameType: 'guess_song',
        questionType: 'song_to_movie',
        prompt: '"Aagave Nuvvagave... Ee Vela Aagave" is from which hit youth sports film?',
        audioPreviewUrl: 'https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4',
        mediaUrl: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        clues: ['Composed by Anirudh', 'Nani as Arjun training late at night', 'Gowtam Tinnanuri film'],
        options: ['Jersey', 'Majili', 'Golconda High School', 'Dear Comrade'],
        correctAnswer: 'Jersey',
        explanation: 'Aagave Nuvvagave captures Arjun\'s relentless determination.',
        difficulty: 'medium',
        actorId: 'Nani',
        movieId: 'Jersey'
    }
];

async function seedGames() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Seed Game Definitions
        for (const g of INITIAL_GAMES) {
            await Game.findOneAndUpdate(
                { gameType: g.gameType },
                g,
                { upsert: true, new: true }
            );
        }
        console.log(`🎮 Upserted ${INITIAL_GAMES.length} Game definitions`);

        // Clear existing questions and insert fresh bank
        await GameQuestion.deleteMany({});
        console.log('🗑️  Cleared existing GameQuestions');

        function shuffleArray(arr) {
            if (!Array.isArray(arr)) return [];
            const shuffled = [...arr];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        const allQuestions = [...MOVIE_QUESTIONS, ...DIALOGUE_QUESTIONS, ...SONG_QUESTIONS].map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));
        const inserted = await GameQuestion.insertMany(allQuestions);
        console.log(`✅ Seeded ${inserted.length} GameQuestions total:`);
        console.log(`   - 🎬 Guess the Movie: ${MOVIE_QUESTIONS.length}`);
        console.log(`   - 🗣️ Guess the Dialogue: ${DIALOGUE_QUESTIONS.length}`);
        console.log(`   - 🎵 Guess the Song: ${SONG_QUESTIONS.length}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding game questions:', err);
        process.exit(1);
    }
}

seedGames();
