import { eq, and, desc, or, gte, lte, like, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, companies, assets, timelineRecords, attachments, recurrenceAnalysis, alerts, auditLogs, emailNotifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.companyId !== undefined) {
      values.companyId = user.companyId;
      updateSet.companyId = user.companyId;
    }

    if (user.userRole !== undefined) {
      values.userRole = user.userRole;
      updateSet.userRole = user.userRole;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Company queries
 */
export async function getCompanyByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.ownerUserId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCompany(name: string, description: string | undefined, ownerUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(companies).values({ name, description, ownerUserId });
  return result;
}

/**
 * Asset queries
 */
export async function getAssetsByCompanyId(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assets).where(eq(assets.companyId, companyId));
}

export async function getAssetById(assetId: number, companyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assets).where(
    and(eq(assets.id, assetId), eq(assets.companyId, companyId))
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAsset(companyId: number, name: string, type: string, location: string | undefined, description: string | undefined) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(assets).values({ companyId, name, type, location, description });
  return result;
}

/**
 * Timeline record queries
 */
export async function getTimelineRecordsByAssetId(assetId: number, companyId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(timelineRecords)
    .where(and(eq(timelineRecords.assetId, assetId), eq(timelineRecords.companyId, companyId)))
    .orderBy(desc(timelineRecords.recordedAt))
    .limit(limit)
    .offset(offset);
}

export async function createTimelineRecord(
  assetId: number,
  companyId: number,
  title: string,
  description: string | undefined,
  category: "problem" | "maintenance" | "decision" | "inspection",
  authorId: number,
  recordedAt: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(timelineRecords).values({
    assetId,
    companyId,
    title,
    description,
    category,
    authorId,
    recordedAt,
  });
  return result;
}

/**
 * Attachment queries
 */
export async function getAttachmentsByRecordId(recordId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(attachments).where(eq(attachments.recordId, recordId));
}

export async function createAttachment(
  recordId: number,
  companyId: number,
  fileKey: string,
  url: string,
  mimeType: string,
  fileName: string | undefined,
  fileSize: number | undefined,
  attachmentType: "photo" | "audio"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(attachments).values({
    recordId,
    companyId,
    fileKey,
    url,
    mimeType,
    fileName,
    fileSize,
    attachmentType,
  });
  return result;
}

/**
 * Recurrence analysis queries
 */
export async function getRecurrenceAnalysisByAssetId(assetId: number, companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recurrenceAnalysis)
    .where(and(eq(recurrenceAnalysis.assetId, assetId), eq(recurrenceAnalysis.companyId, companyId)));
}

/**
 * Alert queries
 */
export async function getAlertsByCompanyId(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(alerts).where(eq(alerts.companyId, companyId));
}

export async function createAlert(
  companyId: number,
  assetId: number,
  title: string,
  message: string | undefined,
  severity: "low" | "medium" | "high"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(alerts).values({
    companyId,
    assetId,
    title,
    message,
    severity,
  });
  return result;
}

// TODO: add feature queries here as your schema grows.

/**
 * Advanced search and filter queries
 */
export async function getTimelineRecordsByCategory(
  assetId: number,
  companyId: number,
  category: "problem" | "maintenance" | "decision" | "inspection",
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(timelineRecords)
    .where(and(
      eq(timelineRecords.assetId, assetId),
      eq(timelineRecords.companyId, companyId),
      eq(timelineRecords.category, category)
    ))
    .orderBy(desc(timelineRecords.recordedAt))
    .limit(limit)
    .offset(offset);
}

export async function getTimelineRecordsByDateRange(
  assetId: number,
  companyId: number,
  startDate: Date,
  endDate: Date,
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(timelineRecords)
    .where(and(
      eq(timelineRecords.assetId, assetId),
      eq(timelineRecords.companyId, companyId),
      gte(timelineRecords.recordedAt, startDate),
      lte(timelineRecords.recordedAt, endDate)
    ))
    .orderBy(desc(timelineRecords.recordedAt))
    .limit(limit)
    .offset(offset);
}

