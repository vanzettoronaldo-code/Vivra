import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { ApprovalDialog } from "@/components/ApprovalDialog";

interface PendingApproval {
  id: number;
  recordTitle: string;
  recordDescription: string;
  assetName: string;
  category: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function ApprovalNotifications() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data - em produção viria do tRPC
  const pendingApprovals: PendingApproval[] = [
    {
      id: 1,
      recordTitle: "Falha crítica no sistema de refrigeração",
      recordDescription: "O sistema de refrigeração apresentou falha total por 2 horas. Necessário reparo urgente.",
      assetName: "Test Asset",
      category: "problem",
      requestedBy: "Ronaldo Vanzetto",
      requestedAt: "2025-12-29 14:30",
      status: "pending",
    },
    {
      id: 2,
      recordTitle: "Decisão de substituição de componente",
      recordDescription: "Decidido substituir o componente X pelo modelo Y para melhor performance.",
      assetName: "janela",
      category: "decision",
      requestedBy: "João Silva",
      requestedAt: "2025-12-29 13:15",
      status: "pending",
    },
  ];

  const handleApprove = (justification: string) => {
    console.log("Aprovado:", selectedApproval?.id, justification);
    setIsDialogOpen(false);
    setSelectedApproval(null);
  };

  const handleReject = (reason: string) => {
    console.log("Rejeitado:", selectedApproval?.id, reason);
    setIsDialogOpen(false);
    setSelectedApproval(null);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "problem":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "decision":
        return "bg-blue-100 text-blue-800";
      case "inspection":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      problem: "Problema",
      maintenance: "Manutenção",
      decision: "Decisão",
      inspection: "Inspeção",
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
          <p className="text-muted-foreground mt-2">Registros aguardando sua revisão</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.filter(a => a.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Aprovados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejeitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Registros para Revisar</h2>
        {pendingApprovals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhuma aprovação pendente</p>
            </CardContent>
          </Card>
        ) : (
          pendingApprovals.map(approval => (
            <Card key={approval.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{approval.recordTitle}</CardTitle>
                    <CardDescription className="mt-1">
                      Ativo: {approval.assetName} • Solicitado por: {approval.requestedBy}
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryBadgeColor(approval.category)}>
                    {getCategoryLabel(approval.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descrição:</p>
                  <p className="text-base">{approval.recordDescription}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Solicitado em: {approval.requestedAt}
                  </span>
                  <Button
                    onClick={() => {
                      setSelectedApproval(approval);
                      setIsDialogOpen(true);
                    }}
                    className="gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Revisar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approval Dialog */}
      {selectedApproval && (
        <ApprovalDialog
          isOpen={isDialogOpen}
          recordTitle={selectedApproval.recordTitle}
          recordDescription={selectedApproval.recordDescription}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedApproval(null);
          }}
        />
      )}
    </div>
  );
}
