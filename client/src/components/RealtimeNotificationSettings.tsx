import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, RefreshCw, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationSettings {
  enableRealtime: boolean;
  alertsEnabled: boolean;
  recurrentPatternsEnabled: boolean;
  approvalsEnabled: boolean;
  pollingInterval: number;
}

interface RealtimeNotificationSettingsProps {
  onRefresh?: () => void;
  isPolling?: boolean;
}

export default function RealtimeNotificationSettings({ onRefresh, isPolling }: RealtimeNotificationSettingsProps) {
  const { language } = useLanguage();
  const isPortuguese = language === "pt-BR";

  const [settings, setSettings] = useState<NotificationSettings>({
    enableRealtime: true,
    alertsEnabled: true,
    recurrentPatternsEnabled: true,
    approvalsEnabled: true,
    pollingInterval: 30000,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          {isPortuguese ? "Notificações em Tempo Real" : "Real-time Notifications"}
        </CardTitle>
        <CardDescription>
          {isPortuguese 
            ? "Configure alertas automáticos para eventos importantes"
            : "Configure automatic alerts for important events"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            {isPolling ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="font-medium">
              {isPolling 
                ? (isPortuguese ? "Monitoramento Ativo" : "Monitoring Active")
                : (isPortuguese ? "Monitoramento Pausado" : "Monitoring Paused")}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isPortuguese ? "Atualizar" : "Refresh"}
          </Button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">
                  {isPortuguese ? "Alertas de Sistema" : "System Alerts"}
                </p>
                <p className="text-sm text-slate-500">
                  {isPortuguese 
                    ? "Receba notificações de alertas críticos"
                    : "Receive notifications for critical alerts"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.alertsEnabled}
              onCheckedChange={(checked) => updateSetting("alertsEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">
                  {isPortuguese ? "Padrões Recorrentes" : "Recurrent Patterns"}
                </p>
                <p className="text-sm text-slate-500">
                  {isPortuguese 
                    ? "Alertas quando problemas se repetem"
                    : "Alerts when problems repeat"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.recurrentPatternsEnabled}
              onCheckedChange={(checked) => updateSetting("recurrentPatternsEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">
                  {isPortuguese ? "Aprovações Pendentes" : "Pending Approvals"}
                </p>
                <p className="text-sm text-slate-500">
                  {isPortuguese 
                    ? "Notificações de itens aguardando aprovação"
                    : "Notifications for items awaiting approval"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.approvalsEnabled}
              onCheckedChange={(checked) => updateSetting("approvalsEnabled", checked)}
            />
          </div>
        </div>

        {/* Polling Interval */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            {isPortuguese ? "Intervalo de Verificação" : "Check Interval"}
          </label>
          <select
            value={settings.pollingInterval}
            onChange={(e) => updateSetting("pollingInterval", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={15000}>{isPortuguese ? "15 segundos" : "15 seconds"}</option>
            <option value={30000}>{isPortuguese ? "30 segundos" : "30 seconds"}</option>
            <option value={60000}>{isPortuguese ? "1 minuto" : "1 minute"}</option>
            <option value={300000}>{isPortuguese ? "5 minutos" : "5 minutes"}</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
