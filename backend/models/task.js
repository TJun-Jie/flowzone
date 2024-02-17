const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: String
});

module.exports = mongoose.model('Task', taskSchema);
module.exports.taskSchema = taskSchema;

