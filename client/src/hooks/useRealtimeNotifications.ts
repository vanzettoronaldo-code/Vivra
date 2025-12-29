import { useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/_core/hooks/useAuth";

interface RealtimeNotificationConfig {
  enabled?: boolean;
  pollingInterval?: number; // in milliseconds
}

export function useRealtimeNotifications(config: RealtimeNotificationConfig = {}) {
  const { enabled = true, pollingInterval = 30000 } = config; // Default: 30 seconds
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const lastCheckRef = useRef<Date>(new Date());
  const processedIdsRef = useRef<Set<string>>(new Set());

  // Query for new alerts
  const { data: alerts, refetch: refetchAlerts } = trpc.alert.list.useQuery(
    { unreadOnly: true },
    { enabled: isAuthenticated && enabled, refetchInterval: pollingInterval }
  );

  // Query for recurrent problems
  const { data: recurrentProblems, refetch: refetchProblems } = trpc.intelligence.getRecurrentProblems.useQuery(
    undefined,
    { enabled: isAuthenticated && enabled, refetchInterval: pollingInterval * 2 }
  );

  // Process new alerts
  useEffect(() => {
    if (!alerts || !enabled) return;

    alerts.forEach((alert: any) => {
      const alertId = `alert-${alert.id}`;
      if (!processedIdsRef.current.has(alertId)) {
        processedIdsRef.current.add(alertId);
        
        // Only show notification for recent alerts (within last polling interval)
        const alertDate = new Date(alert.createdAt);
        if (alertDate > lastCheckRef.current) {
          addNotification({
            type: alert.severity === "high" ? "error" : alert.severity === "medium" ? "warning" : "info",
            title: alert.title,
            message: alert.message || "Novo alerta detectado",
            actionUrl: `/inteligencia`,
          });
        }
      }
    });

    lastCheckRef.current = new Date();
  }, [alerts, enabled, addNotification]);

  // Process recurrent problems (detect new patterns)
  useEffect(() => {
    if (!recurrentProblems || !enabled) return;

    recurrentProblems.forEach((problem: any) => {
      const problemId = `problem-${problem.id}`;
      // Only notify for high frequency problems
      if (problem.frequency >= 3 && !processedIdsRef.current.has(problemId)) {
        processedIdsRef.current.add(problemId);
        
        addNotification({
          type: "warning",
          title: "Padrão Recorrente Detectado",
          message: `"${problem.title}" ocorreu ${problem.frequency} vezes`,
          actionUrl: `/inteligencia`,
        });
      }
    });
  }, [recurrentProblems, enabled, addNotification]);

  // Manual refresh function
  const refresh = useCallback(() => {
    refetchAlerts();
    refetchProblems();
  }, [refetchAlerts, refetchProblems]);

  return {
    refresh,
    isPolling: enabled && isAuthenticated,
  };
}
