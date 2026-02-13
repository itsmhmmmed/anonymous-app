import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// CHANGE THIS: This is your master password for the database
const MASTER_KEY = "Itsmhmmed"; 

// 1. Send Message (Public)
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", { 
      body: args.body, 
      author: args.author,
      timestamp: Date.now() 
    });
  },
});

// 2. List Messages (Protected)
export const list = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    // If the key doesn't match, return an empty list (safe)
    if (args.adminKey !== MASTER_KEY) {
      return null; 
    }
    return await ctx.db.query("messages").order("desc").collect();
  },
});

// 3. Remove Message (Protected)
export const remove = mutation({
  args: { id: v.id("messages"), adminKey: v.string() },
  handler: async (ctx, args) => {
    if (args.adminKey !== MASTER_KEY) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});