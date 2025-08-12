import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createBubble = mutation({
  args: {
    iconUrl: v.string(),
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    function createSlug(name: string) {
      return name
        .toLowerCase()
        .replace(/'/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }
    let baseSlug = createSlug(args.name);
    let slug = baseSlug;

    let counter = 1;
    while (true) {
      const existing = await ctx.db
        .query("bubbles")
        .withIndex("slug", (q) => q.eq("slug", slug))
        .unique();

      if (!existing) break; // slug is free

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    const bubbleId = await ctx.db.insert("bubbles", {
      createdBy: args.userId,
      name: args.name,
      description: args.description,
      iconUrl: args.iconUrl,
      isPublic: args.isPublic,
      requireApproval: false,
      slug: slug,
    });
    ctx.db.insert("bubble_members", {
      user_id: args.userId,
      bubbleId: bubbleId,
      role: "admin",
    });
  },
});

export const getBubbles = query({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const userBubbles = [];
    const bubbleMemberships = await ctx.db.query("bubble_members").withIndex("by_userId_role", q => q.eq("user_id", args.userId)).collect();
    for (const bubbleMembership of bubbleMemberships){
      const bubble = await ctx.db.get(bubbleMembership.bubbleId as Id<"bubbles">);
      userBubbles.push({
        bubble: bubble,
        role: bubbleMembership.role
      })
    }
    return userBubbles;
  }
})

export const getBubbleName = query({
  args: {
    bubbleSlug: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("bubbles").withIndex("slug", q => q.eq("slug", args.bubbleSlug)).unique();
  }
})