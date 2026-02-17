import { query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Type for Better Auth user (for TypeScript)
interface BetterAuthUser {
  _id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt: number;
  updatedAt: number;
}

// List all savedDashboards for the authenticated user
// Available as: api.queries.listSavedDashboards OR api.queries.getMySavedDashboards
export const listSavedDashboards = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("savedDashboards")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listSavedDashboards - use whichever name you prefer
export const getMySavedDashboards = listSavedDashboards;

// Get a single savedDashboard by ID (only if owned by user)
export const getSavedDashboard = query({
  args: { id: v.id("savedDashboards") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all suppliers for the authenticated user
// Available as: api.queries.listSuppliers OR api.queries.getMySuppliers
export const listSuppliers = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("suppliers")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listSuppliers - use whichever name you prefer
export const getMySuppliers = listSuppliers;

// Get a single supplier by ID (only if owned by user)
export const getSupplier = query({
  args: { id: v.id("suppliers") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all purchaseOrders for the authenticated user
// Available as: api.queries.listPurchaseOrders OR api.queries.getMyPurchaseOrders
export const listPurchaseOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("purchaseOrders")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listPurchaseOrders - use whichever name you prefer
export const getMyPurchaseOrders = listPurchaseOrders;

// Get a single purchaseOrder by ID (only if owned by user)
export const getPurchaseOrder = query({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all productionOrders for the authenticated user
// Available as: api.queries.listProductionOrders OR api.queries.getMyProductionOrders
export const listProductionOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("productionOrders")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listProductionOrders - use whichever name you prefer
export const getMyProductionOrders = listProductionOrders;

// Get a single productionOrder by ID (only if owned by user)
export const getProductionOrder = query({
  args: { id: v.id("productionOrders") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all deliveries for the authenticated user
// Available as: api.queries.listDeliveries OR api.queries.getMyDeliveries
export const listDeliveries = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("deliveries")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listDeliveries - use whichever name you prefer
export const getMyDeliveries = listDeliveries;

// Get a single deliverie by ID (only if owned by user)
export const getDeliverie = query({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all supportTickets for the authenticated user
// Available as: api.queries.listSupportTickets OR api.queries.getMySupportTickets
export const listSupportTickets = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("supportTickets")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listSupportTickets - use whichever name you prefer
export const getMySupportTickets = listSupportTickets;

// Get a single supportTicket by ID (only if owned by user)
export const getSupportTicket = query({
  args: { id: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all forecasts for the authenticated user
// Available as: api.queries.listForecasts OR api.queries.getMyForecasts
export const listForecasts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("forecasts")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listForecasts - use whichever name you prefer
export const getMyForecasts = listForecasts;

// Get a single forecast by ID (only if owned by user)
export const getForecast = query({
  args: { id: v.id("forecasts") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all agentConversations for the authenticated user
// Available as: api.queries.listAgentConversations OR api.queries.getMyAgentConversations
export const listAgentConversations = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("agentConversations")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listAgentConversations - use whichever name you prefer
export const getMyAgentConversations = listAgentConversations;

// Get a single agentConversation by ID (only if owned by user)
export const getAgentConversation = query({
  args: { id: v.id("agentConversations") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});
