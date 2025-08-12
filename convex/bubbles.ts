import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createBubble = mutation({
  args: {
    publicId: v.string(),
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
    ctx.db.insert("bubbles", {
      createdBy: args.userId,
      name: args.name,
      description: args.description,
      iconId: args.publicId,
      isPublic: args.isPublic,
      requireApproval: false,
      slug: slug,
    });
  },
});
