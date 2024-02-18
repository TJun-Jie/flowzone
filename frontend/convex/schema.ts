import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  distractions: defineTable({
    name: v.string(),
    dateTime: v.number(),
    actionItemId: v.id("actionItems"),
  }),

  stress: defineTable({
    level: v.number(),
    dateTime: v.number(),
    actionItemId: v.id("actionItems"),
  }),
  actionItems: defineTable({
    name: v.string(),
    priority: v.string(), // Assuming ActionItemPriority is an enum or similar, stored as string
    dueDate: v.number(),
    status: v.string(), // Assuming ActionItemStatus is an enum or similar, stored as string
    isDone: v.boolean(),
    projects: v.array(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
      name: v.string(),
    }),
    notes: v.string(),
    stress: v.array(v.id("stress")),
    distractions: v.array(v.id("distractions")),
  }),

  dailyMetrics: defineTable({
    date: v.float64(),
    ratingOfDay: v.string(), // Assuming RatingOfDay is an enum or similar, stored as string
    wins: v.array(v.id("wins")),
    losses: v.array(v.id("losses")),
    weight: v.number(),
    actionItemsCompleted: v.array(v.id("actionItems")),
    sleepHours: v.float64(),
  }),
});
