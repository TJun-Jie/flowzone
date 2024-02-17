const {OpenAI} = require( 'openai');
require('dotenv').config();
const { getThirdPartyEventRecommendations } = require('./eventScraper');
const {   readPromptFile } = require('./readPrompt');
const Task = require("./models/task");
const Plan = require("./models/plan");
const User = require("./models/users");
const Event = require("./models/event");
const {getUserContext} = require('./mongodbClient');
const {parseEvent} = require('./googleCalendarClient');
const { MongoClient, ObjectId } = require('mongodb');


async function getEventRecommendations(context) {
    console.log(`user context for getEventRecommendations is ${context}`);
    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
    console.log(`the context is ${context}`);
    const prompt = `Generate a list of event/activity recommendations based on the following data: ${JSON.stringify(context)}. Format each event as: 'Event Name on YYYY-MM-DD: Event Description'. Ensure each event is on a new line.`;

    const response = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: prompt,
      });
    return response.choices[0].text;
}

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



async function generatePlanOutline(goal, tasks, userId, startDate) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });

  const promptTemplate = readPromptFile('generate_plan.txt');
  let prompt = promptTemplate.replace('{goal}', goal);
  prompt = prompt.replace('{tasks}', JSON.stringify(tasks));
  prompt = prompt.replace('{starting_date}', startDate?.toISOString().split('T')[0]);

  


  console.log('loading...')
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });


  const response = JSON.parse(completion.choices[0].message.content);

  // generate task for plan
  const resTasks = response.tasks

  const createEvent = async (event) => {
    // console.log(event);
    const newEvent = new Event({
      title: event.title,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: "N/A"
    });

    try {
      const savedEvent = await newEvent.save();
      return savedEvent;
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const clerk_user_id = userId;

  const user = await User.findOne({ clerk_user_id : clerk_user_id });
  if (!user) {
    throw new Error('User not found');
  }


  const newEvents = await Promise.all(resTasks.map(async (task) => {
    try {
      const newEvent = await createEvent(task);
      return newEvent;
    } catch (error) {
      console.error(error);
      return null; // Or another placeholder that signifies an error occurred
    }
  }));
  
  console.log(newEvents, "new events");
  


  const createPlan = async () => {
    const newPlan = new Plan({
      clerk_user_id,
      goal_name: goal,
      tasks: newEvents.map(event => event?._id),
      events: [],
      is_confirmed: false,
      start_date: new Date()
    });
  
    try {
      const savedPlan = await newPlan.save();
      console.log('Plan saved:', savedPlan);
    } catch (err) {
      console.error('Error saving plan:', err);
    }
  };
  
  createPlan().catch(console.error);

}


async function getStepsToAchieveGoal(goal) {
  // ... set up OpenAI client ...
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });

  const promptTemplate = readPromptFile('generate_goal_outline.txt');
  const prompt = promptTemplate.replace('{goal}', goal);


  console.log('loading...')
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });
console.log("done!")

  

  try {
    const response = JSON.parse(completion.choices[0].message.content);

    // Construct the expected format
    const result = {
      onceOffCards: [],
      weeklyCards: []
    };

    // Example of parsing logic, adjust according to your actual JSON structure
    if (response.onceOffCards) {
      result.onceOffCards = response.onceOffCards.map((card, index) => ({
        id: `Step${index + 1}`,
        title: card.title,
        hours: card.hours?.toString() ,// Ensure hours is a string
        rationale: card.rationale
      }));
    }

    if (response.weeklyCards) {
      result.weeklyCards = response.weeklyCards.map((card, index) => ({
        id: `Week${index + 1}`,
        title: card.title,
        hours: card.hours?.toString(), // Ensure hours is a string
        rationale: card.rationale
      }));
    }

    console.log(result);
    return result;
  } catch (error) {
    console.error('Error parsing GPT-3 response:', error);
    throw new Error('Failed to parse GPT-3 response');
  }
  
}



async function classifyInputs(chatInput) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
        });
    const prompt = 
    `
    LINE 1: Classify the following chat as either "normal chat" or "action chat.", an "action chat" implies intentions or actions related to CRUD operations on calendar events.
    LINE 2: if the chat has the intention to CREATE EVENTS, decide whether third party call is needed to pull events for event recommendation.
    LINE 3: the response to the chat

    If "normal chat", return:
    is_action_chat: false
    third_party_call_needed: false
    response: {DECIDE AND INPUT appropriate response to the chat input}

    If "action chat", return:
    is_action_chat: "true"
    third_party_call_needed: {whether need to get events from third party platform to fulfill the action of creating events, true/false}
    response: {DECIDE AND INPUT appropriate response to the chat input}

    Examples:
    1. Chat: "How's the weather today?"
      is_action_chat: false
      output: the weather is great today
      response: {DECIDE AND INPUT appropriate response to the chat input}

    2. Chat: "Remind me to call John tomorrow."
      is_action_chat: true
      third_party_call_needed: false
      response: {DECIDE AND INPUT appropriate response to the chat input}

    3. Chat: "I want to schedule a meeting with my team next Friday."
      is_action_chat: true
      third_party_call_needed: false
      response: {DECIDE AND INPUT appropriate response to the chat input}

    4. Chat: "I want to do something related to tech on Wednesday."
      is_action_chat: true
      third_party_call_needed: true
      response: {DECIDE AND INPUT appropriate response to the chat input}

    Chat: "${chatInput}"
    is_action_chat:
    third_party_call_needed:`;
    const gptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output response in the SPECIFIED FORMAT",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4-0125-preview"
    });

    const text = gptResponse.choices[0].message.content;

    // Split the response by new lines and then by ': ' to extract key-value pairs
    const lines = text.split('\n');
    const result = {};

    lines.forEach(line => {
      const [key, value] = line.split(': ').map(item => item.trim());
      // Convert 'true'/'false' strings to actual Boolean values
      result[key] = value;
    });

    const is_action_chat = result.is_action_chat === 'true';
    const third_party_call_needed = result.third_party_call_needed  === 'true';
    const response = result.response;
    return {is_action_chat, third_party_call_needed, response};
}


