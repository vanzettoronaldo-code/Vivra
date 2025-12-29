import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  XCircle,
  Activity,
  Building2,
  Wrench,
  AlertCircle,
  ClipboardList,
  ArrowRight,
  BarChart3,
  Bell
} from "lucide-react";
import { useLocation } from "wouter";

export default function DashboardOverview() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  
  // Fetch data from tRPC
  const { data: assets } = trpc.asset.list.useQuery();
  const { data: timelineStats } = trpc.intelligence.getTimelineStats.useQuery();
  const { data: recurrencePatterns } = trpc.intelligence.getRecurrentProblems.useQuery();
  
  // Mock pending approvals count (would need to create this procedure)
  const pendingApprovals: any[] = [];

  const isPt = language === "pt-BR";
  
  const t = {
    title: isPt ? "Visão Geral" : "Overview",
    subtitle: isPt 
      ? "Resumo completo da sua infraestrutura e memória técnica" 
      : "Complete summary of your infrastructure and technical memory",
    
    // Cards
    totalAssets: isPt ? "Total de Ativos" : "Total Assets",
    activeAssets: isPt ? "ativos cadastrados" : "registered assets",
    
    totalRecords: isPt ? "Registros Técnicos" : "Technical Records",
    recordsThisMonth: isPt ? "registros este mês" : "records this month",
    
    pendingApprovals: isPt ? "Aprovações Pendentes" : "Pending Approvals",
    awaitingReview: isPt ? "aguardando revisão" : "awaiting review",
    
    activeAlerts: isPt ? "Alertas Ativos" : "Active Alerts",
    requireAttention: isPt ? "requerem atenção" : "require attention",
    
    // Recent Activity
    recentActivity: isPt ? "Atividade Recente" : "Recent Activity",
    noRecentActivity: isPt ? "Nenhuma atividade recente" : "No recent activity",
    
    // Quick Actions
    quickActions: isPt ? "Ações Rápidas" : "Quick Actions",
    newRecord: isPt ? "Novo Registro" : "New Record",
    viewAssets: isPt ? "Ver Ativos" : "View Assets",
    viewAlerts: isPt ? "Ver Alertas" : "View Alerts",
    viewReports: isPt ? "Ver Relatórios" : "View Reports",
    
    // Categories breakdown
    categoriesBreakdown: isPt ? "Distribuição por Categoria" : "Categories Breakdown",
    problems: isPt ? "Problemas" : "Problems",
    maintenance: isPt ? "Manutenção" : "Maintenance",
    decisions: isPt ? "Decisões" : "Decisions",
    inspections: isPt ? "Inspeções" : "Inspections",
    
    // Recurrence patterns
    recurrencePatterns: isPt ? "Padrões Recorrentes" : "Recurrence Patterns",
    noPatterns: isPt ? "Nenhum padrão identificado" : "No patterns identified",
    occurrences: isPt ? "ocorrências" : "occurrences",
    
    // Status
    resolved: isPt ? "Resolvido" : "Resolved",
    pending: isPt ? "Pendente" : "Pending",
    critical: isPt ? "Crítico" : "Critical",
    
    viewAll: isPt ? "Ver Todos" : "View All",
  };

  // Calculate stats
  const totalAssets = assets?.length || 0;
  const totalRecords = timelineStats?.totalRecords || 0;
  const pendingCount = pendingApprovals?.length || 0;
  const alertsCount = recurrencePatterns?.filter((p: any) => p.severity === "high").length || 0;

  // Category stats from timeline
  const categoryStats = {
    problems: timelineStats?.problemCount || 0,
    maintenance: timelineStats?.maintenanceCount || 0,
    decisions: timelineStats?.decisionCount || 0,
    inspections: timelineStats?.inspectionCount || 0,
  };

  const totalCategoryRecords = Object.values(categoryStats).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Assets */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalAssets}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">{t.activeAssets}</p>
          </CardContent>
        </Card>

        {/* Total Records */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/metricas")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRecords}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{totalRecords}</span> {t.recordsThisMonth}
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/approval-notifications")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingApprovals}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingCount > 0 && <span className="text-amber-600">{pendingCount}</span>} {t.awaitingReview}
            </p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/alertas")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeAlerts}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsCount}</div>
            <p className="text-xs text-muted-foreground">
              {alertsCount > 0 && <span className="text-red-600">{alertsCount}</span>} {t.requireAttention}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Categories and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Categories Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.categoriesBreakdown}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Problems */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{t.problems}</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(categoryStats.problems / totalCategoryRecords) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{categoryStats.problems}</span>
              </div>

              {/* Maintenance */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{t.maintenance}</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(categoryStats.maintenance / totalCategoryRecords) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{categoryStats.maintenance}</span>
              </div>

              {/* Decisions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{t.decisions}</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(categoryStats.decisions / totalCategoryRecords) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{categoryStats.decisions}</span>
              </div>

              {/* Inspections */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{t.inspections}</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(categoryStats.inspections / totalCategoryRecords) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{categoryStats.inspections}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setLocation("/quick-record")}
            >
              <FileText className="mr-2 h-4 w-4" />
              {t.newRecord}
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setLocation("/")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              {t.viewAssets}
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setLocation("/alertas")}
            >
              <Bell className="mr-2 h-4 w-4" />
              {t.viewAlerts}
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setLocation("/relatorios-agendados")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t.viewReports}
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Recurrence Patterns and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recurrence Patterns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t.recurrencePatterns}
              </CardTitle>
              <CardDescription>
                {language === "pt-BR" ? "Problemas que se repetem frequentemente" : "Frequently recurring problems"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/inteligencia")}>
              {t.viewAll}
            </Button>
          </CardHeader>
          <CardContent>
            {recurrencePatterns && recurrencePatterns.length > 0 ? (
              <div className="space-y-3">
                {recurrencePatterns.slice(0, 4).map((pattern: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        pattern.severity === "high" ? "bg-red-100 text-red-600" :
                        pattern.severity === "medium" ? "bg-amber-100 text-amber-600" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pattern.pattern || pattern.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {pattern.count || pattern.occurrences} {t.occurrences}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      pattern.severity === "high" ? "destructive" :
                      pattern.severity === "medium" ? "secondary" :
                      "outline"
                    }>
                      {pattern.severity === "high" ? t.critical : 
                       pattern.severity === "medium" ? t.pending : t.resolved}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t.noPatterns}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t.recentActivity}
              </CardTitle>
              <CardDescription>
                {language === "pt-BR" ? "Últimos ativos atualizados" : "Recently updated assets"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
              {t.viewAll}
            </Button>
          </CardHeader>
          <CardContent>
            {assets && assets.length > 0 ? (
              <div className="space-y-3">
                {assets.slice(0, 4).map((asset: any) => (
                  <div 
                    key={asset.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setLocation(`/asset/${asset.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LayoutDashboard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t.noRecentActivity}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
