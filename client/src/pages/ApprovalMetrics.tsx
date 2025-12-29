import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ApprovalMetric {
  period: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

interface CategoryMetric {
  category: string;
  approved: number;
  rejected: number;
  pending: number;
}

export default function ApprovalMetrics() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Mock data - em produção viria do tRPC
  const metricsData: ApprovalMetric[] = [
    { period: "Seg", total: 12, approved: 10, rejected: 1, pending: 1 },
    { period: "Ter", total: 15, approved: 13, rejected: 1, pending: 1 },
    { period: "Qua", total: 18, approved: 15, rejected: 2, pending: 1 },
    { period: "Qui", total: 14, approved: 12, rejected: 1, pending: 1 },
    { period: "Sex", total: 20, approved: 17, rejected: 2, pending: 1 },
    { period: "Sab", total: 8, approved: 7, rejected: 0, pending: 1 },
    { period: "Dom", total: 5, approved: 4, rejected: 0, pending: 1 },
  ];

  const categoryMetrics: CategoryMetric[] = [
    { category: "Problema", approved: 45, rejected: 8, pending: 3 },
    { category: "Manutenção", approved: 38, rejected: 5, pending: 2 },
    { category: "Decisão", approved: 22, rejected: 3, pending: 1 },
    { category: "Inspeção", approved: 35, rejected: 4, pending: 2 },
  ];

  const totalApprovals = 140;
  const totalRejections = 20;
  const totalPending = 8;
  const approvalRate = ((totalApprovals / (totalApprovals + totalRejections)) * 100).toFixed(1);
  const avgApprovalTime = "2.3 horas";

  const pieData = [
    { name: "Aprovado", value: totalApprovals, color: "#10b981" },
    { name: "Rejeitado", value: totalRejections, color: "#ef4444" },
    { name: "Pendente", value: totalPending, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Métricas de Aprovação</h1>
          <p className="text-muted-foreground mt-2">Análise de performance do fluxo de aprovação</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Aprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-3xl font-bold">{totalApprovals}</p>
                <p className="text-xs text-green-600">+12% vs. semana anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rejeitado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-3xl font-bold">{totalRejections}</p>
                <p className="text-xs text-red-600">-5% vs. semana anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-3xl font-bold">{approvalRate}%</p>
                <p className="text-xs text-blue-600">Excelente desempenho</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-3xl font-bold">{avgApprovalTime}</p>
                <p className="text-xs text-purple-600">Para aprovação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Aprovações (Última Semana)</CardTitle>
            <CardDescription>Número de registros aprovados, rejeitados e pendentes por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#10b981" name="Aprovado" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejeitado" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pendente" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
            <CardDescription>Proporção de aprovações, rejeições e pendências</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Categoria</CardTitle>
          <CardDescription>Performance de aprovação por tipo de registro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryMetrics.map(metric => (
              <div key={metric.category} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{metric.category}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {metric.approved} aprovado
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {metric.rejected} rejeitado
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {metric.pending} pendente
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(metric.approved / (metric.approved + metric.rejected + metric.pending)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Insights & Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-900">
          <p>✓ Taxa de aprovação de {approvalRate}% está acima da média (85%)</p>
          <p>✓ Tempo médio de aprovação de {avgApprovalTime} é excelente</p>
          <p>⚠ Categoria "Problema" tem maior volume de rejeições (8 em 56)</p>
          <p>→ Considere revisar critérios de aprovação para problemas críticos</p>
        </CardContent>
      </Card>
    </div>
  );
}
