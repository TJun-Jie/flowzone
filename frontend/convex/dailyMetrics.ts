import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDailyMetrics = mutation({
  args: {
    date: v.string(),
    ratingOfDay: v.float64(),
    wins: v.array(v.string()), // Change to v.array(v.string())
    losses: v.array(v.string()), // Change to v.array(v.string())
    weight: v.number(),
    actionItemsCompleted: v.array(v.id("actionItems")),
    sleepHours: v.float64(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("dailyMetrics", {
      date: args.date,
      ratingOfDay: args.ratingOfDay,
      wins: args.wins,
      losses: args.losses,
      weight: args.weight,
      // actionItemsCompleted: args.actionItemsCompleted,
      sleepHours: args.sleepHours,
    });
  },
});

export const createDailyMetricsBlankForCronJob = internalMutation({
  args: {
    date: v.string(),
    ratingOfDay: v.float64(),
    wins: v.array(v.string()), // Change to v.array(v.string())
    losses: v.array(v.string()), // Change to v.array(v.string())
    weight: v.number(),
    actionItemsCompleted: v.array(v.id("actionItems")),
    sleepHours: v.float64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("dailyMetrics", args);
  },
});
