import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getComments = query({
  args: {
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();
    let count = 0;
    for (const comment of comments) {
      count++;
    }
    return { comments: comments, number: count };
  },
});

export const postComment = mutation({
  args: {
    authorId: v.string(),
    postId: v.string(),
    body: v.string(),
    authorName: v.string(),
    authorProfileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      authorId: args.authorId,
      postId: args.postId,
      body: args.body,
      authorName: args.authorName,
      authorProfileUrl: args.authorProfileUrl
    });
  },
});
