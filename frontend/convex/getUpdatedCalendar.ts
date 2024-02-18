"use node";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { action } from "./_generated/server";
import { v } from "convex/values";


// RatingOfDay Enum Schema
const RatingOfDaySchema = z.enum(['bad', 'average', 'good']).describe('Rating of the day');

// ActionItemPriority Enum Schema
const ActionItemPrioritySchema = z.enum(['low', 'medium', 'high']).describe('Priority of an action item');

// ActionItemStatus Enum Schema
const ActionItemStatusSchema = z.enum(['pending', 'inProgress', 'completed']).describe('Status of an action item');

// Location Schema Placeholder
// Assuming a simple structure for demonstration. Replace this with the actual schema if different.
const LocationSchema = z.object({
  latitude: z.number().describe('Latitude of the location'),
  longitude: z.number().describe('Longitude of the location'),
}).describe('Geographic location');

// StressIndex Schema for every 5-minute interval
const StressIndexSchema = z.object({
  stressIndex: z.number().describe('Stress index measurement'),
  time: z.date().describe('Time of the stress index measurement'),
}).describe('Stress index measurement at a 5-minute interval');

// Wins Schema with voice
const winsSchema = z.object({
  id: z.number().describe('Unique identifier for the win'),
  date: z.date().describe('Date of the win'),
  win: z.string().describe('Description of the win'),
  voice: z.string().optional().describe('Voice note associated with the win'),
  location: LocationSchema.optional().describe('Location of the win'),
});

// Losses Schema with voice
const lossesSchema = z.object({
  id: z.number().describe('Unique identifier for the loss'),
  date: z.date().describe('Date of the loss'),
  loss: z.string().describe('Description of the loss'),
  voice: z.string().optional().describe('Voice note associated with the loss'),
  location: LocationSchema.optional().describe('Location of the loss'),
});

// ActionItem Schema
const ActionItemSchema = z.object({
  name: z.string().describe('Name of the action item'),
  priority: ActionItemPrioritySchema,
  dueDate: z.date().describe('Due date of the action item'),
  status: ActionItemStatusSchema,
  isDone: z.boolean().describe('Whether the action item is done'),
  projects: z.array(z.string()).describe('List of project names or identifiers associated with the action item'),
  startTime: z.date().describe('Start time of the action item'),
  endTime: z.date().describe('End time of the action item'),
  location: LocationSchema.describe('Location associated with the action item'),
  notes: z.string().describe('Additional notes regarding the action item'),
  stress: z.array(StressIndexSchema).describe('Stress index measurements at 5-minute intervals'),
  distractions: z.array(z.string()).describe('List of distractions'),
}).describe('Details of an action item');

// DailyMetrics Schema
const DailyMetricsSchema = z.object({
  id: z.number().describe('Unique identifier for the daily metrics'),
  date: z.date().describe('Date of the metrics'),
  ratingOfDay: RatingOfDaySchema,
  wins: z.array(winsSchema).describe('List of wins'),
  losses: z.array(lossesSchema).describe('List of losses'),
  weight: z.number().describe('Weight in kilograms'),
  actionItems: z.array(ActionItemSchema).describe('List of action item IDs'),
  sleepHours: z.number().describe('Number of hours slept'),
}).describe('Daily metrics including wins, losses, action items, and overall rating of the day');

// Defining the Together.ai client
const togetherai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

const jsonSchema = zodToJsonSchema(z.array(ActionItemSchema), 'mySchema');


