"use node";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { action } from "./_generated/server";
import { v } from "convex/values";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Defining the schema we want our data in.
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
  time: z.string().datetime({ offset: true }).describe('Time of the stress index measurement in ISO GMT-8'),
}).describe('Stress index measurement at a 5-minute interval');

// Wins Schema with voice
const winsSchema = z.object({
  id: z.number().describe('Unique identifier for the win'),
  date: z.string().datetime({ offset: true }).describe('Date of the win in ISO GMT-8'),
  win: z.string().describe('Description of the win'),
  voice: z.string().optional().describe('Voice note associated with the win'),
  location: LocationSchema.optional().describe('Location of the win'),
});

// Losses Schema with voice
const lossesSchema = z.object({
  id: z.number().describe('Unique identifier for the loss'),
  date: z.string().datetime({ offset: true }).describe('Date of the loss in ISO GMT-8'),
  loss: z.string().describe('Description of the loss'),
  voice: z.string().optional().describe('Voice note associated with the loss'),
  location: LocationSchema.optional().describe('Location of the loss'),
});

// ActionItem Schema
const NewActionItemSchema = z.object({
  name: z.string().describe('Name of the action'),
  priority: ActionItemPrioritySchema,
  dueDate: z.string().datetime({ offset: true }).describe('Due date of the action item in ISO GMT-8'),
  startTime: z.string().datetime({ offset: true }).describe('Start time of the action item in ISO GMT-8'),
  endTime: z.string().datetime({ offset: true }).describe('End time of the action item in ISO GMT-8'),
  location: LocationSchema.describe('Location associated with the action item'),
  notes: z.string().describe('Additional notes regarding the action item'),
}).describe('Details of an action item');

// New Action Item Schema
const ActionItemSchema = z.object({
  name: z.string().describe('Name of the action item'),
  priority: ActionItemPrioritySchema,
  dueDate: z.string().datetime({ offset: true }).describe('Due date of the action item in ISO GMT-8'),
  status: ActionItemStatusSchema,
  isDone: z.boolean().describe('Whether the action item is done'),
  projects: z.array(z.string()).describe('List of project names or identifiers associated with the action item'),
  startTime: z.string().datetime({ offset: true }).describe('Start time of the action item in ISO GMT-8'),
  endTime: z.string().datetime({ offset: true }).describe('End time of the action item in ISO GMT-8'),
  location: LocationSchema.describe('Location associated with the action item'),
  notes: z.string().describe('Additional notes regarding the action item'),
  stress: z.array(StressIndexSchema).describe('Stress index measurements at 5-minute intervals'),
  distractions: z.array(z.string()).describe('List of distractions'),
}).describe('Details of an action item');

// DailyMetrics Schema
const DailyMetricsSchema = z.object({
  id: z.number().describe('Unique identifier for the daily metrics'),
  date: z.string().datetime({ offset: true }).describe('Date of the metrics'),
  ratingOfDay: RatingOfDaySchema,
  wins: z.array(winsSchema).describe('List of wins'),
  losses: z.array(lossesSchema).describe('List of losses'),
  weight: z.number().describe('Weight in kilograms'),
  actionItems: z.array(ActionItemSchema).describe('List of action item IDs'),
  sleepHours: z.number().describe('Number of hours slept'),
}).describe('Daily metrics including wins, losses, action items, and overall rating of the day');

// const jsonSchema = zodToJsonSchema(NewActionItemSchema, 'mySchema');

const jsonSchema = `
  {
    name: <string of name of the action>,
    priority: <either one of "low", "medium", "high">,
    dueDate: <time in ISO8601 format for timezone GMT-8>
    startTime: <time in ISO8601 format for timezone GMT-8>
    endTime: <time in ISO8601 format for timezone GMT-8>
    notes: <string of additional notes regarding the action item>
  }
`
//You are a helpful productivity expert tasked with generating an array of action items over a week for a user who wants to complete the following goal: ${user_prompt}.
// PLEASE GENERATE A WHOLE ARRAY of action items FOR A WHOLE WEEK in the following JSON structure: [${jsonSchema},...]. These action itmes will specify activities the user should carry out as the user
// works towards the goal. Please suggest activities specfic to working towards completing the goal while also including the mundane activities such
// as lunch and sleep.
// You are to STRICTLY ONLY OUPUT A WHOLE ARRAY of enough JSON action items for a whole week.

