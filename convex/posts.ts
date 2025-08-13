import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const postMessage = mutation({
  args: {
    authorId: v.string(),
    bubbleId: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      authorId: args.authorId,
      bubbleId: args.bubbleId,
      body: args.body,
    });
  },
});

export const getPosts = query({
  args: {
    bubbleId: v.string(),
  },
  handler: async (ctx, args) => {
    const postsList = [];
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_bubbleId", (q) => q.eq("bubbleId", args.bubbleId))
      .collect();
      for (const post of posts) {
          const author = await ctx.db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", post.authorId)).unique();
      postsList.push({
        post: post,
        author: author,
      });
    }
    return postsList;
  },
});
