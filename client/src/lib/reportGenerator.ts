import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface RecurrentProblem {
  id: string;
  title: string;
  frequency: number;
  lastOccurrence: string;
  asset: string;
  severity: "low" | "medium" | "high";
  trend: "up" | "down" | "stable";
}

interface ReportData {
  companyName: string;
  generatedDate: Date;
  problems: RecurrentProblem[];
  totalOccurrences: number;
  highSeverityCount: number;
  language: "pt-BR" | "en-US";
}

export function generateIntelligenceReport(data: ReportData): void {
  const isPortuguese = data.language === "pt-BR";

  // Create PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Colors
  const primaryColor = [26, 42, 74]; // #1a2a4a
  const accentColor = [0, 212, 212]; // #00d4d4

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("VIVRA", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    isPortuguese ? "Relatório de Inteligência" : "Intelligence Report",
    20,
    35
  );

  yPosition = 55;

  // Company Info
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    isPortuguese ? "Informações do Relatório" : "Report Information",
    20,
    yPosition
  );

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);

  doc.text(
    `${isPortuguese ? "Empresa" : "Company"}: ${data.companyName}`,
    20,
    yPosition
  );
  yPosition += 6;
  doc.text(
    `${isPortuguese ? "Data de Geração" : "Generated Date"}: ${data.generatedDate.toLocaleDateString(
      data.language
    )}`,
    20,
    yPosition
  );

  yPosition += 15;

  // Summary Stats
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    isPortuguese ? "Resumo Executivo" : "Executive Summary",
    20,
    yPosition
  );

  yPosition += 10;

  // Stats boxes
  const stats = [
    {
      label: isPortuguese ? "Problemas Recorrentes" : "Recurrent Problems",
      value: data.problems.length.toString(),
    },
    {
      label: isPortuguese ? "Ocorrências Totais" : "Total Occurrences",
      value: data.totalOccurrences.toString(),
    },
    {
      label: isPortuguese ? "Severidade Alta" : "High Severity",
      value: data.highSeverityCount.toString(),
    },
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);

  stats.forEach((stat, index) => {
    const xPos = 20 + index * 60;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(xPos, yPosition, 50, 20, "S");

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(stat.value, xPos + 25, yPosition + 12, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(stat.label, xPos + 25, yPosition + 18, { align: "center" });
  });

  yPosition += 35;

  // Problems Table
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    isPortuguese ? "Problemas Recorrentes" : "Recurrent Problems",
    20,
    yPosition
  );

  yPosition += 8;

  const tableData = data.problems.map((problem) => [
    problem.title,
    problem.asset,
    problem.frequency.toString(),
    problem.severity === "high"
      ? isPortuguese
        ? "Alta"
        : "High"
      : problem.severity === "medium"
        ? isPortuguese
          ? "Média"
          : "Medium"
        : isPortuguese
          ? "Baixa"
          : "Low",
    new Date(problem.lastOccurrence).toLocaleDateString(data.language),
  ]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [
      [
        isPortuguese ? "Problema" : "Problem",
        isPortuguese ? "Ativo" : "Asset",
        isPortuguese ? "Frequência" : "Frequency",
        isPortuguese ? "Severidade" : "Severity",
        isPortuguese ? "Última Ocorrência" : "Last Occurrence",
      ],
    ],
    body: tableData,
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: [100, 100, 100],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 20, right: 20 },
    columnStyles: {
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Recommendations
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    isPortuguese ? "Recomendações" : "Recommendations",
    20,
    yPosition
  );

  yPosition += 8;

  const recommendations = [
    isPortuguese
      ? "Implementar manutenção preventiva para os problemas de alta severidade"
      : "Implement preventive maintenance for high severity issues",
    isPortuguese
      ? "Aumentar frequência de inspeções para ativos com padrões recorrentes"
      : "Increase inspection frequency for assets with recurrent patterns",
    isPortuguese
      ? "Treinar equipe em procedimentos de manutenção e segurança"
      : "Train team on maintenance and safety procedures",
    isPortuguese
      ? "Configurar alertas automáticos para notificação de padrões recorrentes"
      : "Configure automatic alerts for recurrent pattern notifications",
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);

  recommendations.forEach((rec, index) => {
    const lines = doc.splitTextToSize(rec, pageWidth - 40);
    doc.text(lines, 25, yPosition);
    yPosition += lines.length * 5 + 3;

    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Footer
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${isPortuguese ? "Página" : "Page"} ${i} ${isPortuguese ? "de" : "of"} ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `VIVRA_Relatorio_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
