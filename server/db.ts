import { eq, and, desc, or, gte, lte, like, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, companies, assets, timelineRecords, attachments, recurrenceAnalysis, alerts } from "../drizzle/schema";
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
