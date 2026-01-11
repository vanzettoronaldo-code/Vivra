import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, unique } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with company relationship for multi-tenant support.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  companyId: int("companyId"),
  userRole: mysqlEnum("userRole", ["admin", "collaborator", "viewer"]).default("collaborator").notNull(),
  // Approval preferences
  approvalPrefCriticalRecords: boolean("approvalPrefCriticalRecords").default(true).notNull(),
  approvalPrefImportantDecisions: boolean("approvalPrefImportantDecisions").default(true).notNull(),
  approvalPrefHighSeverity: boolean("approvalPrefHighSeverity").default(true).notNull(),
  approvalPrefAutoNotify: boolean("approvalPrefAutoNotify").default(true).notNull(),
  // Notification preferences
  notifPrefNewRecords: boolean("notifPrefNewRecords").default(true).notNull(),
  notifPrefCriticalProblems: boolean("notifPrefCriticalProblems").default(true).notNull(),
  notifPrefWeeklySummary: boolean("notifPrefWeeklySummary").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies table for multi-tenant isolation
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerUserId: int("ownerUserId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Assets table - physical assets managed by companies
 */
export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Timeline records - technical history entries for each asset
 */
export const timelineRecords = mysqlTable("timeline_records", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  companyId: int("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["problem", "maintenance", "decision", "inspection"]).notNull(),
  authorId: int("authorId").notNull(),
  transcription: text("transcription"),
  recordedAt: timestamp("recordedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimelineRecord = typeof timelineRecords.$inferSelect;
export type InsertTimelineRecord = typeof timelineRecords.$inferInsert;

/**
 * Attachments - media files (photos, audio) for timeline records
 */
export const attachments = mysqlTable("attachments", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  companyId: int("companyId").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  attachmentType: mysqlEnum("attachmentType", ["photo", "audio"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = typeof attachments.$inferInsert;

/**
 * Recurrence analysis - identifies recurring problems
 */
export const recurrenceAnalysis = mysqlTable("recurrence_analysis", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  companyId: int("companyId").notNull(),
  problemKeyword: varchar("problemKeyword", { length: 255 }).notNull(),
  occurrenceCount: int("occurrenceCount").default(0).notNull(),
  lastOccurrenceDate: timestamp("lastOccurrenceDate"),
  frequency: varchar("frequency", { length: 50 }),
  isAlertActive: boolean("isAlertActive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecurrenceAnalysis = typeof recurrenceAnalysis.$inferSelect;
export type InsertRecurrenceAnalysis = typeof recurrenceAnalysis.$inferInsert;

/**
 * Alerts - notifications for recurring problems
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  companyId: int("companyId").notNull(),
  recurrenceAnalysisId: int("recurrenceAnalysisId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  severity: mysqlEnum("severity", ["low", "medium", "high"]).default("medium").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Approval workflows - configure which record types require approval
 */
export const approvalWorkflows = mysqlTable("approval_workflows", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  recordCategory: mysqlEnum("recordCategory", ["problem", "maintenance", "decision", "inspection"]).notNull(),
  requiresApproval: boolean("requiresApproval").default(true).notNull(),
  approverUserIds: text("approverUserIds").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApprovalWorkflow = typeof approvalWorkflows.$inferSelect;
export type InsertApprovalWorkflow = typeof approvalWorkflows.$inferInsert;

/**
 * Approval requests - track approval status of records
 */
export const approvalRequests = mysqlTable("approval_requests", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  companyId: int("companyId").notNull(),
  workflowId: int("workflowId").notNull(),
  requestedBy: int("requestedBy").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  approvedBy: int("approvedBy"),
  approvalJustification: text("approvalJustification"),
  rejectionReason: text("rejectionReason"),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApprovalRequest = typeof approvalRequests.$inferSelect;
export type InsertApprovalRequest = typeof approvalRequests.$inferInsert;

/**
 * Audit logs - track all critical actions for compliance and traceability
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId").notNull(),
  changes: text("changes"),
  description: text("description"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Email notifications - track email notifications sent to approvers
 */
export const emailNotifications = mysqlTable("email_notifications", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  recipientUserId: int("recipientUserId").notNull(),
  approvalRequestId: int("approvalRequestId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  failureReason: text("failureReason"),
  retryCount: int("retryCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

/**
 * Service Providers - Prestadores de serviços
 */
export const serviceProviders = mysqlTable("service_providers", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["manutencao", "limpeza", "seguranca", "eletrica", "hidraulica", "climatizacao", "jardinagem", "outros"]).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  document: varchar("document", { length: 20 }), // CNPJ ou CPF
  address: text("address"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"), // Ranking geral do prestador
  totalServices: int("totalServices").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = typeof serviceProviders.$inferInsert;

/**
 * Services - Serviços prestados (Ordens de Serviço)
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  providerId: int("providerId").notNull(), // Link para o Prestador
  assetId: int("assetId"), // Link para o Ativo (para ranking por ativo)
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pendente", "andamento", "aprovado", "rejeitado", "concluido"]).default("pendente").notNull(),
  priority: mysqlEnum("priority", ["baixa", "media", "alta", "urgente"]).default("media").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  completedDate: timestamp("completedDate"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  
  // Avaliação do Serviço (usado para o ranking)
  rating: int("rating"), // 1-5 estrelas
  feedback: text("feedback"),
  
  // Autenticação da Execução (Novos campos)
  isAuthenticated: boolean("isAuthenticated").default(false).notNull(), // Flag de autenticação
  authenticatedAt: timestamp("authenticatedAt"), // Quando foi autenticado
  authenticatedBy: int("authenticatedBy"), // ID do usuário que assinou/autenticou
  authenticationSignature: varchar("authenticationSignature", { length: 512 }), // Assinatura digital ou hash
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