export const amendActionItems = action({
    args: {
        project: v.string() 
      },
  handler: async (ctx, args) => {
    console.log("here");
    const currentActionItems = `
    [
        {
          "name": "Prepare Project Proposal",
          "priority": "high",
          "dueDate": "2024-02-17T23:59:00.000Z",
          "status": "inProgress",
          "isDone": false,
          "projects": ["Project Falcon"],
          "startTime": "2024-02-17T08:00:00.000Z",
          "endTime": "2024-02-17T09:30:00.000Z",
          "location": {
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "notes": "Finalize the outline and get feedback from the team.",
          "stress": [
            {
              "stressIndex": 3,
              "time": "2024-02-17T08:30:00.000Z"
            },
            {
              "stressIndex": 2,
              "time": "2024-02-17T09:00:00.000Z"
            }
          ],
          "distractions": ["Email notifications", "Phone calls"]
        },
        {
          "name": "Team Meeting",
          "priority": "medium",
          "dueDate": "2024-02-17T23:59:00.000Z",
          "status": "pending",
          "isDone": false,
          "projects": ["Project Falcon"],
          "startTime": "2024-02-17T10:00:00.000Z",
          "endTime": "2024-02-17T11:00:00.000Z",
          "location": {
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "notes": "Discuss project milestones and assign tasks.",
          "stress": [],
          "distractions": []
        },
        {
          "name": "Code Review",
          "priority": "medium",
          "dueDate": "2024-02-17T23:59:00.000Z",
          "status": "pending",
          "isDone": false,
          "projects": ["Project Falcon"],
          "startTime": "2024-02-17T11:30:00.000Z",
          "endTime": "2024-02-17T12:30:00.000Z",
          "location": {
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "notes": "Review the latest pull requests and provide feedback.",
          "stress": [],
          "distractions": ["Slack messages"]
        },
        {
          "name": "Lunch Break",
          "priority": "low",
          "dueDate": "2024-02-17T23:59:00.000Z",
          "status": "completed",
          "isDone": true,
          "projects": [],
          "startTime": "2024-02-17T13:00:00.000Z",
          "endTime": "2024-02-17T14:00:00.000Z",
          "location": {
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "notes": "Meet with mentor to discuss career development.",
          "stress": [],
          "distractions": []
        },
        {
          "name": "Client Call",
          "priority": "high",
          "dueDate": "2024-02-17T23:59:00.000Z",
          "status": "pending",
          "isDone": false,
          "projects": ["Project Falcon"],
          "startTime": "2024-02-17T15:00:00.000Z",
          "endTime": "2024-02-17T16:00:00.000Z",
          "location": {
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "notes": "Discuss project progress and next steps with the client.",
          "stress": [
            {
              "stressIndex": 4,
              "time": "2024-02-17T15:30:00.000Z"
            }
          ],
          "distractions": ["Unexpected emails"]
        }
      ]
      
    
    `;

    const context = "1. user needs more physical activities. 2. user is too stressed out, he needs some personal time";
  console.log("here2");
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
    });
    console.log(`the context is ${context}`);
    const prompt = `USER'S CURRENT CALENDAR: ${JSON.stringify(currentActionItems)}`;
    const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `MODIFY CURRENT USER'S CALENDAR STRICTLY BASED ON ${context}, You are to STRICTLY ONLY OUPUT JSON objects. RETURN ALL EVENTS INCLUDING THE ORIGINAL ONES. DO NOT DIFFERENTIATE OLD OR NEW EVENTS. Respond only as a JSON document, and strictly conform to the following typescript schema, paying attention to comments as requirements: ${jsonSchema}}. `,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        model: "gpt-3.5-turbo"})
        console.log(response);
        console.log(response.choices[0].message.content);
        const json = JSON.parse(response.choices[0].message.content || "");
        console.log(json);
        return response.choices[0].message.content;
        /**
   * const extract = await togetherai.chat.completions.create({
    "temperature": 0.6,
    messages: [
      {
        role: 'system',
        content:
        `CREATE, DELETE OR SHIFT EVENTS IN THE CURRENT USER'S CALENDAR BASED ON ${context}, RETURN ALL EVENTS INCLUDING THE ORIGINAL ONES AND NEW ONES`,
      },
      {
        role: 'user',
        content: system_message,
      },
    ],
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    // @ts-ignore
    response_format: { type: 'json_object', schema: jsonSchema },
  });
  console.log("here3");
  const output = JSON.parse(extract.choices[0].message.content!);
  console.log(output);
  return output;*/
}});

//"model": "meta-llama/Llama-2-13b-chat-hf"
