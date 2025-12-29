import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  FileText, 
  Bell, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Mail,
  Plug,
  Database,
  Clock,
  Target,
  Lightbulb,
  Send
} from "lucide-react";

export default function Home() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setSubscribing(false);
  };

  const features = [
    {
      icon: Database,
      title: isPortuguese ? "Gestão de Ativos" : "Asset Management",
      description: isPortuguese 
        ? "Cadastre e organize todos os seus ativos físicos com histórico técnico completo"
        : "Register and organize all your physical assets with complete technical history",
    },
    {
      icon: FileText,
      title: isPortuguese ? "Registros Rápidos" : "Quick Records",
      description: isPortuguese 
        ? "Documente problemas, manutenções e inspeções em menos de 1 minuto"
        : "Document problems, maintenance and inspections in less than 1 minute",
    },
    {
      icon: Lightbulb,
      title: isPortuguese ? "Inteligência de Recorrência" : "Recurrence Intelligence",
      description: isPortuguese 
        ? "Identifique padrões de problemas que se repetem e tome decisões proativas"
        : "Identify recurring problem patterns and make proactive decisions",
    },
    {
      icon: TrendingUp,
      title: isPortuguese ? "Métricas e Análises" : "Metrics & Analytics",
      description: isPortuguese 
        ? "Dashboards com tendências, gráficos e indicadores de desempenho"
        : "Dashboards with trends, charts and performance indicators",
    },
    {
      icon: Bell,
      title: isPortuguese ? "Alertas Inteligentes" : "Smart Alerts",
      description: isPortuguese 
        ? "Notificações em tempo real quando padrões críticos são detectados"
        : "Real-time notifications when critical patterns are detected",
    },
    {
      icon: Plug,
      title: isPortuguese ? "Integrações" : "Integrations",
      description: isPortuguese 
        ? "Conecte com Grafana, Datadog, Prometheus e outros sistemas de monitoramento"
        : "Connect with Grafana, Datadog, Prometheus and other monitoring systems",
    },
  ];

  const stats = [
    { value: "99.9%", label: isPortuguese ? "Uptime garantido" : "Guaranteed uptime" },
    { value: "50%", label: isPortuguese ? "Redução de falhas" : "Failure reduction" },
    { value: "10x", label: isPortuguese ? "Mais rápido" : "Faster" },
    { value: "24/7", label: isPortuguese ? "Monitoramento" : "Monitoring" },
  ];

  const benefits = [
    isPortuguese ? "Histórico técnico completo de cada ativo" : "Complete technical history of each asset",
    isPortuguese ? "Identificação automática de problemas recorrentes" : "Automatic identification of recurring problems",
    isPortuguese ? "Relatórios profissionais em PDF" : "Professional PDF reports",
    isPortuguese ? "Fluxos de aprovação configuráveis" : "Configurable approval workflows",
    isPortuguese ? "Suporte a múltiplos idiomas" : "Multi-language support",
    isPortuguese ? "Integrações com sistemas externos" : "Integrations with external systems",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-500/5" />
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <img src="/logo-vivra.png" alt="VIVRA" className="h-10 w-10" />
              <span className="text-2xl font-bold text-slate-900">VIVRA</span>
            </div>
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPortuguese ? "Entrar" : "Sign In"}
            </Button>
          </nav>

          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {isPortuguese 
                ? "Memória Técnica Viva para Gestão de Ativos"
                : "Living Technical Memory for Asset Management"}
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {isPortuguese 
                ? "Plataforma inteligente para registro, análise e gestão do histórico técnico dos seus ativos físicos. Identifique padrões, previna falhas e tome decisões baseadas em dados."
                : "Intelligent platform for recording, analyzing and managing the technical history of your physical assets. Identify patterns, prevent failures and make data-driven decisions."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-blue-600 hover:bg-blue-700 gap-2 text-lg px-8"
              >
                {isPortuguese ? "Começar Agora" : "Get Started"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 text-lg px-8"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                {isPortuguese ? "Conhecer Recursos" : "Explore Features"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{stat.value}</p>
                <p className="text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {isPortuguese ? "Recursos Principais" : "Key Features"}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isPortuguese 
                ? "Tudo que você precisa para gerenciar o histórico técnico dos seus ativos em um só lugar"
                : "Everything you need to manage the technical history of your assets in one place"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {isPortuguese 
                  ? "Por que escolher o VIVRA?"
                  : "Why choose VIVRA?"}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {isPortuguese 
                  ? "O VIVRA transforma a gestão de ativos com inteligência artificial e análise de dados avançada."
                  : "VIVRA transforms asset management with artificial intelligence and advanced data analytics."}
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium opacity-90">
                    {isPortuguese ? "Dashboard Inteligente" : "Smart Dashboard"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {isPortuguese ? "Como Funciona" : "How It Works"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {isPortuguese ? "Cadastre seus Ativos" : "Register your Assets"}
              </h3>
              <p className="text-slate-600">
                {isPortuguese 
                  ? "Adicione seus equipamentos, edificações e infraestruturas com informações detalhadas"
                  : "Add your equipment, buildings and infrastructure with detailed information"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {isPortuguese ? "Registre Ocorrências" : "Log Occurrences"}
              </h3>
              <p className="text-slate-600">
                {isPortuguese 
                  ? "Documente problemas, manutenções e inspeções com fotos, áudios e descrições"
                  : "Document problems, maintenance and inspections with photos, audio and descriptions"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {isPortuguese ? "Analise Padrões" : "Analyze Patterns"}
              </h3>
              <p className="text-slate-600">
                {isPortuguese 
                  ? "Receba insights sobre problemas recorrentes e tome decisões preventivas"
                  : "Receive insights on recurring problems and make preventive decisions"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isPortuguese 
              ? "Pronto para transformar sua gestão de ativos?"
              : "Ready to transform your asset management?"}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {isPortuguese 
              ? "Comece gratuitamente e descubra como o VIVRA pode ajudar sua organização"
              : "Start for free and discover how VIVRA can help your organization"}
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = getLoginUrl()}
            className="gap-2 text-lg px-8"
          >
            {isPortuguese ? "Criar Conta Gratuita" : "Create Free Account"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-6 text-cyan-400" />
            <h2 className="text-3xl font-bold mb-4">
              {isPortuguese ? "Assine nossa Newsletter" : "Subscribe to our Newsletter"}
            </h2>
            <p className="text-slate-300 mb-8">
              {isPortuguese 
                ? "Receba dicas de gestão de ativos, novidades da plataforma e conteúdos exclusivos diretamente no seu email."
                : "Receive asset management tips, platform news and exclusive content directly in your email."}
            </p>

            {subscribed ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">
                  {isPortuguese ? "Inscrição confirmada!" : "Subscription confirmed!"}
                </h3>
                <p className="text-slate-300">
                  {isPortuguese 
                    ? "Obrigado por se inscrever. Você receberá nossas novidades em breve."
                    : "Thank you for subscribing. You will receive our news soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isPortuguese ? "Seu melhor email" : "Your best email"}
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Button 
                  type="submit" 
                  disabled={subscribing}
                  className="bg-cyan-500 hover:bg-cyan-600 gap-2 px-6"
                >
                  {subscribing ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isPortuguese ? "Inscrever" : "Subscribe"}
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="text-xs text-slate-500 mt-4">
              {isPortuguese 
                ? "Respeitamos sua privacidade. Cancele a qualquer momento."
                : "We respect your privacy. Unsubscribe at any time."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo-vivra.png" alt="VIVRA" className="h-8 w-8" />
              <span className="text-lg font-semibold text-white">VIVRA</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} VIVRA. {isPortuguese ? "Todos os direitos reservados." : "All rights reserved."}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                {isPortuguese ? "Termos de Uso" : "Terms of Service"}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {isPortuguese ? "Privacidade" : "Privacy"}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {isPortuguese ? "Contato" : "Contact"}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
