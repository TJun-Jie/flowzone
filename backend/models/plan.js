// models/Plan.js
const TaskSchema = require('./task').schema;
const EventSchema = require('./event').schema;

const mongoose = require('mongoose');



const PlanSchema = new mongoose.Schema({
  clerk_user_id: String,// Assuming you have a User model
  goal_name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Assuming events have the same structure as tasks
  is_confirmed: { type: Boolean, default: false },
  start_date: { type: Date, required: true }

});

module.exports = mongoose.model('Plan', PlanSchema);
