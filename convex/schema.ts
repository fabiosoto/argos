import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Better Auth tables (user, session, account, verification) are managed
  // automatically by the @convex-dev/better-auth component.

  // Application tables
  savedDashboards: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    widgets: v.string(),
    query: v.string(),
    createdBy: v.optional(v.string()),
    isShared: v.boolean(),
    lastViewed: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_isShared", ["isShared"]),

  suppliers: defineTable({
    userId: v.string(),
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
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_rating", ["rating"]),

  purchaseOrders: defineTable({
    userId: v.string(),
    supplierId: v.id("suppliers"),
    orderNumber: v.string(),
    status: v.string(),
    totalAmount: v.number(),
    items: v.string(),
    expectedDelivery: v.number(),
    actualDelivery: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_supplierId", ["supplierId"]),

  productionOrders: defineTable({
    userId: v.string(),
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
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_productionLine", ["productionLine"])
    .index("by_channel", ["channel"]),

  deliveries: defineTable({
    userId: v.string(),
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
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_carrier", ["carrier"])
    .index("by_channel", ["channel"]),

  supportTickets: defineTable({
    userId: v.string(),
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
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"])
    .index("by_channel", ["channel"]),

  forecasts: defineTable({
    userId: v.string(),
    period: v.string(),
    channel: v.string(),
    productCategory: v.string(),
    predictedRevenue: v.number(),
    predictedUnits: v.number(),
    confidenceLower: v.number(),
    confidenceUpper: v.number(),
    actualRevenue: v.optional(v.number()),
    actualUnits: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_period", ["period"])
    .index("by_channel", ["channel"])
    .index("by_productCategory", ["productCategory"]),

  agentConversations: defineTable({
    userId: v.string(),
    title: v.string(),
    messages: v.string(),
    dashboardId: v.optional(v.string()),
  })
    .index("by_user", ["userId"]),
});
