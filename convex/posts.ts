import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const createPost = mutation({
  args: {
    authorId: v.string(),
    bubbleId: v.string(),
    body: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      authorId: args.authorId,
      bubbleId: args.bubbleId,
      body: args.body,
      imageUrl: args.imageUrl,
    });
  },
});

export const getPosts = query({
  args: {
    bubbleId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const postsList = [];
    const paginationResult = await ctx.db
      .query("posts")
      .withIndex("by_bubbleId", (q) => q.eq("bubbleId", args.bubbleId))
      .order("desc")
      .paginate(args.paginationOpts);
    for (const post of paginationResult.page) {
      const author = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", post.authorId))
        .unique();
      postsList.push({
        post: post,
        author: author,
      });
    }
    return {
      page: postsList,
      isDone: paginationResult.isDone,
      continueCursor: paginationResult.continueCursor,
    };
  },
});
