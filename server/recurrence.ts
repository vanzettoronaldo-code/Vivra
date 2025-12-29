import { getDb } from "./db";
import { timelineRecords, recurrenceAnalysis, alerts } from "../drizzle/schema";
import { eq, and, like } from "drizzle-orm";

/**
 * Analyze timeline records for recurring problems
 * Identifies keywords that appear frequently in problem records
 */
export async function analyzeRecurrence(assetId: number, companyId: number) {
  const db = await getDb();
  if (!db) return;

  // Get all problem records for this asset from the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const problemRecords = await db
    .select()
    .from(timelineRecords)
    .where(
      and(
        eq(timelineRecords.assetId, assetId),
        eq(timelineRecords.companyId, companyId),
        eq(timelineRecords.category, "problem")
      )
    );

  if (problemRecords.length === 0) return;

  // Extract keywords from problem titles and descriptions
  const keywords = new Map<string, number>();

  problemRecords.forEach((record) => {
    const text = `${record.title} ${record.description || ""}`.toLowerCase();
    // Simple keyword extraction - split by spaces and filter common words
    const words = text.split(/\s+/).filter((word) => word.length > 3);

    words.forEach((word) => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w]/g, "");
      if (cleanWord.length > 3) {
        keywords.set(cleanWord, (keywords.get(cleanWord) || 0) + 1);
      }
    });
  });

  // Find keywords that appear more than once
  const recurringKeywords = Array.from(keywords.entries())
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 keywords

  // Update or create recurrence analysis records
  for (const [keyword, count] of recurringKeywords) {
    const existing = await db
      .select()
      .from(recurrenceAnalysis)
      .where(
        and(
          eq(recurrenceAnalysis.assetId, assetId),
          eq(recurrenceAnalysis.companyId, companyId),
          like(recurrenceAnalysis.problemKeyword, keyword)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(recurrenceAnalysis)
        .set({
          occurrenceCount: count,
          lastOccurrenceDate: new Date(),
          frequency: getFrequency(count, problemRecords.length),
          updatedAt: new Date(),
        })
        .where(eq(recurrenceAnalysis.id, existing[0].id));

      // Create alert if threshold is reached
      if (count >= 3 && !existing[0].isAlertActive) {
        await db.insert(alerts).values({
          assetId,
          companyId,
          recurrenceAnalysisId: existing[0].id,
          title: `Problema recorrente detectado: "${keyword}"`,
          message: `Este problema ocorreu ${count} vezes nos últimos 6 meses`,
          severity: count >= 5 ? "high" : count >= 3 ? "medium" : "low",
        });

        // Mark alert as active
        await db
          .update(recurrenceAnalysis)
          .set({ isAlertActive: true })
          .where(eq(recurrenceAnalysis.id, existing[0].id));
      }
    } else {
      // Create new record
      await db.insert(recurrenceAnalysis).values({
        assetId,
        companyId,
        problemKeyword: keyword,
        occurrenceCount: count,
        lastOccurrenceDate: new Date(),
        frequency: getFrequency(count, problemRecords.length),
      });

      // Create alert for new recurring problem
      if (count >= 3) {
        await db.insert(alerts).values({
          assetId,
          companyId,
          title: `Problema recorrente detectado: "${keyword}"`,
          message: `Este problema ocorreu ${count} vezes nos últimos 6 meses`,
          severity: count >= 5 ? "high" : count >= 3 ? "medium" : "low",
        });
      }
    }
  }
}

/**
 * Calculate frequency label based on occurrence count
 */
function getFrequency(count: number, totalProblems: number): string {
  const percentage = (count / totalProblems) * 100;

  if (percentage > 50) return "Muito Frequente";
  if (percentage > 30) return "Frequente";
  if (percentage > 10) return "Ocasional";
  return "Raro";
}

/**
 * Trigger recurrence analysis for all assets in a company
 */
export async function triggerCompanyRecurrenceAnalysis(companyId: number) {
  const db = await getDb();
  if (!db) return;

  // Get all unique assets for this company
  const assets = await db
    .select()
    .from(timelineRecords)
    .where(eq(timelineRecords.companyId, companyId));

  // Get unique asset IDs
  const assetIds = new Set(assets.map((t) => t.assetId));

  // Analyze each asset
  assetIds.forEach((assetId) => {
    analyzeRecurrence(assetId, companyId).catch(console.error);
  })
}
