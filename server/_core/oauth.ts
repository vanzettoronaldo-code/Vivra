import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// SUAS CREDENCIAIS DO GOOGLE HARDCODED
const GOOGLE_CLIENT_ID = "721487339835-uqohbhba03q4jgoq3qkrp2fpgnu5o1ok.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

export function registerOAuthRoutes(app: Express) {
  
  // 1. Rota que inicia o login (Redireciona para o Google)
  app.get("/api/auth/google", (req: Request, res: Response) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    
    // Define a URL base (Localhost ou Produção)
    // Se estiver no Render, certifique-se de configurar a variável APP_URL no painel do Render
    // Caso contrário, ele vai tentar usar localhost
    const baseUrl = process.env.APP_URL || "http://localhost:5000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

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

  // 2. Rota de Callback (Google devolve o usuário aqui)
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
    if (!code) {
      return res.redirect("/login?error=google_auth_failed");
    }

    try {
      // Recalcula a redirect_uri para garantir que é a mesma enviada no passo 1
      const baseUrl = process.env.APP_URL || "http://localhost:5000";
      const redirectUri = `${baseUrl}/api/auth/google/callback`;

      // A. Trocar o "code" pelo "access_token"
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
        console.error("Erro no token do Google:", tokenData);
        throw new Error(tokenData.error_description || "Falha ao obter token");
      }
      
      // B. Pegar os dados do usuário no Google
      const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`);
      const googleUser = await userRes.json();

      if (!googleUser.email) {
        throw new Error("Email não fornecido pelo Google");
      }

      // C. Salvar ou atualizar no banco de dados
      const userOpenId = `google_${googleUser.id}`;

      await db.upsertUser({
        openId: userOpenId,
        name: googleUser.name,
        email: googleUser.email,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // D. Criar a sessão no seu sistema
      const sessionToken = await sdk.createSessionToken(userOpenId, {
        name: googleUser.name,
        expiresInMs: ONE_YEAR_MS
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Sucesso! Vai para o Dashboard
      res.redirect("/dashboard");

    } catch (error) {
      console.error("[OAuth] Google login failed", error);
      res.redirect("/login?error=server_error");
    }
  });
}
