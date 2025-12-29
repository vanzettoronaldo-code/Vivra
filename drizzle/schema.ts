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
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  companyId: int("companyId"),
  userRole: mysqlEnum("userRole", ["admin", "collaborator", "viewer"]).default("collaborator").notNull(),
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