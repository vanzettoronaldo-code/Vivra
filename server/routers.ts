import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getCompanyByUserId,
  getCompanyById,
  createCompany,
  getAssetsByCompanyId,
  getAssetById,
  createAsset,
  getTimelineRecordsByAssetId,
  createTimelineRecord,
  getAttachmentsByRecordId,
  createAttachment,
  getRecurrenceAnalysisByAssetId,
  getAlertsByCompanyId,
  createAlert,
  upsertUser,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Company procedures
   */
  company: router({
    /**
     * Get or create user's company
     */
    getOrCreate: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

        let company = await getCompanyByUserId(ctx.user.id);

        if (!company && input.name) {
          await createCompany(input.name, input.description, ctx.user.id);
          company = await getCompanyByUserId(ctx.user.id);
        }

        if (!company) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
        }

        // Update user's companyId
        await upsertUser({
          openId: ctx.user.openId,
          companyId: company.id,
          userRole: "admin",
        });

        return company;
      }),

    /**
     * Get current user's company
     */
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
      }

      return company;
    }),
  }),

  /**
   * Asset procedures
   */
  asset: router({
    /**
     * List all assets for current company
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.id || !ctx.user.companyId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await getAssetsByCompanyId(ctx.user.companyId);
    }),

    /**
     * Get single asset by ID
     */
    getById: protectedProcedure
      .input(z.object({ assetId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const asset = await getAssetById(input.assetId, ctx.user.companyId);
        if (!asset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Asset not found" });
        }

        return asset;
      }),

    /**
     * Create new asset
     */
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        location: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Only admin can create assets
        if (ctx.user.userRole !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create assets" });
        }

        const result = await createAsset(
          ctx.user.companyId,
          input.name,
          input.type,
          input.location,
          input.description
        );

        return result;
      }),
  }),

  /**
   * Timeline record procedures
   */
  timeline: router({
    /**
     * Get timeline records for an asset
     */
    getByAsset: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Verify asset belongs to user's company
        const asset = await getAssetById(input.assetId, ctx.user.companyId);
        if (!asset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Asset not found" });
        }

        const records = await getTimelineRecordsByAssetId(
          input.assetId,
          ctx.user.companyId,
          input.limit,
          input.offset
        );

        return records;
      }),

    /**
     * Create timeline record
     */
    create: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.enum(["problem", "maintenance", "decision", "inspection"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Only admin and collaborator can create records
        if (ctx.user.userRole === "viewer") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Viewers cannot create records" });
        }

        // Verify asset belongs to user's company
        const asset = await getAssetById(input.assetId, ctx.user.companyId);
        if (!asset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Asset not found" });
        }

        const result = await createTimelineRecord(
          input.assetId,
          ctx.user.companyId,
          input.title,
          input.description,
          input.category,
          ctx.user.id,
          new Date()
        );

        return result;
      }),
  }),

  /**
   * Attachment procedures
   */
  attachment: router({
    /**
     * Get attachments for a record
     */
    getByRecord: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getAttachmentsByRecordId(input.recordId);
      }),

    /**
     * Create attachment (called after file upload to S3)
     */
    create: protectedProcedure
      .input(z.object({
        recordId: z.number(),
        fileKey: z.string(),
        url: z.string(),
        mimeType: z.string(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        attachmentType: z.enum(["photo", "audio"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const result = await createAttachment(
          input.recordId,
          ctx.user.companyId,
          input.fileKey,
          input.url,
          input.mimeType,
          input.fileName,
          input.fileSize,
          input.attachmentType
        );

        return result;
      }),
  }),

  /**
   * Alert procedures
   */
  alert: router({
    /**
     * Get alerts for current company
     */
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().default(false) }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getAlertsByCompanyId(ctx.user.companyId, input.unreadOnly);
      }),
  }),

  /**
   * Recurrence analysis procedures
   */
  recurrence: router({
    /**
     * Get recurrence analysis for an asset
     */
    getByAsset: protectedProcedure
      .input(z.object({ assetId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Verify asset belongs to user's company
        const asset = await getAssetById(input.assetId, ctx.user.companyId);
        if (!asset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Asset not found" });
        }

        return await getRecurrenceAnalysisByAssetId(input.assetId, ctx.user.companyId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
