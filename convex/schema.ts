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
    slug: v.string(), // unique name in URL
    description: v.optional(v.string()),
    createdBy: v.string(), // userId
    isPublic: v.boolean(), // for discoverability
    joinCode: v.optional(v.string()), // invite-only code
    requireApproval: v.boolean(), // if true, code is not enough
    iconUrl: v.string(),
  }).index("slug", ["slug"]).index("by_publicity", ["isPublic"]),

  // Bubble Members
  bubble_members: defineTable({
    user_id: v.string(),
    bubbleId: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("moderator"),
      v.literal("member")
    ),
  }).index("by_userId_role", ["user_id", "role"]).index("by_userId", ["user_id"]).index("by_userId_bubbleId", ["user_id", "bubbleId"]).index("by_bubbleId", ["bubbleId"]),

  // Posts
  posts: defineTable({
    authorId: v.string(),
    bubbleId: v.string(),
    body: v.string(),
    imageUrl: v.string(),
  }).index("by_bubbleId", ["bubbleId"]),

  // Comments
  comments: defineTable({
    authorId: v.string(),
    authorProfileUrl: v.string(),
    authorName: v.string(),
    postId: v.string(),
    body: v.string(),
  }).index("by_postId", ["postId"]),

  // Join Requests
  join_requests: defineTable({
    bubbleId: v.string(),
    userId: v.string(),
    reason: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  }),

  // Likes
  likes: defineTable({
    userId: v.string(),
    postId: v.string(),
  }).index("by_postId_userId", ["postId", "userId"]).index("by_postId", ["postId"])
});
