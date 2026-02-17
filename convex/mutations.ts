import { mutation } from "./_generated/server";
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

// Create a new savedDashboard
export const createSavedDashboard = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    widgets: v.string(),
    query: v.string(),
    createdBy: v.optional(v.string()),
    isShared: v.boolean(),
    lastViewed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("savedDashboards", {
      userId: user._id,
      title: args.title,
      description: args.description,
      widgets: args.widgets,
      query: args.query,
      createdBy: args.createdBy,
      isShared: args.isShared,
      lastViewed: args.lastViewed,
    });
  },
});

// Update a savedDashboard (only if owned by user)
export const updateSavedDashboard = mutation({
  args: {
    id: v.id("savedDashboards"),
    title: v.optional(v.string()),
    description: v.optional(v.optional(v.string())),
    widgets: v.optional(v.string()),
    query: v.optional(v.string()),
    createdBy: v.optional(v.optional(v.string())),
    isShared: v.optional(v.boolean()),
    lastViewed: v.optional(v.optional(v.number())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a savedDashboard (only if owned by user)
export const deleteSavedDashboard = mutation({
  args: { id: v.id("savedDashboards") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new supplier
export const createSupplier = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    rating: v.number(),
    onTimeRate: v.number(),
    qualityScore: v.number(),
    status: v.string(),
    totalOrders: v.number(),
    totalSpent: v.number(),
    leadTimeDays: v.number(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("suppliers", {
      userId: user._id,
      name: args.name,
      category: args.category,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      rating: args.rating,
      onTimeRate: args.onTimeRate,
      qualityScore: args.qualityScore,
      status: args.status,
      totalOrders: args.totalOrders,
      totalSpent: args.totalSpent,
      leadTimeDays: args.leadTimeDays,
      location: args.location,
    });
  },
});

// Update a supplier (only if owned by user)
export const updateSupplier = mutation({
  args: {
    id: v.id("suppliers"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    contactEmail: v.optional(v.optional(v.string())),
    contactPhone: v.optional(v.optional(v.string())),
    rating: v.optional(v.number()),
    onTimeRate: v.optional(v.number()),
    qualityScore: v.optional(v.number()),
    status: v.optional(v.string()),
    totalOrders: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
    leadTimeDays: v.optional(v.number()),
    location: v.optional(v.optional(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a supplier (only if owned by user)
export const deleteSupplier = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new purchaseOrder
export const createPurchaseOrder = mutation({
  args: {
    supplierId: v.id("suppliers"),
    orderNumber: v.string(),
    status: v.string(),
    totalAmount: v.number(),
    items: v.string(),
    expectedDelivery: v.number(),
    actualDelivery: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("purchaseOrders", {
      userId: user._id,
      supplierId: args.supplierId,
      orderNumber: args.orderNumber,
      status: args.status,
      totalAmount: args.totalAmount,
      items: args.items,
      expectedDelivery: args.expectedDelivery,
      actualDelivery: args.actualDelivery,
      notes: args.notes,
    });
  },
});

// Update a purchaseOrder (only if owned by user)
export const updatePurchaseOrder = mutation({
  args: {
    id: v.id("purchaseOrders"),
    supplierId: v.optional(v.id("suppliers")),
    orderNumber: v.optional(v.string()),
    status: v.optional(v.string()),
    totalAmount: v.optional(v.number()),
    items: v.optional(v.string()),
    expectedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.optional(v.number())),
    notes: v.optional(v.optional(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a purchaseOrder (only if owned by user)
export const deletePurchaseOrder = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new productionOrder
export const createProductionOrder = mutation({
  args: {
    orderNumber: v.string(),
    productName: v.string(),
    quantity: v.number(),
    status: v.string(),
    priority: v.string(),
    productionLine: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    completedQuantity: v.number(),
    defectRate: v.number(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("productionOrders", {
      userId: user._id,
      orderNumber: args.orderNumber,
      productName: args.productName,
      quantity: args.quantity,
      status: args.status,
      priority: args.priority,
      productionLine: args.productionLine,
      startDate: args.startDate,
      endDate: args.endDate,
      completedQuantity: args.completedQuantity,
      defectRate: args.defectRate,
      channel: args.channel,
    });
  },
});

// Update a productionOrder (only if owned by user)
export const updateProductionOrder = mutation({
  args: {
    id: v.id("productionOrders"),
    orderNumber: v.optional(v.string()),
    productName: v.optional(v.string()),
    quantity: v.optional(v.number()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    productionLine: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.optional(v.number())),
    completedQuantity: v.optional(v.number()),
    defectRate: v.optional(v.number()),
    channel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a productionOrder (only if owned by user)
export const deleteProductionOrder = mutation({
  args: { id: v.id("productionOrders") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new deliverie
export const createDeliverie = mutation({
  args: {
    trackingCode: v.string(),
    orderNumber: v.string(),
    customerName: v.string(),
    destination: v.string(),
    carrier: v.string(),
    status: v.string(),
    channel: v.string(),
    estimatedDelivery: v.number(),
    actualDelivery: v.optional(v.number()),
    weight: v.optional(v.number()),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("deliveries", {
      userId: user._id,
      trackingCode: args.trackingCode,
      orderNumber: args.orderNumber,
      customerName: args.customerName,
      destination: args.destination,
      carrier: args.carrier,
      status: args.status,
      channel: args.channel,
      estimatedDelivery: args.estimatedDelivery,
      actualDelivery: args.actualDelivery,
      weight: args.weight,
      cost: args.cost,
    });
  },
});

// Update a deliverie (only if owned by user)
export const updateDeliverie = mutation({
  args: {
    id: v.id("deliveries"),
    trackingCode: v.optional(v.string()),
    orderNumber: v.optional(v.string()),
    customerName: v.optional(v.string()),
    destination: v.optional(v.string()),
    carrier: v.optional(v.string()),
    status: v.optional(v.string()),
    channel: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.optional(v.number())),
    weight: v.optional(v.optional(v.number())),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a deliverie (only if owned by user)
export const deleteDeliverie = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new supportTicket
export const createSupportTicket = mutation({
  args: {
    ticketNumber: v.string(),
    customerName: v.string(),
    subject: v.string(),
    category: v.string(),
    priority: v.string(),
    status: v.string(),
    channel: v.string(),
    assignedTo: v.optional(v.string()),
    slaDeadline: v.number(),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("supportTickets", {
      userId: user._id,
      ticketNumber: args.ticketNumber,
      customerName: args.customerName,
      subject: args.subject,
      category: args.category,
      priority: args.priority,
      status: args.status,
      channel: args.channel,
      assignedTo: args.assignedTo,
      slaDeadline: args.slaDeadline,
      resolution: args.resolution,
    });
  },
});

// Update a supportTicket (only if owned by user)
export const updateSupportTicket = mutation({
  args: {
    id: v.id("supportTickets"),
    ticketNumber: v.optional(v.string()),
    customerName: v.optional(v.string()),
    subject: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    channel: v.optional(v.string()),
    assignedTo: v.optional(v.optional(v.string())),
    slaDeadline: v.optional(v.number()),
    resolution: v.optional(v.optional(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a supportTicket (only if owned by user)
export const deleteSupportTicket = mutation({
  args: { id: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new forecast
export const createForecast = mutation({
  args: {
    period: v.string(),
    channel: v.string(),
    productCategory: v.string(),
    predictedRevenue: v.number(),
    predictedUnits: v.number(),
    confidenceLower: v.number(),
    confidenceUpper: v.number(),
    actualRevenue: v.optional(v.number()),
    actualUnits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("forecasts", {
      userId: user._id,
      period: args.period,
      channel: args.channel,
      productCategory: args.productCategory,
      predictedRevenue: args.predictedRevenue,
      predictedUnits: args.predictedUnits,
      confidenceLower: args.confidenceLower,
      confidenceUpper: args.confidenceUpper,
      actualRevenue: args.actualRevenue,
      actualUnits: args.actualUnits,
    });
  },
});

// Update a forecast (only if owned by user)
export const updateForecast = mutation({
  args: {
    id: v.id("forecasts"),
    period: v.optional(v.string()),
    channel: v.optional(v.string()),
    productCategory: v.optional(v.string()),
    predictedRevenue: v.optional(v.number()),
    predictedUnits: v.optional(v.number()),
    confidenceLower: v.optional(v.number()),
    confidenceUpper: v.optional(v.number()),
    actualRevenue: v.optional(v.optional(v.number())),
    actualUnits: v.optional(v.optional(v.number())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a forecast (only if owned by user)
export const deleteForecast = mutation({
  args: { id: v.id("forecasts") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new agentConversation
export const createAgentConversation = mutation({
  args: {
    title: v.string(),
    messages: v.string(),
    dashboardId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("agentConversations", {
      userId: user._id,
      title: args.title,
      messages: args.messages,
      dashboardId: args.dashboardId,
    });
  },
});

// Update a agentConversation (only if owned by user)
export const updateAgentConversation = mutation({
  args: {
    id: v.id("agentConversations"),
    title: v.optional(v.string()),
    messages: v.optional(v.string()),
    dashboardId: v.optional(v.optional(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a agentConversation (only if owned by user)
export const deleteAgentConversation = mutation({
  args: { id: v.id("agentConversations") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
