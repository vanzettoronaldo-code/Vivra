import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// --- CONFIGURAÇÃO PRONTA ---
const GOOGLE_CLIENT_ID = "721487339835-uqohbhba03q4jgoq3qkrp2fpgnu5o1ok.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// URL EXATA DE PRODUÇÃO DO RENDER
const PROD_URL = "https://vivra-app.onrender.com";

export function registerOAuthRoutes(app: Express) {
  
  // 1. Rota que inicia o login
  app.get("/api/auth/google", (req: Request, res: Response) => {
    // Detecta se está rodando local ou produção
    const host = req.get("host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    
    // Define a URL base correta automaticamente
    const baseUrl = isLocal ? "http://localhost:5000" : PROD_URL;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    console.log(`[OAuth] Iniciando login. Redirect URI: ${redirectUri}`);

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: redirectUri,
      client_id: GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    
    res.redirect(`${rootUrl}?${new URLSearchParams(options).toString()}`);
  });

  // 2. Rota de Callback
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
    // Detecta ambiente novamente para garantir que a URI seja IGUAL a do passo 1
    const host = req.get("host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const baseUrl = isLocal ? "http://localhost:5000" : PROD_URL;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!code) {
      console.error("[OAuth] Código não recebido do Google");
      return res.redirect("/login?error=google_auth_failed");
    }

    try {
      // A. Troca o código pelo token
      const tokenUrl = "https://oauth2.googleapis.com/token";
      const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      };
      
      const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(values).toString(),
      });
      
      const tokenData = await tokenRes.json();
      
      if (tokenData.error) {
        console.error("[OAuth] Erro ao trocar token:", tokenData);
        throw new Error(tokenData.error_description || "Falha ao obter token");
      }
      
      // B. Pega os dados do usuário
      const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`);
      const googleUser = await userRes.json();

      if (!googleUser.email) {
        throw new Error("Email não fornecido pelo Google");
      }

      // C. Salva no Banco
      const userOpenId = `google_${googleUser.id}`;

      await db.upsertUser({
        openId: userOpenId,
        name: googleUser.name,
        email: googleUser.email,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // D. Cria a sessão (Login)
      const sessionToken = await sdk.createSessionToken(userOpenId, {
        name: googleUser.name,
        expiresInMs: ONE_YEAR_MS
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      console.log(`[OAuth] Login com sucesso para: ${googleUser.email}`);
      res.redirect("/dashboard");

    } catch (error) {
      console.error("[OAuth] Falha fatal no login:", error);
      res.redirect("/login?error=server_error");
    }
  });
}
