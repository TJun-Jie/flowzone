import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageIds = mutation({
  // You can customize these as you like
  args: {
    storageIds: v.array(
      v.object({
        storageId: v.string(),
      })
    ),
    actionItemId: v.id("actionItems"),
    // other args...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...

    // Save the storageId to the database using `insert`
    ctx.db.patch(args.actionItemId, {
      storageIds: args.storageIds.map(({ storageId }) => storageId),
      // ...
    });
  },
});
