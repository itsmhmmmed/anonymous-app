import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// We pull the password from the environment, NOT the code
const MASTER_KEY = process.env.ADMIN_PASSWORD; 

export const list = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    // If the key isn't set on the server yet, block everything for safety
    if (!MASTER_KEY || args.adminKey !== MASTER_KEY) {
      return null; 
    }
    return await ctx.db.query("messages").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("messages"), adminKey: v.string() },
  handler: async (ctx, args) => {
    if (!MASTER_KEY || args.adminKey !== MASTER_KEY) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});

// (Keep your 'send' mutation the same as before)