import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingUp, BarChart3, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateIntelligenceReport } from "@/lib/reportGenerator";

interface RecurrentProblem {
  id: string;
  title: string;
  frequency: number;
  lastOccurrence: string;
  asset: string;
  severity: "low" | "medium" | "high";
  trend: "up" | "down" | "stable";
}

export default function Intelligence() {
  const { language } = useLanguage();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const isPortuguese = language === "pt-BR";

  // Mock data for recurrent problems
  const recurrentProblems: RecurrentProblem[] = [
    {
      id: "1",
      title: isPortuguese ? "Vazamento de água" : "Water leak",
      frequency: 12,
      lastOccurrence: "2025-12-28",
      asset: "Test Asset Building",
      severity: "high",
      trend: "up",
    },
    {
      id: "2",
      title: isPortuguese ? "Falha elétrica" : "Electrical failure",
      frequency: 8,
      lastOccurrence: "2025-12-27",
      asset: "janela escola",
      severity: "high",
      trend: "stable",
    },
    {
      id: "3",
      title: isPortuguese ? "Manutenção preventiva" : "Preventive maintenance",
      frequency: 15,
      lastOccurrence: "2025-12-29",
      asset: "Test Asset Building",
      severity: "medium",
      trend: "down",
    },
    {
      id: "4",
      title: isPortuguese ? "Ruído excessivo" : "Excessive noise",
      frequency: 5,
      lastOccurrence: "2025-12-26",
      asset: "janela escola",
      severity: "low",
      trend: "stable",
    },
  ];

  const handleExportReport = () => {
    generateIntelligenceReport({
      companyName: "VIVRA",
      generatedDate: new Date(),
      problems: recurrentProblems,
      totalOccurrences: recurrentProblems.reduce((sum, p) => sum + p.frequency, 0),
      highSeverityCount: recurrentProblems.filter((p) => p.severity === "high").length,
      language: language as "pt-BR" | "en-US",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈";
    if (trend === "down") return "📉";
    return "➡️";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isPortuguese ? "Inteligência" : "Intelligence"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isPortuguese
              ? "Análise de padrões recorrentes e tendências"
              : "Analysis of recurrent patterns and trends"}
          </p>
        </div>
        <Button onClick={handleExportReport} className="bg-accent hover:bg-accent/90 text-primary">
          <Download className="w-4 h-4 mr-2" />
          {isPortuguese ? "Exportar Relatório" : "Export Report"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isPortuguese ? "Problemas Recorrentes" : "Recurrent Problems"}
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {recurrentProblems.length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isPortuguese ? "Ocorrências Totais" : "Total Occurrences"}
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {recurrentProblems.reduce((sum, p) => sum + p.frequency, 0)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isPortuguese ? "Severidade Alta" : "High Severity"}
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {recurrentProblems.filter((p) => p.severity === "high").length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isPortuguese ? "Tendência" : "Trend"}
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {recurrentProblems.filter((p) => p.trend === "up").length}
                <span className="text-sm text-red-600"> ↑</span>
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Problems List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-primary">
            {isPortuguese ? "Problemas Recorrentes" : "Recurrent Problems"}
          </h2>
          <div className="space-y-3">
            {recurrentProblems.map((problem) => (
              <Card
                key={problem.id}
                className={`p-4 border-border cursor-pointer transition-all hover:shadow-md ${
                  selectedProblem === problem.id ? "ring-2 ring-accent" : ""
                }`}
                onClick={() =>
                  setSelectedProblem(
                    selectedProblem === problem.id ? null : problem.id
                  )
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {problem.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                          problem.severity
                        )}`}
                      >
                        {problem.severity === "high"
                          ? isPortuguese
                            ? "Alta"
                            : "High"
                          : problem.severity === "medium"
                            ? isPortuguese
                              ? "Média"
                              : "Medium"
                            : isPortuguese
                              ? "Baixa"
                              : "Low"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPortuguese ? "Ativo" : "Asset"}: {problem.asset}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isPortuguese ? "Última ocorrência" : "Last occurrence"}:{" "}
                      {new Date(problem.lastOccurrence).toLocaleDateString(
                        language === "pt-BR" ? "pt-BR" : "en-US"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {problem.frequency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isPortuguese ? "ocorrências" : "occurrences"}
                    </p>
                    <p className="text-xl mt-2">{getTrendIcon(problem.trend)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">
            {isPortuguese ? "Recomendações" : "Recommendations"}
          </h2>
          <Card className="p-4 border-border bg-accent/5">
            <h3 className="font-semibold text-foreground mb-3">
              {isPortuguese ? "Ações Recomendadas" : "Recommended Actions"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>
                  {isPortuguese
                    ? "Implementar manutenção preventiva para vazamentos"
                    : "Implement preventive maintenance for leaks"}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>
                  {isPortuguese
                    ? "Revisar sistema elétrico do prédio"
                    : "Review building electrical system"}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>
                  {isPortuguese
                    ? "Aumentar frequência de inspeções"
                    : "Increase inspection frequency"}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>
                  {isPortuguese
                    ? "Treinar equipe em procedimentos de manutenção"
                    : "Train team on maintenance procedures"}
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-4 border-border bg-blue-50">
            <h3 className="font-semibold text-foreground mb-3">
              {isPortuguese ? "Próximas Ações" : "Next Steps"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isPortuguese
                ? "Configure alertas automáticos para ser notificado quando padrões se repetem."
                : "Configure automatic alerts to be notified when patterns repeat."}
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              {isPortuguese ? "Configurar Alertas" : "Configure Alerts"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
