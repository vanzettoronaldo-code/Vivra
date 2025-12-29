import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Building2, Clock, TrendingUp, Shield, Zap, FileText, Chrome } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Minimalista */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-vivra.png" alt="VIVRA" className="w-8 h-8" />
            <span className="text-2xl font-bold text-primary">VIVRA</span>
          </div>
          <Button asChild variant="outline">
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section com Card de Login */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            {/* Card Centralizado */}
            <div className="bg-white border border-border rounded-2xl shadow-lg p-8 text-center">
              {/* Logo Grande */}
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">V</span>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold text-primary mb-2">
                VIVRA
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Memória Técnica Viva para Ativos
              </p>

              {/* Descrição */}
              <p className="text-base text-foreground mb-8 leading-relaxed">
                Plataforma completa para registrar histórico operacional, identificar problemas recorrentes e transformar dados em inteligência para decisão.
              </p>

              {/* Botão de Login */}
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-white mb-4">
                <a href={getLoginUrl()}>
                  <Chrome className="w-4 h-4 mr-2" />
                  Continuar com Google
                </a>
              </Button>

              {/* Links Footer */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </div>
            </div>

            {/* Texto Adicional */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              Gestão de ativos inteligente com análise de recorrência
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/30 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Funcionalidades Principais
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Linha do Tempo Completa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Registre histórico operacional com problemas, manutenções e inspeções com data, autor e anexos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Registro Rápido Mobile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Formulário otimizado para campo: texto, fotos, áudio e categoria em menos de 1 minuto.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Inteligência de Recorrência
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifique automaticamente problemas recorrentes e receba alertas quando padrões se repetem.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Dados Privados e Isolados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cada empresa possui ambiente completamente isolado com controle de permissões por usuário.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Relatórios em PDF
                </h3>
                <p className="text-sm text-muted-foreground">
                  Exporte histórico completo com gráficos de frequência e análises de tendências profissionais.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Gestão de Ativos Completa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crie painéis individuais para cada ativo: prédios, galpões, escolas, indústrias e lojas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Comece a Gerenciar seus Ativos Agora
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Transforme dados operacionais em inteligência. Identifique padrões, previna problemas e tome decisões baseadas em dados.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <a href={getLoginUrl()}>
                Acessar VIVRA
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 VIVRA - Memória Técnica Viva. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
