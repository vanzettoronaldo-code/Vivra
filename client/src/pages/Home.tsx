import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Building2, Clock, TrendingUp, Shield, Zap, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">VIVRA</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Memória Técnica Viva para Gestão de Ativos
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Plataforma completa para registrar histórico operacional, identificar problemas recorrentes e transformar dados em inteligência para decisão. Gestão de ativos com inteligência de recorrência.
          </p>
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <a href={getLoginUrl()}>Começar Agora</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Funcionalidades Principais de Gestão de Ativos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <Clock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Linha do Tempo Completa</h3>
            <p className="text-slate-600">
              Registre histórico operacional com problemas, manutenções, decisões e inspeções com data, autor e anexos (fotos e áudio).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <Zap className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Registro Rápido Mobile</h3>
            <p className="text-slate-600">
              Formulário otimizado para campo: texto, fotos, áudio e categoria em menos de 1 minuto. Perfeito para registros em tempo real.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Inteligência de Recorrência</h3>
            <p className="text-slate-600">
              Identifique automaticamente problemas recorrentes e receba alertas quando padrões se repetem. Análise inteligente de tendências.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Dados Privados e Isolados</h3>
            <p className="text-slate-600">
              Cada empresa possui ambiente completamente isolado com controle de permissões por usuário. Segurança de dados garantida.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Relatórios em PDF</h3>
            <p className="text-slate-600">
              Exporte histórico completo com gráficos de frequência e análises de tendências. Relatórios profissionais para apresentações.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <Building2 className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestão de Ativos Completa</h3>
            <p className="text-slate-600">
              Crie painéis individuais para cada ativo: prédios, galpões, escolas, indústrias, lojas. Centralizar gestão de ativos.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Por Que Escolher VIVRA para Gestão de Ativos</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Memória Técnica Centralizada</h3>
                <p className="text-slate-600 mt-2">
                  Mantenha todo o histórico operacional em um único lugar, acessível a qualquer momento para consulta e análise.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Identificação de Problemas Recorrentes</h3>
                <p className="text-slate-600 mt-2">
                  Detecte padrões e problemas que se repetem frequentemente para tomar ações preventivas eficazes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Decisões Baseadas em Dados</h3>
                <p className="text-slate-600 mt-2">
                  Transforme histórico operacional em inteligência acionável para melhorar a gestão de ativos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Transformar a Gestão de Seus Ativos?</h2>
          <p className="text-lg mb-8 opacity-90">
            Comece agora e tenha acesso a memória técnica viva, inteligência de recorrência e relatórios profissionais.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={getLoginUrl()}>Acessar Plataforma</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 VIVRA - Memória Técnica Viva para Gestão de Ativos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
