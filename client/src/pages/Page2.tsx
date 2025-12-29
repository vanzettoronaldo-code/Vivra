import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Download, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

// Sample data for charts
const problemFrequencyData = [
  { name: "Semana 1", problemas: 4, manutencoes: 2, inspecoes: 3 },
  { name: "Semana 2", problemas: 3, manutencoes: 5, inspecoes: 2 },
  { name: "Semana 3", problemas: 5, manutencoes: 3, inspecoes: 4 },
  { name: "Semana 4", problemas: 2, manutencoes: 4, inspecoes: 3 },
];

const categoryDistribution = [
  { name: "Problemas", value: 35, color: "#ef4444" },
  { name: "Manutenção", value: 28, color: "#f97316" },
  { name: "Inspeção", value: 22, color: "#3b82f6" },
  { name: "Decisões", value: 15, color: "#10b981" },
];

const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#10b981"];

export default function Page2() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Relatórios</h1>
          <p className="text-muted-foreground mt-2">Visualize tendências e métricas de seus ativos</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Problemas Detectados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">35</div>
            <p className="text-xs text-muted-foreground mt-1">-8% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ativos Monitorados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Todos ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Frequência de Registros por Semana</CardTitle>
            <CardDescription>Últimas 4 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problemFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="problemas" fill="#ef4444" name="Problemas" />
                <Bar dataKey="manutencoes" fill="#f97316" name="Manutenção" />
                <Bar dataKey="inspecoes" fill="#3b82f6" name="Inspeção" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Proporção de registros</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Problemas Mais Frequentes</CardTitle>
          <CardDescription>Principais recorrências detectadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { issue: "Vazamento de água", count: 8, trend: "↑ +2" },
              { issue: "Falha elétrica", count: 6, trend: "↓ -1" },
              { issue: "Ruído anormal", count: 5, trend: "→ 0" },
              { issue: "Corrosão", count: 4, trend: "↑ +1" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.issue}</p>
                  <p className="text-sm text-muted-foreground">{item.count} ocorrências</p>
                </div>
                <div className="text-sm font-semibold text-orange-600">{item.trend}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório em PDF
        </Button>
      </div>
    </div>
  );
}
