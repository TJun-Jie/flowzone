const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  summary: { // Changed from 'title' to 'summary' to match Google's terminology
    type: String,
    required: true
  },
  start: { // Changed to an object to include both 'dateTime' and 'timeZone'
    dateTime: {
      type: Date,
      required: true
    },
    timeZone: { // Optional, add if you need to specify time zones per event
      type: String,
      required: false
    }
  },
  end: { // Changed to an object to include both 'dateTime' and 'timeZone'
    dateTime: {
      type: Date,
      required: true
    },
    timeZone: { // Optional, add if you need to specify time zones per event
      type: String,
      required: false
    }
  },
  location: String, // physical address
  description: String, // Optional, can store additional details or a description
  googleMapUrl: { 
    type: String,
    required: false 
}});

module.exports = mongoose.model('Event', eventSchema);
module.exports.eventSchema = eventSchema;
