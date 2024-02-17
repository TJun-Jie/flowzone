const mongoose = require('mongoose');
const User = require('../models/users'); // Adjust path as necessary
const Event = require('../models/event'); // Adjust path as necessary
const Task = require('../models/task'); // Adjust path as necessary
const Plan = require('../models/plan'); // Adjust path as necessary
const { ObjectId } = require('mongodb');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/calendar_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function insertSampleData() {
  try {
    const events = await Promise.all([
      Event.create({
        title: 'Tech Conference 2024',
        startDate: new Date(2024, 1, 20, 9, 0),
        endDate: new Date(2024, 1, 20, 17, 0),
        location: 'Convention Center, Tech City'
      }),
      Event.create({
        title: 'Internal Hackathon',
        startDate: new Date(2024, 1, 22, 10, 0),
        endDate: new Date(2024, 1, 23, 16, 0),
        location: 'Headquarters'
      }),
      Event.create({
        title: 'Weekly Sync-Up Meeting',
        startDate: new Date(2024, 1, 24, 11, 0),
        endDate: new Date(2024, 1, 24, 12, 0),
        location: 'Online - Zoom'
      })
    ]);

    // Creating a variety of sample tasks
    const tasks = await Promise.all([
      Task.create({
        title: 'Prepare Presentation for Tech Conference',
        date: new Date(2024, 1, 19),
        location: 'Office'
      }),
      Task.create({
        title: 'Finalize Hackathon Project Submission',
        date: new Date(2024, 1, 21),
        location: 'Anywhere'
      }),
      Task.create({
        title: 'Compile Meeting Notes',
        date: new Date(2024, 1, 24),
        location: 'Office'
      }),
      Task.create({
        title: 'Update Project Roadmap',
        date: new Date(2024, 1, 25),
        location: 'Office'
      })
    ]);

    // Create a user and assign the created events and tasks to their calendar
    const user = await User.create({
      clerk_user_id: process.env.CLERK_USER_ID,
      firstName: 'Jane',
      gender: 'female',
      age: 29,
      email: 'janedoe@example.com',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      },
      background: {
        education: 'MSc Software Engineering',
        occupation: 'Product Manager',
        maritalStatus: 'Married'
      },
      preferences: ['Product Design', 'Agile Methodologies'],
      goal: 'Lead a successful product launch',
      calendar: {
        past_activities: {
          events: [events[0]._id, events[1]._id], // Assuming the first two events are past events
          tasks: [tasks[0]._id, tasks[1]._id] // Assuming the first two tasks are related to past events
        },
        current_weekly_calendar: {
          events: [events[2]._id], // Assuming the last event is for the current week
          tasks: [tasks[2]._id, tasks[3]._id] // The last two tasks are for the current week
        }
      }
    });

    console.log('Sample data inserted:', user);
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Execute the function to insert data
insertSampleData().then(() => mongoose.disconnect());
