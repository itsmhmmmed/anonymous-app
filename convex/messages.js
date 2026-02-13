import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// This pulls your secret from the Convex Dashboard Settings
const MASTER_KEY = process.env.ADMIN_PASSWORD; 

/**
 * 1. SEND MESSAGE (Public)
 * Used by index.html to store a new secret.
 */
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

/**
 * 2. LIST MESSAGES (Protected)
 * Used by admin-dashboard.html to view secrets.
 */
export const list = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    // SECURITY: If the key doesn't match the Env Var, return null
    if (!MASTER_KEY || args.adminKey !== MASTER_KEY) {
      return null; 
    }
    // Return messages from newest to oldest
    return await ctx.db.query("messages").order("desc").collect();
  },
});

/**
 * 3. REMOVE MESSAGE (Protected)
 * Used by admin-dashboard.html to delete/drop items.
 */
export const remove = mutation({
  args: { id: v.id("messages"), adminKey: v.string() },
  handler: async (ctx, args) => {
    // SECURITY: Block unauthorized deletion attempts
    if (!MASTER_KEY || args.adminKey !== MASTER_KEY) {
      throw new Error("Unauthorized Access");
    }
    await ctx.db.delete(args.id);
  },
});