const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Import cors
const { oauth2Client, getAuthUrl, getAccessToken } = require('./googleOAuth');
const main = require('./app');  // Import the main function
const { getStepsToAchieveGoal,  classifyInputs, generatePlanOutline, getParsedThirdPartyEvents, getActualFormattedGPTResponse, getUserCurrentCalendar} = require('./chatGPTClient');
const { getThirdPartyEventRecommendations } = require('./eventScraper');
const { getUserContext, getUserProfile, updateUserContext } = require('./mongodbClient');
const{insertEventsToCalendar, convertToJsonForGoogleCalendar, replaceOverlappingEvents} = require('./googleCalendarClient');
const {readPromptFile} = require('./readPrompt');
const app = express();
const User = require('./models/users.js');



// Enable All CORS Requests
app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/calendar_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.get('/auth', (req, res) => {
    res.redirect(getAuthUrl());
});

app.get('/authenticated', async (req, res) => {
    try {
        console.log(req);
        const clerkUserId = req.query.clerk_user_id;
        await getAccessToken(clerkUserId);
        //res.redirect('/getThirdpartyEvents'); // Redirect to execute main after successful authentication
    } catch (error) {
        console.error(error);
        res.send('Error during authentication.');
    }
});
/*
app.get('/oauth2callback', async (req, res) => {
    try {
        console.log(req);
        const { code } = req.query;
        await getAccessToken(code);
        res.redirect('/getThirdpartyEvents'); // Redirect to execute main after successful authentication
    } catch (error) {
        console.error(error);
        res.send('Error during authentication.');
    }
});
*/
/*
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    if (code) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            res.send('Authorization successful. You can close this tab.');
        } catch (error) {
            console.error('Error getting tokens:', error);
            res.send('Error during the login process. Please try again.');
        }
    } else {
        res.send('No authorization code found. Please try again.');
    }
});

app.get('/executeMain', async (req, res) => {
    try {
        await main(); // Call the main function from app.js
        res.send('Calendar operations completed successfully.');
    } catch (error) {
        console.error(error);
        res.send('Error executing calendar operations.');
    }
});
*/

app.get('/getChatResponse', async (req, res) => {
    try {
        const response = await getActualFormattedGPTResponse(req.chat);
        console.log(response);
        res.send(response);
    } catch (error) {
        console.error(error);
        res.send('Error executing calendar operations.');
    }
});

app.get('/getThirdpartyEvents', async (req, res) => {
    //TODO: to get additoinal context later from the FE req.body.events;
    const events = await getParsedThirdPartyEvents();
    res.send(JSON.stringify(events)); 
})

app.get('/createEvent', async (req, res) => {
    //TODO: to get additoinal context later from the FE req.body.events;
    try {
        const clerkUserId = req.query.clerk_user_id;
        await getAccessToken(clerkUserId);
        const recommendationObjs = req.recommendationObj;
            for (const recommendationObj of recommendationObjs) {
                const googleEvent = await replaceOverlappingEvents(recommendationObj);
                await replaceOverlappingEvents(googleEvent);
            }       
    } catch (error) {
        console.error(error);
        res.send(error);
    }
})

