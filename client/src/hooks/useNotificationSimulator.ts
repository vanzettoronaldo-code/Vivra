import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";

export function useNotificationSimulator() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Simular notificações de aprovação a cada 30 segundos
    const approvalInterval = setInterval(() => {
      const approvalMessages = [
        {
          title: "Aprovação Pendente",
          message: "Novo registro aguarda sua revisão",
          type: "info" as const,
          actionUrl: "/approval-notifications",
        },
        {
          title: "Problema Recorrente Detectado",
          message: "Falha no sistema de refrigeração detectada 3 vezes",
          type: "warning" as const,
          actionUrl: "/approval-metrics",
        },
        {
          title: "Registro Aprovado",
          message: "Seu registro foi aprovado com sucesso",
          type: "success" as const,
        },
      ];

      const randomMessage = approvalMessages[Math.floor(Math.random() * approvalMessages.length)];
      addNotification(randomMessage);
    }, 30000);

    // Simular primeira notificação após 3 segundos
    const initialTimeout = setTimeout(() => {
      addNotification({
        title: "Bem-vindo ao VIVRA",
        message: "Sistema de notificações em tempo real ativado",
        type: "success",
      });
    }, 3000);

    return () => {
      clearInterval(approvalInterval);
      clearTimeout(initialTimeout);
    };
  }, [addNotification]);
}
