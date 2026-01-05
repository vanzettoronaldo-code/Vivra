import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";
  const [, setLocation] = useLocation();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error(isPortuguese ? "Preencha todos os campos" : "Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error(isPortuguese ? "As senhas não coincidem" : "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error(isPortuguese ? "A senha deve ter pelo menos 6 caracteres" : "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      toast.success(isPortuguese ? "Conta criada com sucesso!" : "Account created successfully!");
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-vivra.png" alt="VIVRA" className="h-12 w-12" />
            <span className="text-3xl font-bold text-slate-900">VIVRA</span>
          </div>
          <CardTitle className="text-2xl">
            {isPortuguese ? "Criar sua conta" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {isPortuguese 
              ? "Preencha os dados abaixo para começar" 
              : "Fill in the details below to get started"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {isPortuguese ? "Nome completo" : "Full name"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder={isPortuguese ? "Seu nome" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {isPortuguese ? "Senha" : "Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {isPortuguese ? "Confirmar senha" : "Confirm password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPortuguese ? "Criando conta..." : "Creating account..."}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isPortuguese ? "Criar conta" : "Create account"}
                </>
              )}
            </Button>
            <p className="text-sm text-slate-600 text-center">
              {isPortuguese ? "Já tem uma conta?" : "Already have an account?"}{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                {isPortuguese ? "Entrar" : "Sign in"}
              </Link>
            </p>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 text-center">
              {isPortuguese ? "← Voltar para a página inicial" : "← Back to home"}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
