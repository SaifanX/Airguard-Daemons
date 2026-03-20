import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  missions: defineTable({
    name: v.string(),
    timestamp: v.number(),
    path: v.array(v.object({
      lat: v.number(),
      lng: v.number()
    })),
    settings: v.object({
      altitude: v.number(),
      model: v.string()
    }),
    riskScore: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  // Keep existing flights table if it was there for some reason
  flights: defineTable({
    timestamp: v.number(),
    droneModel: v.string(),
    riskScore: v.number(),
    status: v.string(), 
    coordinateCount: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
