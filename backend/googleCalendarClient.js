const { google } = require('googleapis');
require('dotenv').config();
const { oauth2Client } = require('./googleOAuth'); // Import the OAuth client
const chrono = require('chrono-node');


/**
 * parse events returned by the thirdparty event scraper api
 * @param {*} event 
 * @returns 
 */
function parseEvent(event) {
    try {
        if (!event.title || !event.date) {
            throw new Error('Missing title or date in event');
        }
        const { startDateISO, endDateISO } = convertHumanReadableDateToISO(event.date);
        
        // Constructing the Google Calendar event format
        return {
            summary: event.title,
            location: event.location,
            event: event.link,
            googleMapUrl: event.googleMapsLink,
            description: event.description,
            start: { dateTime: startDateISO, timeZone: 'America/New_York' }, 
            end: { dateTime: endDateISO, timeZone: 'America/New_York' }
        };
    } catch (error) {
        console.error(`Error parsing event`, error);
        return null;
    }
}


async function insertEventsToCalendar(event) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const googleEvent = parseEvent(event);
        if (googleEvent) {
            console.log(await calendar.events.insert({
                calendarId: 'primary',
                requestBody: googleEvent,
            }));
        } else {
            console.log('Failed to parse event:', event);
        }
}


const { formatISO } = require('date-fns');

function convertHumanReadableDateToISO(humanReadableDateRange) {
  // Parse the human-readable date range into two dates
  const parsedDates = chrono.parse(humanReadableDateRange);

  console.log(`the dates are ${parsedDates[0]}`)
  // Ensure dates are in Date object form to use with date-fns formatISO
  const startDate = new Date(parsedDates[0].start.date());
  const endDate = new Date(parsedDates[0].end.date());

  // Convert start and end dates to ISO format
  const startDateISO = formatISO(startDate);
  const endDateISO = formatISO(endDate);

  return { startDateISO, endDateISO };
}


async function replaceOverlappingEvents(googleEvent) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // Define the time range for checking overlapping events
    const timeMin = googleEvent.start.dateTime;
    const timeMax = googleEvent.end.dateTime;

    try {
        // Step 1: List all events in the time range
        const events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin,
            timeMax: timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });

        // Step 2: Determine and delete overlapping events
        for (const event of events.data.items) {
            // Check for any form of overlap
            if ((event.start.dateTime <= timeMax && event.start.dateTime >= timeMin) ||
                 (event.end.dateTime <= timeMax && event.end.dateTime >= timeMin)) {
                // This event overlaps; delete it
                await calendar.events.delete({
                    calendarId: 'primary',
                    eventId: event.id,
                });
                console.log(`Deleted overlapping event with ID: ${event.id}`);
            }
        }

        // Step 3: Insert the new event
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: googleEvent,
        });
        console.log('New event inserted:', response.data);
    } catch (error) {
        console.error('Error processing calendar events:', error);
    }
}

/**
 * parse events returned by FE into google calendar objects
 * @param {*} eventsJsonString 
 * @returns 
 */
function convertToJsonForGoogleCalendar(eventsJsonString) {
    // Parse the JSON string into objects
    const eventsArray = JSON.parse(eventsJsonString);

    // Map each event object to the Google Calendar event format
    const googleCalendarEvents = eventsArray.map(event => {
        return {
            summary: event.summary,
            location: event.location,
            description: `${event.description} Event URL: ${event.event} Google Map: ${event.google_map}`,
            start: {
                dateTime: event.start.dateTime,
                timeZone: event.start.timeZone
            },
            end: {
                dateTime: event.end.dateTime,
                timeZone: event.end.timeZone
            }
        };
    });

    return googleCalendarEvents;
}

module.exports = { insertEventsToCalendar, parseEvent, replaceOverlappingEvents, convertToJsonForGoogleCalendar };
