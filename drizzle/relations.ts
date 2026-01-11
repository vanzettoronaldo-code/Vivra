import { relations } from "drizzle-orm";
import {
  users,
  companies,
  assets,
  timelineRecords,
  attachments,
  recurrenceAnalysis,
  alerts,
  approvalWorkflows,
  approvalRequests,
  auditLogs,
  emailNotifications,
  serviceProviders,
  services,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  timelineRecords: many(timelineRecords),
  approvalRequests: many(approvalRequests, { relationName: "requester" }),
  approvedRequests: many(approvalRequests, { relationName: "approver" }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerUserId],
    references: [users.id],
  }),
  users: many(users),
  assets: many(assets),
  serviceProviders: many(serviceProviders),
  services: many(services),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  company: one(companies, {
    fields: [assets.companyId],
    references: [companies.id],
  }),
  timelineRecords: many(timelineRecords),
  services: many(services),
  recurrenceAnalysis: many(recurrenceAnalysis),
  alerts: many(alerts),
}));

export const timelineRecordsRelations = relations(timelineRecords, ({ one, many }) => ({
  asset: one(assets, {
    fields: [timelineRecords.assetId],
    references: [assets.id],
  }),
  author: one(users, {
    fields: [timelineRecords.authorId],
    references: [users.id],
  }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  record: one(timelineRecords, {
    fields: [attachments.recordId],
    references: [timelineRecords.id],
  }),
}));

export const recurrenceAnalysisRelations = relations(recurrenceAnalysis, ({ one, many }) => ({
  asset: one(assets, {
    fields: [recurrenceAnalysis.assetId],
    references: [assets.id],
  }),
  alerts: many(alerts),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  asset: one(assets, {
    fields: [alerts.assetId],
    references: [assets.id],
  }),
  recurrenceAnalysis: one(recurrenceAnalysis, {
    fields: [alerts.recurrenceAnalysisId],
    references: [recurrenceAnalysis.id],
  }),
}));

export const approvalWorkflowsRelations = relations(approvalWorkflows, ({ one }) => ({
  company: one(companies, {
    fields: [approvalWorkflows.companyId],
    references: [companies.id],
  }),
}));

export const approvalRequestsRelations = relations(approvalRequests, ({ one, many }) => ({
  workflow: one(approvalWorkflows, {
    fields: [approvalRequests.workflowId],
    references: [approvalWorkflows.id],
  }),
  requestedBy: one(users, {
    fields: [approvalRequests.requestedBy],
    references: [users.id],
    relationName: "requester",
  }),
  approvedBy: one(users, {
    fields: [approvalRequests.approvedBy],
    references: [users.id],
    relationName: "approver",
  }),
  emailNotifications: many(emailNotifications),
}));

export const emailNotificationsRelations = relations(emailNotifications, ({ one }) => ({
  approvalRequest: one(approvalRequests, {
    fields: [emailNotifications.approvalRequestId],
    references: [approvalRequests.id],
  }),
  recipient: one(users, {
    fields: [emailNotifications.recipientUserId],
    references: [users.id],
  }),
}));

// Relações para Prestadores e Serviços (Novas)
export const serviceProvidersRelations = relations(serviceProviders, ({ one, many }) => ({
  company: one(companies, {
    fields: [serviceProviders.companyId],
    references: [companies.id],
  }),
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  company: one(companies, {
    fields: [services.companyId],
    references: [companies.id],
  }),
  provider: one(serviceProviders, {
    fields: [services.providerId],
    references: [serviceProviders.id],
  }),
  asset: one(assets, {
    fields: [services.assetId],
    references: [assets.id],
  }),
  // Relação opcional com quem autenticou a OS
  authenticatedByUser: one(users, {
    fields: [services.authenticatedBy],
    references: [users.id],
  }),
}));
