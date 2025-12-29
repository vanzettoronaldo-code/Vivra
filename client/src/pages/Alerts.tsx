import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
// DashboardLayout is applied by App.tsx
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Mail, 
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: "recurrence" | "threshold" | "time" | "pattern";
  enabled: boolean;
  threshold?: number;
  timeWindow?: string;
  severity: "low" | "medium" | "high";
  notifyEmail: boolean;
  notifyPush: boolean;
}

export default function Alerts() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";
  
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: isPortuguese ? "Problema Recorrente" : "Recurring Problem",
      description: isPortuguese 
        ? "Alerta quando o mesmo problema ocorre mais de 3 vezes em 30 dias"
        : "Alert when the same problem occurs more than 3 times in 30 days",
      type: "recurrence",
      enabled: true,
      threshold: 3,
      timeWindow: "30d",
      severity: "high",
      notifyEmail: true,
      notifyPush: true,
    },
    {
      id: "2",
      name: isPortuguese ? "Aumento de Falhas" : "Failure Increase",
      description: isPortuguese 
        ? "Alerta quando há aumento de 50% nas falhas em relação ao mês anterior"
        : "Alert when there is a 50% increase in failures compared to the previous month",
      type: "threshold",
      enabled: true,
      threshold: 50,
      severity: "medium",
      notifyEmail: true,
      notifyPush: false,
    },
    {
      id: "3",
      name: isPortuguese ? "Manutenção Atrasada" : "Overdue Maintenance",
      description: isPortuguese 
        ? "Alerta quando uma manutenção programada está atrasada há mais de 7 dias"
        : "Alert when a scheduled maintenance is overdue by more than 7 days",
      type: "time",
      enabled: true,
      timeWindow: "7d",
      severity: "medium",
      notifyEmail: true,
      notifyPush: true,
    },
    {
      id: "4",
      name: isPortuguese ? "Padrão de Vazamento" : "Leak Pattern",
      description: isPortuguese 
        ? "Alerta quando detecta padrão de vazamentos em múltiplos ativos"
        : "Alert when detecting leak patterns across multiple assets",
      type: "pattern",
      enabled: false,
      severity: "high",
      notifyEmail: true,
      notifyPush: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: "",
    description: "",
    type: "threshold",
    enabled: true,
    threshold: 10,
    severity: "medium",
    notifyEmail: true,
    notifyPush: false,
  });

  const toggleRule = (id: string) => {
    setAlertRules(rules => 
      rules.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    setAlertRules(rules => rules.filter(rule => rule.id !== id));
  };

  const addNewRule = () => {
    if (!newRule.name) return;
    
    const rule: AlertRule = {
      id: Date.now().toString(),
      name: newRule.name || "",
      description: newRule.description || "",
      type: newRule.type || "threshold",
      enabled: true,
      threshold: newRule.threshold,
      timeWindow: newRule.timeWindow,
      severity: newRule.severity || "medium",
      notifyEmail: newRule.notifyEmail || false,
      notifyPush: newRule.notifyPush || false,
    };
    
    setAlertRules([...alertRules, rule]);
    setShowNewRule(false);
    setNewRule({
      name: "",
      description: "",
      type: "threshold",
      enabled: true,
      threshold: 10,
      severity: "medium",
      notifyEmail: true,
      notifyPush: false,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-yellow-500 bg-yellow-50";
      case "low": return "text-blue-500 bg-blue-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <AlertCircle className="w-4 h-4" />;
      case "low": return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recurrence": return <TrendingUp className="w-5 h-5" />;
      case "threshold": return <AlertTriangle className="w-5 h-5" />;
      case "time": return <Clock className="w-5 h-5" />;
      case "pattern": return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const activeRules = alertRules.filter(r => r.enabled).length;
  const highSeverityRules = alertRules.filter(r => r.severity === "high" && r.enabled).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isPortuguese ? "Configuração de Alertas" : "Alert Configuration"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isPortuguese 
                ? "Configure regras de alerta e thresholds personalizados"
                : "Configure alert rules and custom thresholds"}
            </p>
          </div>
          <Button onClick={() => setShowNewRule(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {isPortuguese ? "Nova Regra" : "New Rule"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alertRules.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPortuguese ? "Regras Totais" : "Total Rules"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeRules}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPortuguese ? "Regras Ativas" : "Active Rules"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highSeverityRules}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPortuguese ? "Alta Severidade" : "High Severity"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {alertRules.filter(r => r.notifyEmail && r.enabled).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPortuguese ? "Com Email" : "With Email"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Rule Form */}
        {showNewRule && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {isPortuguese ? "Nova Regra de Alerta" : "New Alert Rule"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {isPortuguese ? "Nome da Regra" : "Rule Name"}
                  </label>
                  <input
                    type="text"
                    value={newRule.name || ""}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={isPortuguese ? "Ex: Alerta de Temperatura" : "Ex: Temperature Alert"}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {isPortuguese ? "Tipo" : "Type"}
                  </label>
                  <select
                    value={newRule.type || "threshold"}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="threshold">{isPortuguese ? "Threshold" : "Threshold"}</option>
                    <option value="recurrence">{isPortuguese ? "Recorrência" : "Recurrence"}</option>
                    <option value="time">{isPortuguese ? "Tempo" : "Time"}</option>
                    <option value="pattern">{isPortuguese ? "Padrão" : "Pattern"}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">
                  {isPortuguese ? "Descrição" : "Description"}
                </label>
                <textarea
                  value={newRule.description || ""}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder={isPortuguese ? "Descreva quando o alerta deve ser disparado" : "Describe when the alert should be triggered"}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {isPortuguese ? "Threshold" : "Threshold"}
                  </label>
                  <input
                    type="number"
                    value={newRule.threshold || ""}
                    onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {isPortuguese ? "Severidade" : "Severity"}
                  </label>
                  <select
                    value={newRule.severity || "medium"}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">{isPortuguese ? "Baixa" : "Low"}</option>
                    <option value="medium">{isPortuguese ? "Média" : "Medium"}</option>
                    <option value="high">{isPortuguese ? "Alta" : "High"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {isPortuguese ? "Janela de Tempo" : "Time Window"}
                  </label>
                  <select
                    value={newRule.timeWindow || "7d"}
                    onChange={(e) => setNewRule({ ...newRule, timeWindow: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1d">{isPortuguese ? "1 dia" : "1 day"}</option>
                    <option value="7d">{isPortuguese ? "7 dias" : "7 days"}</option>
                    <option value="30d">{isPortuguese ? "30 dias" : "30 days"}</option>
                    <option value="90d">{isPortuguese ? "90 dias" : "90 days"}</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRule.notifyEmail}
                    onChange={(e) => setNewRule({ ...newRule, notifyEmail: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{isPortuguese ? "Notificar por Email" : "Notify by Email"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRule.notifyPush}
                    onChange={(e) => setNewRule({ ...newRule, notifyPush: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">{isPortuguese ? "Notificação Push" : "Push Notification"}</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewRule(false)}>
                  <X className="w-4 h-4 mr-2" />
                  {isPortuguese ? "Cancelar" : "Cancel"}
                </Button>
                <Button onClick={addNewRule}>
                  <Save className="w-4 h-4 mr-2" />
                  {isPortuguese ? "Salvar Regra" : "Save Rule"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert Rules List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {isPortuguese ? "Regras de Alerta" : "Alert Rules"}
          </h2>
          
          {alertRules.map((rule) => (
            <Card key={rule.id} className={`transition-opacity ${!rule.enabled ? "opacity-60" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${getSeverityColor(rule.severity)}`}>
                      {getTypeIcon(rule.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getSeverityColor(rule.severity)}`}>
                          {getSeverityIcon(rule.severity)}
                          {rule.severity === "high" 
                            ? (isPortuguese ? "Alta" : "High")
                            : rule.severity === "medium"
                            ? (isPortuguese ? "Média" : "Medium")
                            : (isPortuguese ? "Baixa" : "Low")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {rule.threshold && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Threshold: {rule.threshold}
                          </span>
                        )}
                        {rule.timeWindow && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {rule.timeWindow}
                          </span>
                        )}
                        {rule.notifyEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Email
                          </span>
                        )}
                        {rule.notifyPush && (
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-4 h-4" />
                            Push
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  {isPortuguese ? "Como funcionam os alertas" : "How alerts work"}
                </h3>
                <p className="text-sm text-blue-800">
                  {isPortuguese 
                    ? "Os alertas são verificados automaticamente a cada hora. Quando uma regra é acionada, você receberá uma notificação pelos canais configurados (email e/ou push). Você pode ajustar os thresholds e janelas de tempo para cada regra de acordo com suas necessidades."
                    : "Alerts are automatically checked every hour. When a rule is triggered, you will receive a notification through the configured channels (email and/or push). You can adjust the thresholds and time windows for each rule according to your needs."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
