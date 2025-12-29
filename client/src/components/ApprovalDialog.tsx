import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

interface ApprovalDialogProps {
  isOpen: boolean;
  recordTitle: string;
  recordDescription: string;
  onApprove: (justification: string) => void;
  onReject: (reason: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ApprovalDialog({
  isOpen,
  recordTitle,
  recordDescription,
  onApprove,
  onReject,
  onClose,
  isLoading = false,
}: ApprovalDialogProps) {
  const [approvalJustification, setApprovalJustification] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = () => {
    if (approvalJustification.trim()) {
      onApprove(approvalJustification);
      setApprovalJustification("");
      setAction(null);
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setRejectionReason("");
      setAction(null);
    }
  };

  const handleClose = () => {
    setApprovalJustification("");
    setRejectionReason("");
    setAction(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Revisar Registro para Aprovação</DialogTitle>
          <DialogDescription>
            Analise o registro e decida se deseja aprovar ou rejeitar
          </DialogDescription>
        </DialogHeader>

        {/* Record Details */}
        <div className="space-y-4 py-4 border-y">
          <div>
            <label className="text-sm font-medium">Título</label>
            <p className="mt-1 text-base">{recordTitle}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <p className="mt-1 text-base text-muted-foreground">{recordDescription}</p>
          </div>
        </div>

        {/* Action Selection */}
        {action === null && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Qual é sua decisão?</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => setAction("approve")}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 text-red-600 hover:text-red-700"
                onClick={() => setAction("reject")}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Rejeitar
              </Button>
            </div>
          </div>
        )}

        {/* Approval Form */}
        {action === "approve" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Justificativa de Aprovação</label>
              <Textarea
                placeholder="Explique por que você está aprovando este registro..."
                value={approvalJustification}
                onChange={(e) => setApprovalJustification(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAction(null)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isLoading || !approvalJustification.trim()}
              >
                <CheckCircle className="h-4 w-4" />
                Confirmar Aprovação
              </Button>
            </div>
          </div>
        )}

        {/* Rejection Form */}
        {action === "reject" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Motivo da Rejeição</label>
              <Textarea
                placeholder="Explique por que você está rejeitando este registro..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAction(null)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4" />
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
