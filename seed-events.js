const mongoose = require('mongoose');
const { UserEvent } = require('./server/models');

async function seedEvents() {
    await mongoose.connect('mongodb+srv://panviravindra223_db_user:Password%4011@cluster0.xifmm7m.mongodb.net/cinema-muchatlu?retryWrites=true&w=majority&appName=Cluster0');
    
    const events = [];
    
    // Create 100 random events
    for (let i = 0; i < 100; i++) {
        const sources = ['global', 'personalized', 'exploration'];
        const source = sources[Math.floor(Math.random() * sources.length)];
        
        // Add an impression
        events.push({
            eventType: 'feed_impression',
            targetType: 'culturePost',
            targetId: 'dummy' + i,
            metadata: { source }
        });
        
        // Randomly add a reaction based on source CTR rules
        const r = Math.random();
        if ((source === 'personalized' && r < 0.2) || 
            (source === 'global' && r < 0.1) || 
            (source === 'exploration' && r < 0.05)) {
            
            events.push({
                eventType: 'reaction',
                targetType: 'culturePost',
                targetId: 'dummy' + i,
                metadata: { source, reaction: 'like' }
            });
        }
    }
    
    await UserEvent.insertMany(events);
    console.log(`Seeded ${events.length} events!`);
    process.exit(0);
}

seedEvents();