export async function getTimelineRecordsByAuthor(
  assetId: number,
  companyId: number,
  authorId: number,
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(timelineRecords)
    .where(and(
      eq(timelineRecords.assetId, assetId),
      eq(timelineRecords.companyId, companyId),
      eq(timelineRecords.authorId, authorId)
    ))
    .orderBy(desc(timelineRecords.recordedAt))
    .limit(limit)
    .offset(offset);
}

export async function getTimelineRecordStats(
  assetId: number,
  companyId: number
) {
  const db = await getDb();
  if (!db) return null;
  
  const allRecords = await db.select().from(timelineRecords)
    .where(and(
      eq(timelineRecords.assetId, assetId),
      eq(timelineRecords.companyId, companyId)
    ));

  if (allRecords.length === 0) return null;

  const stats = {
    totalRecords: allRecords.length,
    problemCount: allRecords.filter(r => r.category === "problem").length,
    maintenanceCount: allRecords.filter(r => r.category === "maintenance").length,
    decisionCount: allRecords.filter(r => r.category === "decision").length,
    inspectionCount: allRecords.filter(r => r.category === "inspection").length,
  };

  return stats;
}


// Approval workflow helpers
export async function createApprovalWorkflow(workflow: {
  companyId: number;
  name: string;
  description?: string;
  recordCategory: "problem" | "maintenance" | "decision" | "inspection";
  requiresApproval: boolean;
  approverUserIds: number[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalWorkflows } = await import("../drizzle/schema");
  
  const result = await db.insert(approvalWorkflows).values({
    ...workflow,
    approverUserIds: JSON.stringify(workflow.approverUserIds),
  });
  
  return result;
}

export async function getApprovalWorkflows(companyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalWorkflows } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const workflows = await db
    .select()
    .from(approvalWorkflows)
    .where(eq(approvalWorkflows.companyId, companyId));
  
  return workflows.map(w => ({
    ...w,
    approverUserIds: typeof w.approverUserIds === "string" ? JSON.parse(w.approverUserIds) : w.approverUserIds,
  }));
}

export async function createApprovalRequest(request: {
  recordId: number;
  companyId: number;
  workflowId: number;
  requestedBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalRequests } = await import("../drizzle/schema");
  
  const result = await db.insert(approvalRequests).values({
    ...request,
    status: "pending",
  });
  
  return result;
}

export async function getPendingApprovals(companyId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalRequests, approvalWorkflows } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  const requests = await db
    .select()
    .from(approvalRequests)
    .where(
      and(
        eq(approvalRequests.companyId, companyId),
        eq(approvalRequests.status, "pending")
      )
    );
  
  return requests.filter(req => {
    const workflow = approvalWorkflows;
    return true;
  });
}

export async function approveRecord(approvalRequestId: number, userId: number, justification: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalRequests } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db
    .update(approvalRequests)
    .set({
      status: "approved",
      approvedBy: userId,
      approvalJustification: justification,
      respondedAt: new Date(),
    })
    .where(eq(approvalRequests.id, approvalRequestId));
  
  return result;
}

export async function rejectRecord(approvalRequestId: number, userId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { approvalRequests } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db
    .update(approvalRequests)
    .set({
      status: "rejected",
      approvedBy: userId,
      rejectionReason: reason,
      respondedAt: new Date(),
    })
    .where(eq(approvalRequests.id, approvalRequestId));
  
  return result;
}


// Audit logging helpers
export async function logAuditAction(
  companyId: number,
  userId: number,
  action: string,
  entityType: string,
  entityId: number,
  changes?: string,
  description?: string,
  ipAddress?: string,
  userAgent?: string
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(auditLogs).values({
      companyId,
      userId,
      action,
      entityType,
      entityId,
      changes,
      description,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("[Database] Failed to log audit action:", error);
  }
}

export async function getAuditLogs(
  companyId: number,
  filters?: {
    userId?: number;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }
) {
  const db = await getDb();
  if (!db) return [];

  try {
    const conditions = [eq(auditLogs.companyId, companyId)];

    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }
    if (filters?.entityType) {
      conditions.push(eq(auditLogs.entityType, filters.entityType));
    }

    const results = await db
      .select()
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt));

    let filtered = results;
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    if (filters?.offset) {
      filtered = filtered.slice(filters.offset);
    }

    return filtered;
  } catch (error) {
    console.error("[Database] Failed to get audit logs:", error);
    return [];
  }
}

