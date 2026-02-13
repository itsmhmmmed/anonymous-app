import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// This function saves a message to the database
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      body: args.body,
      author: args.author,
      time: Date.now(),
    });
  },
});

// This function reads all messages
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});