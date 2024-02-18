"use node";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { action } from "./_generated/server";
import { v } from "convex/values";


// Defining the Together.ai client
const togetherai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

// Defining the schema we want our data in.

// const jsonSchema = zodToJsonSchema(actionItemsSchema, 'mySchema');


export const getInsights = action({
  args: {
    project: v.string() 
  },
  handler: async (ctx, args) => {
    const daily_metrics = `
    {
      "date": "2024-02-17",
      "daily_metrics": {
        "overall_day_rating": 7,
        "hours_of_sleep": 6.5
      },
      "wins": [
        {
          "time": "10:00",
          "description": "Completed the project presentation ahead of schedule."
        },
        {
          "time": "15:30",
          "description": "Received positive feedback from the manager."
        }
      ],
      "losses": [
        {
          "time": "12:00",
          "description": "Skipped lunch due to back-to-back meetings."
        },
        {
          "time": "18:00",
          "description": "Missed a call from a potential client."
        }
      ],
      "action_items": [
        {
          "start_time": "09:00",
          "end_time": "10:30",
          "location": "Office",
          "activity": "Project Work",
          "stress_indexes": [40, 30, 25]
        },
        {
          "start_time": "11:00",
          "end_time": "12:30",
          "location": "Conference Room",
          "activity": "Team Meeting",
          "stress_indexes": [60, 65, 70]
        },
        {
          "start_time": "13:00",
          "end_time": "14:00",
          "location": "Office",
          "activity": "Email Correspondence",
          "stress_indexes": [20, 15, 10]
        },
        {
          "start_time": "14:30",
          "end_time": "15:30",
          "location": "Office",
          "activity": "Client Call",
          "stress_indexes": [50, 45, 40]
        },
        {
          "start_time": "16:00",
          "end_time": "17:00",
          "location": "Gym",
          "activity": "Workout Session",
          "stress_indexes": [30, 25, 20]
        }
      ]
    }
    
    `;
  const system_message = `
  You are a productivity analyst designed to generate behavioural and habitual insights based on my daily metrics, schedule, and reflection.
  You are provided with the following data:

  My daily metrics which includes

  A list of my activities for the day

  Find patterns about the pros and cons of my schedule based on my wins, losses, stress levels, and sleep.
  Determine and estimate what overarching reasons about my schedule may be good or bad. If the schedule is neutral, mention that too.
  These points should be about my schedule, list out these points.
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
        content: daily_metrics,
      },
    ],
    model: "meta-llama/Llama-2-13b-chat-hf"
    // @ts-ignore – Together.ai supports schema while OpenAI does not
    // response_format: { type: 'json_object', schema: jsonSchema },
  });
  
  const output = extract.choices[0].message.content?.toString();
  console.log(output);
  return output;
}});

//"model": "meta-llama/Llama-2-13b-chat-hf"
