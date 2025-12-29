import { getDb } from "./db";
import { timelineRecords, assets, recurrenceAnalysis } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
// PDF generation will be handled by manus-md-to-pdf utility

/**
 * Generate PDF report for an asset's timeline
 */
export async function generateAssetReport(assetId: number, companyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get asset info
  const assetData = await db
    .select()
    .from(assets)
    .where(and(eq(assets.id, assetId), eq(assets.companyId, companyId)))
    .limit(1);

  if (!assetData.length) {
    throw new Error("Asset not found");
  }

  const asset = assetData[0];

  // Get timeline records
  const records = await db
    .select()
    .from(timelineRecords)
    .where(
      and(
        eq(timelineRecords.assetId, assetId),
        eq(timelineRecords.companyId, companyId)
      )
    )
    .orderBy(timelineRecords.recordedAt);

  // Get recurrence analysis
  const recurrenceData = await db
    .select()
    .from(recurrenceAnalysis)
    .where(
      and(
        eq(recurrenceAnalysis.assetId, assetId),
        eq(recurrenceAnalysis.companyId, companyId)
      )
    );

  // Calculate statistics
  const stats = {
    totalRecords: records.length,
    problems: records.filter((r) => r.category === "problem").length,
    maintenance: records.filter((r) => r.category === "maintenance").length,
    decisions: records.filter((r) => r.category === "decision").length,
    inspections: records.filter((r) => r.category === "inspection").length,
    recurringProblems: recurrenceData.length,
  };

  return {
    asset,
    records,
    recurrence: recurrenceData,
    stats,
  };
}

/**
 * Format data for PDF export
 */
export async function formatReportData(assetId: number, companyId: number) {
  const reportData = await generateAssetReport(assetId, companyId);

  return {
    title: `Relatório de Memória Técnica - ${reportData.asset.name}`,
    assetName: reportData.asset.name,
    assetType: reportData.asset.type,
    assetLocation: reportData.asset.location,
    assetDescription: reportData.asset.description,
    generatedAt: new Date().toLocaleDateString("pt-BR"),
    stats: reportData.stats,
    records: reportData.records.map((r) => ({
      date: new Date(r.recordedAt).toLocaleDateString("pt-BR"),
      time: new Date(r.recordedAt).toLocaleTimeString("pt-BR"),
      title: r.title,
      description: r.description,
      category: r.category,
      transcription: r.transcription,
    })),
    recurrence: reportData.recurrence.map((r) => ({
      keyword: r.problemKeyword,
      count: r.occurrenceCount,
      frequency: r.frequency,
    })),
  };
}

/**
 * Calculate category distribution for charts
 */
export function calculateCategoryDistribution(stats: any) {
  const total = stats.totalRecords;
  return {
    problems: Math.round((stats.problems / total) * 100),
    maintenance: Math.round((stats.maintenance / total) * 100),
    decisions: Math.round((stats.decisions / total) * 100),
    inspections: Math.round((stats.inspections / total) * 100),
  };
}

/**
 * Generate summary statistics
 */
export function generateSummaryStats(records: any[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const last30Days = records.filter(
    (r) => new Date(r.recordedAt) > thirtyDaysAgo
  ).length;
  const last90Days = records.filter(
    (r) => new Date(r.recordedAt) > ninetyDaysAgo
  ).length;

  return {
    total: records.length,
    last30Days,
    last90Days,
    averagePerMonth: Math.round(records.length / 6), // Assuming 6 months of data
  };
}
