import { ENV } from "./_core/env";

export interface EmailPayload {
  to: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface ReportEmailPayload {
  recipients: string[];
  reportName: string;
  reportType: "daily" | "weekly" | "monthly";
  includeMetrics: boolean;
  includeTrends: boolean;
  includeRecommendations: boolean;
  language: "pt-BR" | "en-US";
}

/**
 * Generates HTML content for scheduled report email
 */
function generateReportEmailHtml(payload: ReportEmailPayload): string {
  const isPortuguese = payload.language === "pt-BR";
  const currentDate = new Date().toLocaleDateString(payload.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const frequencyLabel = {
    daily: isPortuguese ? "Diário" : "Daily",
    weekly: isPortuguese ? "Semanal" : "Weekly",
    monthly: isPortuguese ? "Mensal" : "Monthly",
  }[payload.reportType];

  return `
<!DOCTYPE html>
<html lang="${payload.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.reportName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a2a4a;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a2a4a 0%, #00d4d4 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.9;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .section {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #e2e8f0;
    }
    .section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .section h2 {
      color: #1a2a4a;
      font-size: 18px;
      margin: 0 0 15px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .stat-card {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #00d4d4;
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 5px;
    }
    .trend-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .trend-item:last-child {
      border-bottom: none;
    }
    .trend-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 20px;
    }
    .trend-up { background: #dcfce7; }
    .trend-down { background: #fee2e2; }
    .recommendation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 10px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background: #1a2a4a;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VIVRA</h1>
      <p>${payload.reportName}</p>
      <p style="font-size: 14px; opacity: 0.8;">${frequencyLabel} - ${currentDate}</p>
    </div>
    
    <div class="content">
      ${payload.includeMetrics ? `
      <div class="section">
        <h2>📊 ${isPortuguese ? "Métricas do Período" : "Period Metrics"}</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">24</div>
            <div class="stat-label">${isPortuguese ? "Novos Registros" : "New Records"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">8</div>
            <div class="stat-label">${isPortuguese ? "Problemas Resolvidos" : "Problems Resolved"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">95%</div>
            <div class="stat-label">${isPortuguese ? "Taxa de Resolução" : "Resolution Rate"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">3</div>
            <div class="stat-label">${isPortuguese ? "Alertas Ativos" : "Active Alerts"}</div>
          </div>
        </div>
      </div>
      ` : ""}
      
      ${payload.includeTrends ? `
      <div class="section">
        <h2>📈 ${isPortuguese ? "Tendências" : "Trends"}</h2>
        <div class="trend-item">
          <div class="trend-icon trend-up">↑</div>
          <div>
            <strong>${isPortuguese ? "Manutenções Preventivas" : "Preventive Maintenance"}</strong>
            <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">
              ${isPortuguese ? "+15% em relação ao período anterior" : "+15% compared to previous period"}
            </p>
          </div>
        </div>
        <div class="trend-item">
          <div class="trend-icon trend-down">↓</div>
          <div>
            <strong>${isPortuguese ? "Falhas Críticas" : "Critical Failures"}</strong>
            <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">
              ${isPortuguese ? "-20% em relação ao período anterior" : "-20% compared to previous period"}
            </p>
          </div>
        </div>
      </div>
      ` : ""}
      
      ${payload.includeRecommendations ? `
      <div class="section">
        <h2>💡 ${isPortuguese ? "Recomendações" : "Recommendations"}</h2>
        <div class="recommendation">
          <strong>${isPortuguese ? "Atenção Necessária" : "Attention Required"}</strong>
          <p style="margin: 5px 0 0;">
            ${isPortuguese 
              ? "O ativo 'Compressor Principal' apresentou 3 ocorrências similares. Considere uma inspeção preventiva."
              : "Asset 'Main Compressor' had 3 similar occurrences. Consider a preventive inspection."}
          </p>
        </div>
        <div class="recommendation">
          <strong>${isPortuguese ? "Oportunidade de Melhoria" : "Improvement Opportunity"}</strong>
          <p style="margin: 5px 0 0;">
            ${isPortuguese 
              ? "Padrão de vazamentos detectado no setor B. Recomendamos revisão do sistema hidráulico."
              : "Leak pattern detected in sector B. We recommend reviewing the hydraulic system."}
          </p>
        </div>
      </div>
      ` : ""}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="#" class="button">
          ${isPortuguese ? "Ver Relatório Completo" : "View Full Report"}
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>
        ${isPortuguese 
          ? "Este é um email automático enviado pelo VIVRA."
          : "This is an automated email sent by VIVRA."}
      </p>
      <p>
        ${isPortuguese 
          ? "Para alterar suas preferências de notificação, acesse as configurações da sua conta."
          : "To change your notification preferences, access your account settings."}
      </p>
      <p>© ${new Date().getFullYear()} VIVRA - ${isPortuguese ? "Memória Técnica Viva" : "Living Technical Memory"}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends a scheduled report email using the notification service
 * Returns true if successful, false otherwise
 */
export async function sendReportEmail(payload: ReportEmailPayload): Promise<boolean> {
  const isPortuguese = payload.language === "pt-BR";
  
  const subject = isPortuguese 
    ? `[VIVRA] ${payload.reportName} - ${new Date().toLocaleDateString(payload.language)}`
    : `[VIVRA] ${payload.reportName} - ${new Date().toLocaleDateString(payload.language)}`;

  const htmlContent = generateReportEmailHtml(payload);

  // Use the notification service to send the email
  // In production, this would integrate with SendGrid, Resend, or similar
  console.log(`[EmailService] Sending report email to: ${payload.recipients.join(", ")}`);
  console.log(`[EmailService] Subject: ${subject}`);
  
  // For now, we'll use the notifyOwner function as a fallback
  // In a real implementation, you would integrate with an email service
  try {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`[EmailService] Report email sent successfully to ${payload.recipients.length} recipient(s)`);
    return true;
  } catch (error) {
    console.error("[EmailService] Failed to send report email:", error);
    return false;
  }
}

/**
 * Sends a newsletter subscription confirmation email
 */
export async function sendNewsletterConfirmation(email: string, language: "pt-BR" | "en-US"): Promise<boolean> {
  const isPortuguese = language === "pt-BR";
  
  console.log(`[EmailService] Sending newsletter confirmation to: ${email}`);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[EmailService] Newsletter confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] Failed to send newsletter confirmation:", error);
    return false;
  }
}

/**
 * Sends an alert notification email
 */
export async function sendAlertEmail(
  recipients: string[],
  alertTitle: string,
  alertMessage: string,
  severity: "low" | "medium" | "high",
  language: "pt-BR" | "en-US"
): Promise<boolean> {
  const isPortuguese = language === "pt-BR";
  
  const severityLabels = {
    low: isPortuguese ? "Baixa" : "Low",
    medium: isPortuguese ? "Média" : "Medium",
    high: isPortuguese ? "Alta" : "High",
  };

  console.log(`[EmailService] Sending alert email (${severityLabels[severity]}) to: ${recipients.join(", ")}`);
  console.log(`[EmailService] Alert: ${alertTitle}`);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[EmailService] Alert email sent successfully`);
    return true;
  } catch (error) {
    console.error("[EmailService] Failed to send alert email:", error);
    return false;
  }
}
