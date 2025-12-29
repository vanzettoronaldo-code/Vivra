import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { 
  Calendar, 
  Mail, 
  FileText, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp
} from "lucide-react";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  includeMetrics: boolean;
  includeTrends: boolean;
  includeRecommendations: boolean;
  enabled: boolean;
  lastSent?: Date;
}

export default function ScheduledReports() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";
  const { data: user } = trpc.auth.me.useQuery();

  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: isPortuguese ? "Relatório Semanal de Ativos" : "Weekly Assets Report",
      frequency: "weekly",
      dayOfWeek: 1, // Monday
      time: "09:00",
      recipients: [user?.email || ""],
      includeMetrics: true,
      includeTrends: true,
      includeRecommendations: true,
      enabled: true,
      lastSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: "",
    frequency: "weekly",
    dayOfWeek: 1,
    time: "09:00",
    recipients: [user?.email || ""],
    includeMetrics: true,
    includeTrends: true,
    includeRecommendations: false,
    enabled: true,
  });

  const frequencyOptions = [
    { value: "daily", label: isPortuguese ? "Diário" : "Daily" },
    { value: "weekly", label: isPortuguese ? "Semanal" : "Weekly" },
    { value: "monthly", label: isPortuguese ? "Mensal" : "Monthly" },
  ];

  const dayOfWeekOptions = [
    { value: 0, label: isPortuguese ? "Domingo" : "Sunday" },
    { value: 1, label: isPortuguese ? "Segunda" : "Monday" },
    { value: 2, label: isPortuguese ? "Terça" : "Tuesday" },
    { value: 3, label: isPortuguese ? "Quarta" : "Wednesday" },
    { value: 4, label: isPortuguese ? "Quinta" : "Thursday" },
    { value: 5, label: isPortuguese ? "Sexta" : "Friday" },
    { value: 6, label: isPortuguese ? "Sábado" : "Saturday" },
  ];

  const handleCreateReport = () => {
    if (!newReport.name) return;

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      frequency: newReport.frequency as "daily" | "weekly" | "monthly",
      dayOfWeek: newReport.dayOfWeek,
      dayOfMonth: newReport.dayOfMonth,
      time: newReport.time || "09:00",
      recipients: newReport.recipients || [],
      includeMetrics: newReport.includeMetrics || false,
      includeTrends: newReport.includeTrends || false,
      includeRecommendations: newReport.includeRecommendations || false,
      enabled: true,
    };

    setReports(prev => [...prev, report]);
    setShowCreateForm(false);
    setNewReport({
      name: "",
      frequency: "weekly",
      dayOfWeek: 1,
      time: "09:00",
      recipients: [user?.email || ""],
      includeMetrics: true,
      includeTrends: true,
      includeRecommendations: false,
      enabled: true,
    });
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleReport = (id: string) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const getFrequencyLabel = (report: ScheduledReport) => {
    switch (report.frequency) {
      case "daily":
        return isPortuguese ? `Diariamente às ${report.time}` : `Daily at ${report.time}`;
      case "weekly":
        const day = dayOfWeekOptions.find(d => d.value === report.dayOfWeek)?.label;
        return isPortuguese 
          ? `Toda ${day} às ${report.time}` 
          : `Every ${day} at ${report.time}`;
      case "monthly":
        return isPortuguese 
          ? `Dia ${report.dayOfMonth} de cada mês às ${report.time}` 
          : `Day ${report.dayOfMonth} of each month at ${report.time}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isPortuguese ? "Relatórios Agendados" : "Scheduled Reports"}
          </h1>
          <p className="text-slate-600 mt-1">
            {isPortuguese 
              ? "Configure envio automático de relatórios por email"
              : "Configure automatic report delivery by email"}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          {isPortuguese ? "Novo Agendamento" : "New Schedule"}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle>{isPortuguese ? "Criar Novo Agendamento" : "Create New Schedule"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                {isPortuguese ? "Nome do Relatório" : "Report Name"}
              </label>
              <input
                type="text"
                value={newReport.name}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                placeholder={isPortuguese ? "Ex: Relatório Semanal de Manutenção" : "Ex: Weekly Maintenance Report"}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  {isPortuguese ? "Frequência" : "Frequency"}
                </label>
                <select
                  value={newReport.frequency}
                  onChange={(e) => setNewReport(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {newReport.frequency === "weekly" && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    {isPortuguese ? "Dia da Semana" : "Day of Week"}
                  </label>
                  <select
                    value={newReport.dayOfWeek}
                    onChange={(e) => setNewReport(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dayOfWeekOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {newReport.frequency === "monthly" && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    {isPortuguese ? "Dia do Mês" : "Day of Month"}
                  </label>
                  <select
                    value={newReport.dayOfMonth}
                    onChange={(e) => setNewReport(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  {isPortuguese ? "Horário" : "Time"}
                </label>
                <input
                  type="time"
                  value={newReport.time}
                  onChange={(e) => setNewReport(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                {isPortuguese ? "Destinatários (emails separados por vírgula)" : "Recipients (comma-separated emails)"}
              </label>
              <input
                type="text"
                value={newReport.recipients?.join(", ")}
                onChange={(e) => setNewReport(prev => ({ 
                  ...prev, 
                  recipients: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                }))}
                placeholder="email@example.com, outro@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 block">
                {isPortuguese ? "Conteúdo do Relatório" : "Report Content"}
              </label>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span>{isPortuguese ? "Métricas e Estatísticas" : "Metrics and Statistics"}</span>
                </div>
                <Switch
                  checked={newReport.includeMetrics}
                  onCheckedChange={(checked) => setNewReport(prev => ({ ...prev, includeMetrics: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>{isPortuguese ? "Análise de Tendências" : "Trend Analysis"}</span>
                </div>
                <Switch
                  checked={newReport.includeTrends}
                  onCheckedChange={(checked) => setNewReport(prev => ({ ...prev, includeTrends: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span>{isPortuguese ? "Recomendações" : "Recommendations"}</span>
                </div>
                <Switch
                  checked={newReport.includeRecommendations}
                  onCheckedChange={(checked) => setNewReport(prev => ({ ...prev, includeRecommendations: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700">
                {isPortuguese ? "Criar Agendamento" : "Create Schedule"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                {isPortuguese ? "Cancelar" : "Cancel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {isPortuguese ? "Agendamentos Ativos" : "Active Schedules"} ({reports.length})
        </h2>

        {reports.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {isPortuguese ? "Nenhum agendamento" : "No schedules"}
              </h3>
              <p className="text-slate-600 text-center mb-6">
                {isPortuguese 
                  ? "Crie seu primeiro agendamento de relatório"
                  : "Create your first report schedule"}
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                {isPortuguese ? "Criar Agendamento" : "Create Schedule"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map(report => (
              <Card key={report.id} className={!report.enabled ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.enabled ? "bg-blue-100" : "bg-slate-100"}`}>
                        <FileText className={`w-6 h-6 ${report.enabled ? "text-blue-600" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{report.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{getFrequencyLabel(report)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{report.recipients.join(", ")}</span>
                        </div>
                        {report.lastSent && (
                          <p className="text-xs text-slate-500 mt-2">
                            {isPortuguese ? "Último envio:" : "Last sent:"}{" "}
                            {new Date(report.lastSent).toLocaleDateString(language)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={report.enabled}
                        onCheckedChange={() => handleToggleReport(report.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Tags */}
                  <div className="flex gap-2 mt-4">
                    {report.includeMetrics && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {isPortuguese ? "Métricas" : "Metrics"}
                      </span>
                    )}
                    {report.includeTrends && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {isPortuguese ? "Tendências" : "Trends"}
                      </span>
                    )}
                    {report.includeRecommendations && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {isPortuguese ? "Recomendações" : "Recommendations"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