export const generateActionItems = action({
  args: {
    prompt: v.string() 
  },
  handler: async (ctx, args) => {
    const user_prompt = args.prompt
    const system_message = `
      you are a helpful assistant to OUTPUT A WEEK'S WORTH OF ACTIVITIES IN THE FOLLOWING JSON format ${jsonSchema} given a user's goal. Suggest activities to 
      work towards the goal while including essential activities such as eating and sleeping.
    `;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
        system_message,
      },
      {
        role: 'user',
        content: user_prompt
      },
    ],
    response_format: { "type": "json_object" },
    model: "gpt-4-turbo-preview",
    temperature: 0.8,
  });
  console.log(response.choices[0].finish_reason);
  console.log(response.choices[0].message.content);
  const output = JSON.stringify(JSON.parse(response.choices[0].message.content || '{}'));
  console.log(output);
  return output;
}});

// TOGETHER AI CODE
/*
// Defining the Together.ai client
const togetherai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

// Defining the schema we want our data in.
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
  time: z.string().datetime({ offset: true }).describe('Time of the stress index measurement in ISO GMT-8'),
}).describe('Stress index measurement at a 5-minute interval');

// Wins Schema with voice
const winsSchema = z.object({
  id: z.number().describe('Unique identifier for the win'),
  date: z.string().datetime({ offset: true }).describe('Date of the win in ISO GMT-8'),
  win: z.string().describe('Description of the win'),
  voice: z.string().optional().describe('Voice note associated with the win'),
  location: LocationSchema.optional().describe('Location of the win'),
});

// Losses Schema with voice
const lossesSchema = z.object({
  id: z.number().describe('Unique identifier for the loss'),
  date: z.string().datetime({ offset: true }).describe('Date of the loss in ISO GMT-8'),
  loss: z.string().describe('Description of the loss'),
  voice: z.string().optional().describe('Voice note associated with the loss'),
  location: LocationSchema.optional().describe('Location of the loss'),
});

// ActionItem Schema
const NewActionItemSchema = z.object({
  name: z.string().describe('Name of the action'),
  priority: ActionItemPrioritySchema,
  dueDate: z.string().datetime({ offset: true }).describe('Due date of the action item in ISO GMT-8'),
  projects: z.array(z.string()).describe('List of project names or identifiers associated with the action item'),
  startTime: z.string().datetime({ offset: true }).describe('Start time of the action item in ISO GMT-8'),
  endTime: z.string().datetime({ offset: true }).describe('End time of the action item in ISO GMT-8'),
  location: LocationSchema.describe('Location associated with the action item'),
  notes: z.string().describe('Additional notes regarding the action item'),
}).describe('Details of an action item');

// New Action Item Schema
const ActionItemSchema = z.object({
  name: z.string().describe('Name of the action item'),
  priority: ActionItemPrioritySchema,
  dueDate: z.string().datetime({ offset: true }).describe('Due date of the action item in ISO GMT-8'),
  status: ActionItemStatusSchema,
  isDone: z.boolean().describe('Whether the action item is done'),
  projects: z.array(z.string()).describe('List of project names or identifiers associated with the action item'),
  startTime: z.string().datetime({ offset: true }).describe('Start time of the action item in ISO GMT-8'),
  endTime: z.string().datetime({ offset: true }).describe('End time of the action item in ISO GMT-8'),
  location: LocationSchema.describe('Location associated with the action item'),
  notes: z.string().describe('Additional notes regarding the action item'),
  stress: z.array(StressIndexSchema).describe('Stress index measurements at 5-minute intervals'),
  distractions: z.array(z.string()).describe('List of distractions'),
}).describe('Details of an action item');

// DailyMetrics Schema
const DailyMetricsSchema = z.object({
  id: z.number().describe('Unique identifier for the daily metrics'),
  date: z.string().datetime({ offset: true }).describe('Date of the metrics'),
  ratingOfDay: RatingOfDaySchema,
  wins: z.array(winsSchema).describe('List of wins'),
  losses: z.array(lossesSchema).describe('List of losses'),
  weight: z.number().describe('Weight in kilograms'),
  actionItems: z.array(ActionItemSchema).describe('List of action item IDs'),
  sleepHours: z.number().describe('Number of hours slept'),
}).describe('Daily metrics including wins, losses, action items, and overall rating of the day');

const jsonSchema = zodToJsonSchema(ActionItemSchema, 'mySchema');

export const generateActionItems = action({
    args: {
      project: v.string() 
    },
    handler: async (ctx, args) => {
      console.log("start");
      console.log(jsonSchema)
      const prompt = `
        you are generating JSON test data according to a given JSON format and its description.
      `;
      const system_message = `
        generate an example action item that would fit in a day. datetime should be given in GMT-8 timezone.
        Please generate multiple action items.
      `;
  
    const extract = await togetherai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
          system_message,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: "mistralai/Mistral-7B-Instruct-v0.1",
    //@ts-ignore – Together.ai supports schema while OpenAI does not
      response_format: { type: 'json_object', schema: jsonSchema },
    });
    
    const output = JSON.stringify(JSON.parse(extract.choices[0].message.content || '{}'), null, 2);
    console.log(output);
    return output;
  }});
  */