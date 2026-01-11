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
  updateUserPreferences,
  getUserPreferences,
  getRecurrenceAnalysisByCompanyId,
  getCompanyTimelineStats,
  getServiceProvidersByCompany,
  getServiceProviderById,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  getServicesByCompany,
  getServicesByProvider,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getProvidersWithStats,
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

  /**
   * Storage procedures for S3 uploads
   */
  storage: router({
    /**
     * Get presigned URL for photo upload
     */
    getPhotoUploadUrl: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const fileKey = `companies/${ctx.user.companyId}/assets/${input.assetId}/photos/${Date.now()}-${input.fileName}`;
        return { fileKey, contentType: input.contentType };
      }),

    /**
     * Get presigned URL for audio upload
     */
    getAudioUploadUrl: protectedProcedure
      .input(z.object({
        assetId: z.number(),
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id || !ctx.user.companyId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const fileKey = `companies/${ctx.user.companyId}/assets/${input.assetId}/audio/${Date.now()}-${input.fileName}`;
        return { fileKey, contentType: input.contentType };
      }),
  }),

  /**
   * Intelligence procedures
   */
  intelligence: router({
    getRecurrentProblems: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.id || !ctx.user.companyId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await getRecurrenceAnalysisByCompanyId(ctx.user.companyId);
    }),
    getTimelineStats: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.id || !ctx.user.companyId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await getCompanyTimelineStats(ctx.user.companyId);
    }),
  }),

  /**
   * User preferences procedures
   */
  user: router({
    /**
     * Get current user's preferences
     */
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const preferences = await getUserPreferences(ctx.user.id);
      return preferences || {
        approvalPrefCriticalRecords: true,
        approvalPrefImportantDecisions: true,
        approvalPrefHighSeverity: true,
        approvalPrefAutoNotify: true,
        notifPrefNewRecords: true,
        notifPrefCriticalProblems: true,
        notifPrefWeeklySummary: true,
      };
    }),

    /**
     * Update user's preferences
     */
    updatePreferences: protectedProcedure
      .input(z.object({
        approvalPrefCriticalRecords: z.boolean().optional(),
        approvalPrefImportantDecisions: z.boolean().optional(),
        approvalPrefHighSeverity: z.boolean().optional(),
        approvalPrefAutoNotify: z.boolean().optional(),
        notifPrefNewRecords: z.boolean().optional(),
        notifPrefCriticalProblems: z.boolean().optional(),
        notifPrefWeeklySummary: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        await updateUserPreferences(ctx.user.id, input);
        return { success: true };
      }),
  }),

  /**
   * Service Providers procedures
   */
  serviceProvider: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.companyId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User must belong to a company" });
      return getProvidersWithStats(ctx.user.companyId);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getServiceProviderById(input.id);
      }),
    
    getServices: protectedProcedure
      .input(z.object({ providerId: z.number() }))
      .query(async ({ input }) => {
        return getServicesByProvider(input.providerId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.enum(["manutencao", "limpeza", "seguranca", "eletrica", "hidraulica", "climatizacao", "jardinagem", "outros"]),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.companyId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User must belong to a company" });
        return createServiceProvider({ ...input, companyId: ctx.user.companyId });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        type: z.enum(["manutencao", "limpeza", "seguranca", "eletrica", "hidraulica", "climatizacao", "jardinagem", "outros"]).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        isActive: z.boolean().optional(),
        rating: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateServiceProvider(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteServiceProvider(input.id);
      }),
  }),

/**
   * Services procedures
   */
  service: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.companyId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User must belong to a company" });
      return getServicesByCompany(ctx.user.companyId);
    }),
    
    listByProvider: protectedProcedure
      .input(z.object({ providerId: z.number() }))
      .query(async ({ input }) => {
        return getServicesByProvider(input.providerId);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getServiceById(input.id);
      }),
    
    // ROTA NOVA: Autenticação da OS
    authenticate: protectedProcedure
      .input(z.object({
        id: z.number(),
        signature: z.string().min(1, "Assinatura é obrigatória"), // Pode ser um hash, nome digitado ou token
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.companyId) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        // Chama a função nova do DB que atualiza a OS com os dados de quem autenticou
        // import { authenticateService } from "./db"; (Certifique-se de importar lá em cima)
        return authenticateService(input.id, ctx.user.id, input.signature);
      }),

    create: protectedProcedure
      .input(z.object({
        providerId: z.number(),
        assetId: z.number().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["pendente", "andamento", "aprovado", "rejeitado"]).optional(),
        priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
        scheduledDate: z.date().optional(),
        cost: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.companyId) throw new TRPCError({ code: "UNAUTHORIZED", message: "User must belong to a company" });
        return createService({ ...input, companyId: ctx.user.companyId });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(["pendente", "andamento", "aprovado", "rejeitado", "concluido"]).optional(),
        priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
        scheduledDate: z.date().optional(),
        completedDate: z.date().optional(),
        cost: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        feedback: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateService(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteService(input.id);
      }),
  }),
});
export type AppRouter = typeof appRouter;