// Email notification helpers
export async function createEmailNotification(
  companyId: number,
  recipientUserId: number,
  approvalRequestId: number,
  subject: string,
  body: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(emailNotifications).values({
      companyId,
      recipientUserId,
      approvalRequestId,
      subject,
      body,
      status: "pending",
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create email notification:", error);
    return null;
  }
}

export async function getPendingEmailNotifications(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(emailNotifications)
      .where(eq(emailNotifications.status, "pending"))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get pending email notifications:", error);
    return [];
  }
}

export async function markEmailAsSent(notificationId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(emailNotifications)
      .set({
        status: "sent",
        sentAt: new Date(),
      })
      .where(eq(emailNotifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark email as sent:", error);
    return false;
  }
}

export async function markEmailAsFailed(notificationId: number, reason: string) {
  const db = await getDb();
  if (!db) return false;

  try {
    const notification = await db
      .select()
      .from(emailNotifications)
      .where(eq(emailNotifications.id, notificationId))
      .limit(1);

    if (!notification.length) return false;

    const retryCount = (notification[0].retryCount || 0) + 1;
    const status = retryCount >= 3 ? "failed" : "pending";

    await db
      .update(emailNotifications)
      .set({
        status,
        failureReason: reason,
        retryCount,
      })
      .where(eq(emailNotifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark email as failed:", error);
    return false;
  }
}


/**
 * User preferences
 */
export async function updateUserPreferences(userId: number, preferences: {
  approvalPrefCriticalRecords?: boolean;
  approvalPrefImportantDecisions?: boolean;
  approvalPrefHighSeverity?: boolean;
  approvalPrefAutoNotify?: boolean;
  notifPrefNewRecords?: boolean;
  notifPrefCriticalProblems?: boolean;
  notifPrefWeeklySummary?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {};
  
  if (preferences.approvalPrefCriticalRecords !== undefined) {
    updateData.approvalPrefCriticalRecords = preferences.approvalPrefCriticalRecords;
  }
  if (preferences.approvalPrefImportantDecisions !== undefined) {
    updateData.approvalPrefImportantDecisions = preferences.approvalPrefImportantDecisions;
  }
  if (preferences.approvalPrefHighSeverity !== undefined) {
    updateData.approvalPrefHighSeverity = preferences.approvalPrefHighSeverity;
  }
  if (preferences.approvalPrefAutoNotify !== undefined) {
    updateData.approvalPrefAutoNotify = preferences.approvalPrefAutoNotify;
  }
  if (preferences.notifPrefNewRecords !== undefined) {
    updateData.notifPrefNewRecords = preferences.notifPrefNewRecords;
  }
  if (preferences.notifPrefCriticalProblems !== undefined) {
    updateData.notifPrefCriticalProblems = preferences.notifPrefCriticalProblems;
  }
  if (preferences.notifPrefWeeklySummary !== undefined) {
    updateData.notifPrefWeeklySummary = preferences.notifPrefWeeklySummary;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
}

export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select({
    approvalPrefCriticalRecords: users.approvalPrefCriticalRecords,
    approvalPrefImportantDecisions: users.approvalPrefImportantDecisions,
    approvalPrefHighSeverity: users.approvalPrefHighSeverity,
    approvalPrefAutoNotify: users.approvalPrefAutoNotify,
    notifPrefNewRecords: users.notifPrefNewRecords,
    notifPrefCriticalProblems: users.notifPrefCriticalProblems,
    notifPrefWeeklySummary: users.notifPrefWeeklySummary,
  }).from(users).where(eq(users.id, userId)).limit(1);

  return result.length > 0 ? result[0] : null;
}
