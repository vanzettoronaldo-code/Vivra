import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";

export default function Metrics() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";

  const { data: timelineStats } = trpc.intelligence.getTimelineStats.useQuery();
  const { data: recurrentProblems = [] } = trpc.intelligence.getRecurrentProblems.useQuery();

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!timelineStats) return null;

    const totalRecords = timelineStats.totalRecords;
    const problemCount = timelineStats.problemCount;
    const maintenanceCount = timelineStats.maintenanceCount;
    const resolutionRate = totalRecords > 0 ? ((maintenanceCount / problemCount) * 100).toFixed(1) : "0";

    return {
      totalRecords,
      problemCount,
      maintenanceCount,
      decisionCount: timelineStats.decisionCount,
      inspectionCount: timelineStats.inspectionCount,
      resolutionRate,
      averageProblemsPerMonth: (totalRecords / Object.keys(timelineStats.byMonth || {}).length).toFixed(1),
    };
  }, [timelineStats]);

  // Prepare chart data
  const categoryData = useMemo(() => {
    if (!metrics) return [];
    return [
      { label: isPortuguese ? "Problemas" : "Problems", value: metrics.problemCount, color: "#ef4444" },
      { label: isPortuguese ? "Manutenção" : "Maintenance", value: metrics.maintenanceCount, color: "#3b82f6" },
      { label: isPortuguese ? "Decisões" : "Decisions", value: metrics.decisionCount, color: "#8b5cf6" },
      { label: isPortuguese ? "Inspeções" : "Inspections", value: metrics.inspectionCount, color: "#10b981" },
    ];
  }, [metrics, isPortuguese]);

  const monthlyData = useMemo(() => {
    if (!timelineStats?.byMonth) return [];
    const months = Object.entries(timelineStats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // Last 6 months

    return months.map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString(language, { month: "short", year: "2-digit" }),
      count,
    }));
  }, [timelineStats, language]);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{isPortuguese ? "Carregando métricas..." : "Loading metrics..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{isPortuguese ? "Métricas" : "Metrics"}</h1>
        <p className="text-slate-600 mt-1">
          {isPortuguese ? "Análise de tendências e desempenho" : "Trends and performance analysis"}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isPortuguese ? "Total de Registros" : "Total Records"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{metrics.totalRecords}</div>
            <p className="text-xs text-slate-500 mt-2">
              {isPortuguese ? "Histórico completo" : "Complete history"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isPortuguese ? "Problemas Reportados" : "Problems Reported"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics.problemCount}</div>
            <p className="text-xs text-slate-500 mt-2">
              {((metrics.problemCount / metrics.totalRecords) * 100).toFixed(1)}% {isPortuguese ? "do total" : "of total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isPortuguese ? "Taxa de Resolução" : "Resolution Rate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.resolutionRate}%</div>
            <p className="text-xs text-slate-500 mt-2">
              {isPortuguese ? "Manutenção vs Problemas" : "Maintenance vs Problems"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isPortuguese ? "Média Mensal" : "Monthly Average"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.averageProblemsPerMonth}</div>
            <p className="text-xs text-slate-500 mt-2">
              {isPortuguese ? "Registros por mês" : "Records per month"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              {isPortuguese ? "Distribuição por Categoria" : "Category Distribution"}
            </CardTitle>
            <CardDescription>
              {isPortuguese ? "Composição dos registros" : "Records composition"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item) => {
                const percentage = ((item.value / metrics.totalRecords) * 100).toFixed(1);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {item.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isPortuguese ? "Tendência Mensal" : "Monthly Trend"}
            </CardTitle>
            <CardDescription>
              {isPortuguese ? "Últimos 6 meses" : "Last 6 months"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.length > 0 ? (
                monthlyData.map((item) => {
                  const maxCount = Math.max(...monthlyData.map(d => d.count));
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{item.month}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">
                  {isPortuguese ? "Sem dados disponíveis" : "No data available"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recurrent Problems */}
      {recurrentProblems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isPortuguese ? "Problemas Mais Recorrentes" : "Most Recurrent Problems"}
            </CardTitle>
            <CardDescription>
              {isPortuguese ? "Top 5 problemas" : "Top 5 problems"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recurrentProblems.slice(0, 5).map((problem: any, index) => (
                <div key={problem.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{problem.title}</p>
                      <p className="text-xs text-slate-500">
                        {isPortuguese ? "Ativo" : "Asset"}: {problem.assetId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{problem.frequency}</p>
                    <p className="text-xs text-slate-500">
                      {isPortuguese ? "ocorrências" : "occurrences"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
