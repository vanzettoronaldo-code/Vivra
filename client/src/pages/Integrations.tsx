import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Plug, 
  CheckCircle, 
  XCircle, 
  Settings, 
  ExternalLink,
  RefreshCw,
  Database,
  BarChart3,
  Activity,
  Cloud,
  Zap
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "pending";
  category: "monitoring" | "analytics" | "storage" | "automation";
  lastSync?: Date;
  apiKey?: string;
  endpoint?: string;
}

export default function Integrations() {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "grafana",
      name: "Grafana",
      description: "Visualização de métricas e dashboards de monitoramento",
      descriptionEn: "Metrics visualization and monitoring dashboards",
      icon: <BarChart3 className="w-6 h-6" />,
      status: "disconnected",
      category: "monitoring",
    },
    {
      id: "datadog",
      name: "Datadog",
      description: "Monitoramento de infraestrutura e APM",
      descriptionEn: "Infrastructure monitoring and APM",
      icon: <Activity className="w-6 h-6" />,
      status: "disconnected",
      category: "monitoring",
    },
    {
      id: "prometheus",
      name: "Prometheus",
      description: "Coleta e armazenamento de métricas de sistemas",
      descriptionEn: "System metrics collection and storage",
      icon: <Database className="w-6 h-6" />,
      status: "disconnected",
      category: "monitoring",
    },
    {
      id: "aws-cloudwatch",
      name: "AWS CloudWatch",
      description: "Monitoramento de recursos AWS e logs",
      descriptionEn: "AWS resource monitoring and logs",
      icon: <Cloud className="w-6 h-6" />,
      status: "disconnected",
      category: "monitoring",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automação de workflows e integrações",
      descriptionEn: "Workflow automation and integrations",
      icon: <Zap className="w-6 h-6" />,
      status: "disconnected",
      category: "automation",
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configForm, setConfigForm] = useState({
    apiKey: "",
    endpoint: "",
    syncInterval: "15",
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigForm({
      apiKey: integration.apiKey || "",
      endpoint: integration.endpoint || "",
      syncInterval: "15",
    });
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev =>
      prev.map(i =>
        i.id === selectedIntegration.id
          ? {
              ...i,
              status: "connected" as const,
              apiKey: configForm.apiKey,
              endpoint: configForm.endpoint,
              lastSync: new Date(),
            }
          : i
      )
    );
    setSelectedIntegration(null);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, status: "disconnected" as const, apiKey: undefined, endpoint: undefined }
          : i
      )
    );
  };

  const handleSync = (id: string) => {
    setIntegrations(prev =>
      prev.map(i =>
        i.id === id ? { ...i, lastSync: new Date() } : i
      )
    );
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            {isPortuguese ? "Conectado" : "Connected"}
          </span>
        );
      case "disconnected":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            <XCircle className="w-3 h-3" />
            {isPortuguese ? "Desconectado" : "Disconnected"}
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {isPortuguese ? "Conectando..." : "Connecting..."}
          </span>
        );
    }
  };

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isPortuguese ? "Integrações" : "Integrations"}
        </h1>
        <p className="text-slate-600 mt-1">
          {isPortuguese 
            ? "Conecte sistemas externos para importar dados de monitoramento"
            : "Connect external systems to import monitoring data"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plug className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{integrations.length}</p>
                <p className="text-sm text-slate-600">
                  {isPortuguese ? "Integrações Disponíveis" : "Available Integrations"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{connectedCount}</p>
                <p className="text-sm text-slate-600">
                  {isPortuguese ? "Conectadas" : "Connected"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {integrations.filter(i => i.lastSync).length}
                </p>
                <p className="text-sm text-slate-600">
                  {isPortuguese ? "Sincronizadas Hoje" : "Synced Today"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {isPortuguese ? "Configurar" : "Configure"} {selectedIntegration.name}
            </CardTitle>
            <CardDescription>
              {isPortuguese 
                ? "Insira as credenciais para conectar"
                : "Enter credentials to connect"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                API Key / Token
              </label>
              <input
                type="password"
                value={configForm.apiKey}
                onChange={(e) => setConfigForm(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="sk-xxxxx..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Endpoint URL
              </label>
              <input
                type="url"
                value={configForm.endpoint}
                onChange={(e) => setConfigForm(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://api.example.com/v1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                {isPortuguese ? "Intervalo de Sincronização" : "Sync Interval"}
              </label>
              <select
                value={configForm.syncInterval}
                onChange={(e) => setConfigForm(prev => ({ ...prev, syncInterval: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">{isPortuguese ? "5 minutos" : "5 minutes"}</option>
                <option value="15">{isPortuguese ? "15 minutos" : "15 minutes"}</option>
                <option value="30">{isPortuguese ? "30 minutos" : "30 minutes"}</option>
                <option value="60">{isPortuguese ? "1 hora" : "1 hour"}</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
                {isPortuguese ? "Conectar" : "Connect"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                {isPortuguese ? "Cancelar" : "Cancel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {isPortuguese ? "Sistemas de Monitoramento" : "Monitoring Systems"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {integrations.map(integration => (
            <Card key={integration.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      integration.status === "connected" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"
                    }`}>
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                        {getStatusBadge(integration.status)}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {isPortuguese ? integration.description : integration.descriptionEn}
                      </p>
                      {integration.lastSync && (
                        <p className="text-xs text-slate-500 mt-2">
                          {isPortuguese ? "Última sincronização:" : "Last sync:"}{" "}
                          {new Date(integration.lastSync).toLocaleString(language)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {integration.status === "connected" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        className="gap-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {isPortuguese ? "Sincronizar" : "Sync"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnect(integration)}
                        className="gap-1"
                      >
                        <Settings className="w-4 h-4" />
                        {isPortuguese ? "Configurar" : "Configure"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {isPortuguese ? "Desconectar" : "Disconnect"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration)}
                        className="gap-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plug className="w-4 h-4" />
                        {isPortuguese ? "Conectar" : "Connect"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open(`https://${integration.id}.com`, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {isPortuguese ? "Documentação" : "Documentation"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Import Info */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {isPortuguese ? "Importação de Dados" : "Data Import"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            {isPortuguese 
              ? "Quando conectado, os dados de monitoramento serão automaticamente importados e correlacionados com os registros técnicos dos seus ativos. Isso permite:"
              : "When connected, monitoring data will be automatically imported and correlated with your assets' technical records. This enables:"}
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {isPortuguese 
                ? "Detecção automática de anomalias de desempenho"
                : "Automatic detection of performance anomalies"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {isPortuguese 
                ? "Correlação entre métricas e problemas reportados"
                : "Correlation between metrics and reported problems"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {isPortuguese 
                ? "Alertas proativos baseados em tendências"
                : "Proactive alerts based on trends"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {isPortuguese 
                ? "Relatórios unificados de saúde dos ativos"
                : "Unified asset health reports"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
