import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. PUBLIC: Allows anyone to send a message
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

// 2. PRIVATE: Fetches the list for your admin-dashboard.html
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

// 3. ADMIN ONLY: Allows you to delete a message by its ID
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});