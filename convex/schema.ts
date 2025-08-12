import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  // Bubbles
  bubbles: defineTable({
    name: v.string(),
    slug: v.string(),             // unique name in URL
    description: v.optional(v.string()),
    createdBy: v.string(),        // userId
    isPublic: v.boolean(),        // for discoverability
    joinCode: v.optional(v.string()), // invite-only code
    requireApproval: v.boolean(),     // if true, code is not enough
    iconUrl: v.string(),
  }).index("slug", ["slug"]),

  // Bubble Members
  bubble_members: defineTable({
    user_id: v.string(),
    bubbleId: v.string(),
    role: v.union(v.literal("admin"), v.literal("moderator"), v.literal("member")),
  }).index("by_userId_role", ["user_id", "role"]),

  // Posts
  posts: defineTable({
    authorId: v.string(),
    bubbleId: v.string(),
    body: v.string(),
  }),

  // Comments
  comments: defineTable({
    authorId: v.string(),
    postId: v.string(),
    body: v.string(),
    createdAt: v.number(),
  }),

  // Join Requests
  join_requests: defineTable({
    bubbleId: v.string(),
    userId: v.string(),
    reason: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
  }),
});
