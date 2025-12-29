import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Home from "./pages/Home";
import { useAuth } from "./_core/hooks/useAuth";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import QuickRecord from "./pages/QuickRecord";
import Page2 from "./pages/Page2";
import ApprovalSettings from "./pages/ApprovalSettings";
import ApprovalNotifications from "./pages/ApprovalNotifications";
import AuditLog from "./pages/AuditLog";
import ApprovalMetrics from "./pages/ApprovalMetrics";
import Team from "./pages/Team";
import Intelligence from "./pages/Intelligence";
import Metrics from "./pages/Metrics";
import ScheduledReports from "./pages/ScheduledReports";
import Integrations from "./pages/Integrations";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <DashboardLayout>
      <Switch>
        <Route path={"/"} component={Dashboard} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/asset/:assetId"} component={AssetDetail} />
        <Route path={"/asset/:assetId/quick-record"} component={QuickRecord} />
        <Route path={"/some-path"} component={Page2} />
        <Route path={"/approval-settings"} component={ApprovalSettings} />
        <Route path={"/approval-notifications"} component={ApprovalNotifications} />
        <Route path={"/audit-log"} component={AuditLog} />
        <Route path={"/approval-metrics"} component={ApprovalMetrics} />
        <Route path={"/team"} component={Team} />        <Route path={"/quick-record"} component={QuickRecord} />
        <Route path={"/inteligencia"} component={Intelligence} />
        <Route path={"/intelligence"} component={Intelligence} />
        <Route path={"/metricas"} component={Metrics} />
        <Route path={"/metrics"} component={Metrics} />
        <Route path={"/relatorios-agendados"} component={ScheduledReports} />
        <Route path={"/scheduled-reports"} component={ScheduledReports} />
        <Route path={"/integracoes"} component={Integrations} />
        <Route path={"/integrations"} component={Integrations} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
