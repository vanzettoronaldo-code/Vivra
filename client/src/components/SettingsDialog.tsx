import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [approvalSettings, setApprovalSettings] = useState({
    criticalSeverity: true,
    importantDecisions: true,
    highSeverity: true,
    autoNotifyAdmins: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newRecords: true,
    criticalProblems: true,
    weeklySummary: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch user preferences on dialog open
  const { data: preferences, isLoading } = trpc.user.getPreferences.useQuery(
    undefined,
    { enabled: open }
  );

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setApprovalSettings({
        criticalSeverity: preferences.approvalPrefCriticalRecords,
        importantDecisions: preferences.approvalPrefImportantDecisions,
        highSeverity: preferences.approvalPrefHighSeverity,
        autoNotifyAdmins: preferences.approvalPrefAutoNotify,
      });
      setNotificationSettings({
        newRecords: preferences.notifPrefNewRecords,
        criticalProblems: preferences.notifPrefCriticalProblems,
        weeklySummary: preferences.notifPrefWeeklySummary,
      });
    }
  }, [preferences]);

  // Mutation for updating preferences
  const updatePreferencesMutation = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const translations = {
    "pt-BR": {
      settings: "Configurações",
      profile: "Perfil",
      approvals: "Aprovações",
      notifications: "Notificações",
      name: "Nome",
      email: "Email",
      saveProfile: "Salvar Perfil",
      approvalSettings: "Configurações de Aprovação",
      criticalRecords: "Registros Críticos",
      criticalRecordsDesc: "Requer aprovação para problemas com severidade crítica",
      importantDecisions: "Decisões Importantes",
      importantDecisionsDesc: "Requer aprovação para todos os registros de decisão",
      highSeverity: "Alta Severidade",
      highSeverityDesc: "Requer aprovação para problemas de alta severidade",
      autoNotify: "Notificações Automáticas",
      autoNotifyDesc: "Notificar administradores quando houver registros pendentes",
      notificationPreferences: "Preferências de Notificação",
      newRecordsNotif: "Novos Registros",
      newRecordsDesc: "Receber notificação quando novos registros forem criados",
      criticalProblems: "Problemas Críticos",
      criticalProblemsDesc: "Alertas para problemas de alta severidade",
      weeklySummary: "Resumo Semanal",
      weeklySummaryDesc: "Receber um resumo semanal por email",
      saveSettings: "Salvar Configurações",
      loading: "Carregando...",
      saving: "Salvando...",
    },
    "en-US": {
      settings: "Settings",
      profile: "Profile",
      approvals: "Approvals",
      notifications: "Notifications",
      name: "Name",
      email: "Email",
      saveProfile: "Save Profile",
      approvalSettings: "Approval Settings",
      criticalRecords: "Critical Records",
      criticalRecordsDesc: "Require approval for problems with critical severity",
      importantDecisions: "Important Decisions",
      importantDecisionsDesc: "Require approval for all decision records",
      highSeverity: "High Severity",
      highSeverityDesc: "Require approval for high severity problems",
      autoNotify: "Automatic Notifications",
      autoNotifyDesc: "Notify administrators when there are pending records",
      notificationPreferences: "Notification Preferences",
      newRecordsNotif: "New Records",
      newRecordsDesc: "Receive notification when new records are created",
      criticalProblems: "Critical Problems",
      criticalProblemsDesc: "Alerts for high severity problems",
      weeklySummary: "Weekly Summary",
      weeklySummaryDesc: "Receive a weekly summary by email",
      saveSettings: "Save Settings",
      loading: "Loading...",
      saving: "Saving...",
    },
  };

  const t = translations[language as keyof typeof translations] || translations["pt-BR"];

  const handleSaveApprovalSettings = async () => {
    setIsSaving(true);
    await updatePreferencesMutation.mutateAsync({
      approvalPrefCriticalRecords: approvalSettings.criticalSeverity,
      approvalPrefImportantDecisions: approvalSettings.importantDecisions,
      approvalPrefHighSeverity: approvalSettings.highSeverity,
      approvalPrefAutoNotify: approvalSettings.autoNotifyAdmins,
    });
  };

  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    await updatePreferencesMutation.mutateAsync({
      notifPrefNewRecords: notificationSettings.newRecords,
      notifPrefCriticalProblems: notificationSettings.criticalProblems,
      notifPrefWeeklySummary: notificationSettings.weeklySummary,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.settings}</DialogTitle>
          <DialogDescription>
            {language === "pt-BR" 
              ? "Gerencie suas preferências e configurações de conta"
              : "Manage your preferences and account settings"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
            <TabsTrigger value="approvals">{t.approvals}</TabsTrigger>
            <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="mt-2"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="mt-2"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "pt-BR"
                  ? "Informações de perfil são gerenciadas através da sua conta Manus"
                  : "Profile information is managed through your Manus account"}
              </p>
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-4">
                {t.loading}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold">{t.approvalSettings}</h3>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="critical"
                    checked={approvalSettings.criticalSeverity}
                    onCheckedChange={(checked) =>
                      setApprovalSettings({
                        ...approvalSettings,
                        criticalSeverity: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="critical" className="font-medium cursor-pointer">
                      {t.criticalRecords}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.criticalRecordsDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="decisions"
                    checked={approvalSettings.importantDecisions}
                    onCheckedChange={(checked) =>
                      setApprovalSettings({
                        ...approvalSettings,
                        importantDecisions: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="decisions" className="font-medium cursor-pointer">
                      {t.importantDecisions}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.importantDecisionsDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="high-severity"
                    checked={approvalSettings.highSeverity}
                    onCheckedChange={(checked) =>
                      setApprovalSettings({
                        ...approvalSettings,
                        highSeverity: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="high-severity" className="font-medium cursor-pointer">
                      {t.highSeverity}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.highSeverityDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="auto-notify"
                    checked={approvalSettings.autoNotifyAdmins}
                    onCheckedChange={(checked) =>
                      setApprovalSettings({
                        ...approvalSettings,
                        autoNotifyAdmins: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="auto-notify" className="font-medium cursor-pointer">
                      {t.autoNotify}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.autoNotifyDesc}
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSaveApprovalSettings}
                  disabled={isSaving}
                >
                  {isSaving ? t.saving : t.saveSettings}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-4">
                {t.loading}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold">{t.notificationPreferences}</h3>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="new-records"
                    checked={notificationSettings.newRecords}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newRecords: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="new-records" className="font-medium cursor-pointer">
                      {t.newRecordsNotif}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.newRecordsDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="critical-problems"
                    checked={notificationSettings.criticalProblems}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        criticalProblems: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="critical-problems" className="font-medium cursor-pointer">
                      {t.criticalProblems}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.criticalProblemsDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="weekly-summary"
                    checked={notificationSettings.weeklySummary}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        weeklySummary: checked as boolean,
                      })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="weekly-summary" className="font-medium cursor-pointer">
                      {t.weeklySummary}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.weeklySummaryDesc}
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSaveNotificationSettings}
                  disabled={isSaving}
                >
                  {isSaving ? t.saving : t.saveSettings}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