async function getActualFormattedGPTResponse(chatMessage) {
  //const chatInput = "i want to schedule a call to tom on tuesday night";
  const chatInput = chatMessage;

  const intention = await classifyInputs(chatInput);
  const is_action_chat = intention.is_action_chat;
  const third_party_call_needed = intention.third_party_call_needed;
  const response = intention.response;
  let thirdPartEvents;
  let amendedUserCalendarObj;
  if (third_party_call_needed) {
    thirdPartEvents = await getParsedThirdPartyEvents();
  } else if (is_action_chat) {
    const userCalendarObj = await getUserCurrentCalendar(local_clerk_user_id);
    amendedUserCalendarObj = await amendVirtualCalendar(chatInput, userCalendarObj);
  }
  return {
    response: response,
    thirdPartEvents: thirdPartEvents,
    amendedUserCalendarObj: amendedUserCalendarObj
  }
}

/*
FE flow:
ALWAYS SHOW RESPONSE TO THE USER
check if thirdpartyevents is available, if so show both response and thirdpartyevents to user
if not, check if amendedUserCalendarObj is available, if so show the amended calendar object to user
if not, show only response to user
*/

async function getParsedThirdPartyEvents(clerk_user_id) {
  try {
      const local_clerk_user_id = process.env.CLERK_USER_ID;
      const userContext = await getUserContext(local_clerk_user_id);
      console.log(`the usercontext is ${userContext}`);
      const recommendationObj = await getThirdPartyEventRecommendations(userContext);
      console.log('Received events:', JSON.stringify(recommendationObj, null, 2));
      let events = [];
      let limit = 0;
      for (let i = 0; i < recommendationObj.length; i++) {
          limit += 1;
          if (limit >3) {
              return;
          }
          if (Array.isArray(recommendationObj[i].events)) {
              console.log(`inserting one event from key phrase: ${recommendationObj[i].keyphrase}; event is ${recommendationObj[i].events[0]}`);
              events.push(parseEvent(recommendationObj[i].events[0])); //every key phrase pick the first recommended event
              //await insertEventsToCalendar(recommendationObj[i].events[0]);
          }
      }    
      return events;
  } catch (error) {
      console.error(error);
  }
}

async function amendVirtualCalendar(chatMsg, currentCalendarObj) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
  // Assuming `context` is an object containing the new schema fields
// Construct the prompt with populated event titles
const prompt = `Given the following user instruction: ${chatMsg}
AMEND THE USER'S CALENDAR HERE: ${JSON.stringify(currentCalendarObj)}

OUTPUT FORMAT SHOULD BE EXACTLY THE SAME AS THE INPUT FORMAT OF THE USER'S CALENDAR
OUTPUT ONLY THE CALENDAR OBJECT WITHOUT SAYING ANYTHING ELSE.
`;
  
const response = await openai.chat.completions.create({
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant designed to output an amended version of the user's calendar array object based on the user's inputs",
    },
    { role: "user", content: prompt },
  ],
  model: "gpt-4-0125-preview"
});
   return response.choices[0].message.content;

}


async function getUserCurrentCalendar(clerkUserId) {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
      const database = client.db('calendar_db'); 
      const usersCollection = database.collection('users'); 
  
      const pipeline = [
          {
            $match: { clerk_user_id: clerkUserId } // Match the user by clerk_user_id
          },
          {
            $lookup: {
              from: 'events', // Assumes your events are stored in a collection named 'events'
              localField: 'calendar.current_weekly_calendar.events', // Field in users collection
              foreignField: '_id', // Field in events collection
              as: 'calendar.current_weekly_calendar.events' // Where to put the joined documents
            }
          },
          {
            $lookup: {
              from: 'tasks', // Assumes your tasks are stored in a collection named 'tasks'
              localField: 'calendar.current_weekly_calendar.tasks', // Field in users collection
              foreignField: '_id', // Field in tasks collection
              as: 'calendar.current_weekly_calendar.tasks' // Where to put the joined documents
            }
          },
          {
            $limit: 1 // Since we're looking for a single user, limit the result to 1
          }
        ];
        // Execute the aggregation pipeline
        const usersWithPopulatedData = await usersCollection.aggregate(pipeline).toArray();
      if (!usersWithPopulatedData) {
          return res.status(404).send({ error: 'User not found.' });
      }
      console.log(usersWithPopulatedData);
      console.log(usersWithPopulatedData[0].calendar.current_weekly_calendar.events);
      // Extracting the current weekly calendar for ease of access
      let result = usersWithPopulatedData[0].calendar.current_weekly_calendar.events;
      const correctedResult = result.map(element => ({
          start: element.startDate,
          end: element.endDate,
          title: element.title
      }));
      
      console.log(correctedResult);
      return correctedResult;
  } catch (error) {
      console.error('Error fetching user calendar:', error);
  }
}


module.exports = {getUserCurrentCalendar, amendVirtualCalendar, getActualFormattedGPTResponse, getParsedThirdPartyEvents, getEventSearchKeywords,getEventRecommendations, getStepsToAchieveGoal, classifyInputs, generatePlanOutline};

