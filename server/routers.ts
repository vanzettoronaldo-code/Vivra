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
  getTimelineRecordsByCategory,
  getTimelineRecordsByDateRange,
  getTimelineRecordsByAuthor,
  getTimelineRecordStats,
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

        if (!company) {
          const companyName = input.name || `${ctx.user.name || 'User'}'s Assets`;
          await createCompany(companyName, input.description, ctx.user.id);
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
      if (!ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Auto-create company if user doesn't have one
      let companyId = ctx.user.companyId;
      if (!companyId) {
        let company = await getCompanyByUserId(ctx.user.id);
        if (!company) {
          const companyName = `${ctx.user.name || 'User'}'s Assets`;
          await createCompany(companyName, undefined, ctx.user.id);
          company = await getCompanyByUserId(ctx.user.id);
          if (!company) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          }
        }
        companyId = company.id;
        await upsertUser({
          openId: ctx.user.openId,
          companyId,
          userRole: "admin",
        });
      }
      return await getAssetsByCompanyId(companyId);
    }),

    /**
     * Get single asset
     */
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const asset = await getAssetById(input.id, ctx.user.companyId);
        if (!asset) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return asset;
      }),

    /**
     * Create new asset
     */
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.string(),
        location: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Check if user is admin
        if (ctx.user.userRole !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return await createAsset(
          ctx.user.companyId,
          input.name,
          input.type,
          input.location,
          input.description
        );
      }),
  }),

  /**
   * Timeline procedures
   */
  timeline: router({
    /**
     * Get timeline records for an asset
     */
    list: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getTimelineRecordsByAssetId(
          input.assetId,
          ctx.user.companyId,
          input.limit,
          input.offset
        );
      }),

    /**
     * Get timeline records filtered by category
     */
    listByCategory: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        category: z.enum(["problem", "maintenance", "decision", "inspection"]),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getTimelineRecordsByCategory(
          input.assetId,
          ctx.user.companyId,
          input.category,
          input.limit,
          input.offset
        );
      }),

    /**
     * Get timeline records filtered by date range
     */
    listByDateRange: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getTimelineRecordsByDateRange(
          input.assetId,
          ctx.user.companyId,
          input.startDate,
          input.endDate,
          input.limit,
          input.offset
        );
      }),

    /**
     * Get timeline statistics for an asset
     */
    getStats: protectedProcedure
      .input(z.object({
        assetId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getTimelineRecordStats(input.assetId, ctx.user.companyId);
      }),

    /**
     * Create timeline record
     */
    create: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(["problem", "maintenance", "decision", "inspection"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Check if user can create records
        if (!["admin", "collaborator"].includes(ctx.user.userRole || "")) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return await createTimelineRecord(
          input.assetId,
          ctx.user.companyId,
          input.title,
          input.description,
          input.category,
          ctx.user.id,
          new Date()
        );
      }),
  }),

  /**
   * Alert procedures
   */
  alert: router({
    /**
     * List alerts for current company
     */
    list: protectedProcedure
      .input(z.object({
        unreadOnly: z.boolean().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return await getAlertsByCompanyId(ctx.user.companyId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