app.get('/getUserCurrentCalendar', async (req, res) => {
    try {
        if (!req.query.clerk_user_id) {
            return res.status(400).send({ error: 'clerk_user_id is required as a query parameter.' });
        }
        const clerkId = req.query.clerk_user_id;
        const result = await getUserCurrentCalendar(clerkId);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.error('Error fetching user calendar:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
});


app.get('/getUserProfile', async (req, res) => {
    //TODO: to get additoinal context later from the FE req.body.events;
    try {
        const userId = 'user_2bsEMuFTxBZqdsWnHiUANOnsKHF';
        const userContext = await getUserContext(userId);
        console.log(`the usercontext is ${JSON.stringify(userContext)}`);
        res.send(userContext);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
   
})

app.get('/getUserData', async (req, res) => {
    //TODO: to get additoinal context later from the FE req.body.events;
    try {
        const userId = 'user_2bsEMuFTxBZqdsWnHiUANOnsKHF';
        const userContext = await getUserProfile(userId);
        console.log(`the usercontext is ${JSON.stringify(userContext)}`);
        res.send(userContext);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
})

// Endpoint to add a user, returns the user id
app.post('/addUser', async (req, res) => {
    try {
        const newUser = new User(req.body); // Create a new user with the request body
        const savedUser = await newUser.save(); // Save the new user to the database
        res.status(201).send({ userId: savedUser._id }); // Respond with the userId of the new user
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error adding user', error: error.message });
    }
});

app.post("/classifyInputs", async (req, res) => {
    try {
        const result = await classifyInputs();
        res.send(JSON.stringify(result));
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while classifying the inputs');
    }
})
/*
app.post('/insertEvent', async (req, res) => {
    try {
        await insertEventsToCalendar(req.body);
        res.status(200).send('Event inserted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while inserting the event');
    }
}); */


app.post('/generateGoalOutline', async (req, res) => {
    const goal = req.body.goal;
    console.log(goal)
    console.log('hi')
    const ret =  await getStepsToAchieveGoal(goal);
    // const ret =      {
    //     onceOffCards: [
    //       { id: "Step1", title: "Set Clear Reading Goals", hours: "1" },
    //       { id: "Step2", title: "Choose the Right Books", hours: "2" },
    //       // Add more steps as needed
    //     ],
    //     weeklyCards: [
    //       { id: "Week1", title: "Morning Read", hours: "1" },
    //       { id: "Week2", title: "Night Read", hours: "1" },
    //       // Add more steps as needed
    //     ]
    //   };
    res.json(ret);
});

app.put('/saveProfile', async (req, res) => {
    try {
        const userId = 'user_2bsEMuFTxBZqdsWnHiUANOnsKHF';
        const profile = await updateUserContext(userId, req.body)
        res.status(200).send('Profile saved');
    } catch (error) {
        res.status(500).send(error);
    }
  });

app.post('/weeklySchedule', async (req, res) => {
    const schedule = {
        "goal": "Read a book",
        "weekly_schedule": {
            "Monday": {
                "tasks": [
                    {
                        "summary": "Choose a book to read",
                        "start": {
                            "dateTime": "2023-01-01T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-01T09:30:00"
                        },
                        "description": "Selecting a book that interests you will make the reading experience enjoyable and engaging."
                    },
                    {
                        "summary": "Create a reading schedule",
                        "start": {
                            "dateTime": "2023-01-01T09:30:00"
                        },
                        "end": {
                            "dateTime": "2023-01-01T10:00:00"
                        },
                        "description": "Having a schedule will help you allocate specific time for reading and track your progress."
                    }
                ]
            },
            "Tuesday": {
                "tasks": [
                    {
                        "summary": "Set daily reading goals",
                        "start": {
                            "dateTime": "2023-01-02T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-02T09:30:00"
                        },
                        "description": "Establishing reading goals will help you stay focused and motivated."
                    },
                    {
                        "summary": "Create a comfortable reading space",
                        "start": {
                            "dateTime": "2023-01-02T09:30:00"
                        },
                        "end": {
                            "dateTime": "2023-01-02T10:00:00"
                        },
                        "description": "Having a cozy and quiet reading environment will enhance your reading experience."
                    }
                ]
            },
            "Wednesday": {
                "tasks": [
                    {
                        "summary": "Start reading the book",
                        "start": {
                            "dateTime": "2023-01-03T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-03T10:30:00"
                        },
                        "description": "Get immersed in the book and enjoy the beginning of your reading journey."
                    }
                ]
            },
            "Thursday": {
                "tasks": [
                    {
                        "summary": "Reflect on the reading progress",
                        "start": {
                            "dateTime": "2023-01-04T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-04T09:30:00"
                        },
                        "description": "Take a moment to evaluate your engagement with the book and make any necessary adjustments to your reading habits."
                    },
                    {
                        "summary": "Research about the author or related topics",
                        "start": {
                            "dateTime": "2023-01-04T09:30:00"
                        },
                        "end": {
                            "dateTime": "2023-01-04T10:00:00"
                        },
                        "description": "Gaining additional context about the book or the author can provide a deeper understanding of the content."
                    }
                ]
            },
            "Friday": {
                "tasks": [
                    {
                        "summary": "Continue reading the book",
                        "start": {
                            "dateTime": "2023-01-05T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-05T10:30:00"
                        },
                        "description": "Maintain the momentum and engagement with the narrative."
                    }
                ]
            },
            "Saturday": {
                "tasks": [
                    {
                        "summary": "Review the chapters read during the week",
                        "start": {
                            "dateTime": "2023-01-06T09:00:00"
                        },
                        "end": {
                            "dateTime": "2023-01-06T09:30:00"
                        },
                        "description": "Recapitulating the content will reinforce comprehension and retention."
                    },
                    {
                        "summary": "Set reading goals for the upcoming week",
                        "start": {
                            "dateTime": "2023-01-06T09:30:00"
                        },
                        "end": {
                            "dateTime": "2023-01-06T10:00:00"
                        },
                        "description": "Planning ahead will ensure a consistent reading routine."
                    }
                ]
            },
            "Sunday": {
                "tasks": []
            }
        }
    };
    res.json(schedule);
});


app.post('/createPlan', async (req, res) => {
    const { userId, goalName, tasks, events } = req.body;
    const startDate = new Date();
 
    // console.log(req.body)

    try {
        const response = generatePlanOutline(goalName, tasks, userId, startDate);

        // console.log(response, "res");

 

      
      res.status(201).send(newPlan);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

app.listen(6002, () => {
    console.log('Server started on http://localhost:6002');
});

