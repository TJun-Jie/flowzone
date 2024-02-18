import { z } from 'zod';

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

export { DailyMetricsSchema, winsSchema, lossesSchema, ActionItemSchema, RatingOfDaySchema, ActionItemPrioritySchema, ActionItemStatusSchema };
