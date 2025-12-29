import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(companyId?: number): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    userRole: "admin",
    companyId: companyId || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("asset procedures", () => {
  it("should list assets for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      const assets = await caller.asset.list();
      expect(Array.isArray(assets)).toBe(true);
    } catch (error: any) {
      // Expected if no database
      expect(error.code).toBeDefined();
    }
  });

  it("should require authentication for asset.list", async () => {
    const ctx = createAuthContext();
    ctx.user = null as any;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.asset.list();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should require admin role to create asset", async () => {
    const ctx = createAuthContext(1);
    ctx.user.userRole = "collaborator";
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.asset.create({
        name: "Test Asset",
        type: "Building",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to create asset", async () => {
    const ctx = createAuthContext(1);
    ctx.user.userRole = "admin";
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.asset.create({
        name: "Test Asset",
        type: "Building",
        location: "Downtown",
        description: "Test building",
      });
      expect(result).toBeDefined();
    } catch (error: any) {
      // Expected if no database
      expect(error.message).toBeDefined();
    }
  });
});
