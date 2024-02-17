const mongoose = require('mongoose');
const Event = require('./event');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  clerk_user_id: {type: String, required:true},
  firstName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  background: {
    education: String,
    occupation: String,
    maritalStatus: String
  },
  preferences: {
    type: [String],
    default: []
  },
  goal: String,
  calendar: {
    past_activities: {
      events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
      tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
    },
    current_weekly_calendar: {
      events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
      tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
    }
  }
});

const users = mongoose.model('users', userSchema);

module.exports = users;
