import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("missions")
      .withIndex("by_timestamp")
      .order("desc")
      .collect(); // We collect all since the original UI assumed all loaded
  },
});

export const save = mutation({
  args: {
    name: v.string(),
    timestamp: v.number(),
    path: v.array(v.object({ lat: v.number(), lng: v.number() })),
    settings: v.object({ altitude: v.number(), model: v.string() }),
    riskScore: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("missions", {
      name: args.name,
      timestamp: args.timestamp,
      path: args.path,
      settings: args.settings,
      riskScore: args.riskScore,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("missions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
