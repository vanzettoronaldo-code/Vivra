import { getDb } from "./db";
import { timelineRecords } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { transcribeAudio } from "./_core/voiceTranscription";

/**
 * Transcribe audio file and update timeline record with transcription
 */
export async function transcribeAndUpdateRecord(
  recordId: number,
  audioUrl: string,
  language?: string
) {
  try {
    // Transcribe audio using Whisper API
    const result = await transcribeAudio({
      audioUrl,
      language,
      prompt: "Technical maintenance and infrastructure notes",
    });

    // Update timeline record with transcription
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const transcription = (result as any).text || "";
    await db
      .update(timelineRecords)
      .set({
        transcription,
        updatedAt: new Date(),
      })
      .where(eq(timelineRecords.id, recordId));

    return result;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}

/**
 * Process audio attachment and transcribe
 */
export async function processAudioAttachment(
  recordId: number,
  audioUrl: string
) {
  try {
    // Detect language from audio if possible
    const result = await transcribeAudio({
      audioUrl,
      prompt: "Registro técnico de manutenção e infraestrutura",
    });

    // Update record with transcription
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const transcription = (result as any).text || "";
    await db
      .update(timelineRecords)
      .set({
        transcription,
        updatedAt: new Date(),
      })
      .where(eq(timelineRecords.id, recordId));

    return {
      success: true,
      transcription,
      language: (result as any).language || "pt",
    };
  } catch (error) {
    console.error("Audio processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
