import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByActionItemId = query({
  args: { actionItemId: v.id("actionItems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stresses")
      .filter((q) => q.eq(q.field("actionItemId"), args.actionItemId))
      .collect();
  },
});
