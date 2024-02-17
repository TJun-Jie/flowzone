// app.js
const {getUserContext} = require('./mongodbClient');
const {getEventRecommendations}= require('./chatGPTClient');
const { insertEventsToCalendar, parseEvent } = require('./googleCalendarClient');
const { oauth2Client } = require('./googleOAuth');

async function main() {
    try {
        if (!oauth2Client.credentials) {
            console.log('User is not authenticated. Please authenticate through the OAuth flow.');
            return;
        }
    
        const userId = '65bae4feb44e32c3e377153a'; 
        const userContext = await getUserContext(userId);
        console.log(`the usercontext is ${userContext}`);
        let recommendations = await getEventRecommendations(userContext);
        let parsedEvents = recommendations.split('\n').map(parseEvent).filter(event => event !== null);
        console.log(`the events are ${parsedEvents}`);
        if (parsedEvents.length > 0) {
            await insertEventsToCalendar(parsedEvents);
            console.log('Events inserted into Google Calendar');
        } else {
            console.log('No events to insert.');
        }
    } catch(error) {
        console.log(`Error inserting events into Google Calendar: ${error}`);
    }
    
}

// Call main only after OAuth authentication is complete
// You might want to trigger this based on a specific route or user action
module.exports = main; // Export the main function
