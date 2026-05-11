import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logFlight = mutation({
  args: {
    timestamp: v.number(),
    droneModel: v.string(),
    riskScore: v.number(),
    status: v.string(),
    coordinateCount: v.number(),
  },
  handler: async (ctx, args) => {
    const flightData = { ...args };

    // Backend validation logic
    if (flightData.riskScore > 50) {
       // Force rejection if client side logic was bypassed
       flightData.status = "REJECTED";
    }

    const flightId = await ctx.db.insert("flights", flightData);
    return flightId;
  },
});

export const getRecentFlights = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("flights")
      .withIndex("by_timestamp")
      .order("desc")
      .take(5);
  },
});
