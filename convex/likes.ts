import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const LikePost = mutation({
  args: {
    postId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .unique();
    if (existing) return;
    await ctx.db.insert("likes", {
      postId: args.postId,
      userId: args.userId,
    });
  },
});

export const UnlikePost = mutation({
  args: {
    postId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .unique();
    if (!existing) return;
    await ctx.db.delete(existing._id);
  },
});

export const getLikesCount = query({
  args: {
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const likesForPost = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();
    return likesForPost.length;
  },
});

export const youLikedIt = query({
     args: {
    postId: v.string(),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .unique();
      if (existing){
        return true
      } else {
        return false
      }
  },
})