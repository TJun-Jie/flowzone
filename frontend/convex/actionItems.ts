import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("actionItems").collect();
  },
});

export const createActionItem = mutation({
  args: {
    name: v.string(),
    priority: v.string(), // Assuming ActionItemPriority is an enum or similar, stored as string
    dueDate: v.string(),
    status: v.string(), // Assuming ActionItemStatus is an enum or similar, stored as string
    isDone: v.boolean(),
    projects: v.array(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
      name: v.string(),
    }),
    notes: v.string(),
    stress: v.array(v.number()),
    distractions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("actionItems", {
      name: args.name,
      priority: args.priority,
      dueDate: args.dueDate,
      status: args.status,
      isDone: args.isDone,
      projects: args.projects,
      startTime: args.startTime,
      endTime: args.endTime,
      notes: args.notes,
      stress: args.stress,
      distractions: args.distractions,
    });
  },
});
export const updateActionItemName = mutation({
  args: { id: v.id("actionItems"), name: v.string() },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    await ctx.db.patch(id, { name: args.name });
  },
});

export const updateActionItemStartTime = mutation({
  args: { id: v.id("actionItems"), startTime: v.string() },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    await ctx.db.patch(id, { startTime: args.startTime });
  },
});

export const updateActionItemEndTimes = mutation({
  args: { id: v.id("actionItems"), endTime: v.string() },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    await ctx.db.patch(id, { endTime: args.endTime });
  },
});

export const updateCheckbox = mutation({
  args: { id: v.id("actionItems"), isDone: v.boolean() },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    await ctx.db.patch(id, { isDone: args.isDone });
  },
});
