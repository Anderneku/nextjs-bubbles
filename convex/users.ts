import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUserIfNotExists = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) return;

    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl,
    });
  },
});

export const getUsersProfilePic = query({
  args: {
    userClerkId: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", args.userClerkId)).first()
  }
})