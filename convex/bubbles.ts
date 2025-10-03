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
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userBubbles = [];
    const bubbleMemberships = await ctx.db
      .query("bubble_members")
      .withIndex("by_userId_role", (q) => q.eq("user_id", args.userId))
      .collect();
    for (const bubbleMembership of bubbleMemberships) {
      const bubble = await ctx.db.get(
        bubbleMembership.bubbleId as Id<"bubbles">
      );
      userBubbles.push({
        bubble: bubble,
        role: bubbleMembership.role,
      });
    }
    return userBubbles;
  },
});

export const getBubbleName = query({
  args: {
    bubbleSlug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bubbles")
      .withIndex("slug", (q) => q.eq("slug", args.bubbleSlug))
      .unique();
  },
});
export const getBubbleNameById = query({
  args: {
    bubbleId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bubbles")
      .withIndex("by_id", (q) => q.eq("_id", args.bubbleId as Id<"bubbles">))
      .unique();
  },
});

export const getBubbleRoles = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bubble_members")
      .withIndex("by_userId", (q) => q.eq("user_id", args.userId))
      .first();
  },
});

export const joinBubble = mutation({
  args: {
    bubbleId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bubble_members")
      .withIndex("by_userId_bubbleId", (q) =>
        q.eq("user_id", args.userId).eq("bubbleId", args.bubbleId)
      )
      .first();
    if (existing) return true;
    await ctx.db.insert("bubble_members", {
      user_id: args.userId,
      bubbleId: args.bubbleId,
      role: "member",
    });
  },
});

export const searchBubbles = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const search = args.searchTerm.toLowerCase();
    const bubbles = await ctx.db
      .query("bubbles")
      .withIndex("by_publicity", (q) => q.eq("isPublic", true))
      .collect();

    if (search.trim() == "") {
      return bubbles;
    } else {
      return bubbles.filter(
        (b) =>
          b.name.toLocaleLowerCase().includes(search) ||
          b.description?.toLocaleLowerCase().includes(search)
      );
    }
  },
});


export const getAllBubbleMembers = query({
  args: {
    bubbleId: v.string()
  },
  handler: async (ctx, args) => {
    const userBubbles = [];
    const bubbleMemberships = await ctx.db
      .query("bubble_members")
      .withIndex("by_bubbleId", (q) => q.eq("bubbleId", args.bubbleId))
      .collect();
    let users = []
      for (const member of bubbleMemberships){
        const usersInBubble = await ctx.db.query("users").withIndex("by_clerkId", q=> q.eq("clerkId", member.user_id)).first()
        users.push(usersInBubble)
      }
    return users;
  },
});