const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const {OpenAI} = require( 'openai');


const makeAPICall = async (url) => {
  const apiKey = process.env.GOOGLE_EVENT_SCRAPER; // Replace with the actual environment variable name for your API key

  try {
    const response = await axios({
      method: 'get',
      url: url,
      headers: {
        'x-api-key': apiKey,
      },
      responseType: 'json',
    });

    return response.data; // Return the response data
  } catch (error) {
    throw error; // Rethrow the error to be caught later
  }
};
function formatEvents(events) {
  if (!events || !events.eventsResults || events.eventsResults.length === 0) {
      return { message: 'No events found.' };
  }

  const formattedEvents = events.eventsResults.map(event => {
      return {
          title: event.title,
          date: event.date.when,
          location: event.address.join(', '),
          venue: event.venue.name,
          description: event.description,
          link: event.link,
          tickets: event.ticketInfo ? event.ticketInfo.map(ticket => {
              return `${ticket.source}: ${ticket.link} (${ticket.linkType})`;
          }) : [],
          googleMapsLink: event.eventLocationMap.link
      };
  });

  return formattedEvents;
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getThirdPartyEventRecommendations(context) {
  const keyPhrases = await parseKeywords(context);
  if (keyPhrases.length === 0) {
      throw new Error("Unable to get keywords");
  }
  console.log(`the keywords are: ${keyPhrases}`);

  const eventsData = [];
  for (const keyPhrase of keyPhrases) {
      const url = formatKeywordsToURL(keyPhrase);
      console.log(`the url for '${keyPhrase}' is: ${url}`);
      const eventString = await makeAPICall(url);
      console.log(`the event string for '${keyPhrase}' is: ${eventString}`);
      eventsData.push({ keyphrase: keyPhrase, url, events: formatEvents(eventString) });

      await delay(10); // Wait for 1 second before the next iteration
  }

  return eventsData;
}

  async function parseKeywords(passage) {
    let retryCount = 0;
    let maxRetries = 3; // Set a maximum number of retries to avoid infinite loops
    let keywordsArray = [];
  
    while (retryCount < maxRetries) {
      try {
        const keywordString = await getEventSearchKeywords(passage);
        if (keywordString) {
          keywordsArray = keywordString.split(',').filter(keyword => keyword.trim() !== '');
          if (keywordsArray.length > 0) {
            break; // Break the loop if successful parsing
          }
        }
        retryCount++;
      } catch (error) {
        console.error('Error fetching keywords:', error);
        retryCount++;
      }
    }
  
    if (keywordsArray.length === 0 && retryCount === maxRetries) {
      console.error('Failed to parse keywords after maximum retries.');
    }
  
    return keywordsArray;
  }
  
  module.exports = parseKeywords;

  function formatKeywordsToURL(keyword) {
    const cleanedKeyword = keyword.trim().replace(/^"|"$/g, '');
    const query = encodeURIComponent(cleanedKeyword);
    return `https://api.scrape-it.cloud/scrape/google/events?q=${query}`;
}

module.exports = { getThirdPartyEventRecommendations };

async function getEventSearchKeywords(context) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
  // Assuming `context` is an object containing the new schema fields
// Construct the prompt with populated event titles
const prompt = `Given the following user information:
- Interests: ${context.preferences.join(', ')}
- Location: ${context.location.city}, ${context.location.state}, ${context.location.country}
- Goal: ${context.goal}
- Past Events: ${context.calendar.past_activities.events.map(event => event.title).join(', ')}
- Past Tasks: ${context.calendar.past_activities.tasks.map(task => task.title).join(', ')}
- Gender: ${context.gender}
- Age: ${context.age}

Generate exactly 3 specific ONLY key phrases for searching current events on GOOGLE EVENTS that this user can participate in, including their location. Provide key phrases only, CAN BE DIRECTLY USED FOR SEARCH ON GOOGLE EVENTS, separated by commas.`;
  
const response = await openai.chat.completions.create({
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant designed to output phrases for event search.",
    },
    { role: "user", content: prompt },
  ],
  model: "gpt-4-0125-preview"
});
   return response.choices[0].message.content;
}

