import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Filter, Download } from "lucide-react";
import { useLocation } from "wouter";

interface AuditLogEntry {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userName: string;
  userEmail: string;
  description: string;
  changes?: string;
  timestamp: string;
}

export default function AuditLog() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Mock data - em produção viria do tRPC
  const auditLogs: AuditLogEntry[] = [
    {
      id: 1,
      action: "APPROVE",
      entityType: "approval_request",
      entityId: 1,
      userName: "Ronaldo Vanzetto",
      userEmail: "vanzettoronaldo@gmail.com",
      description: "Aprovado registro de problema crítico",
      changes: '{"status": "pending" -> "approved"}',
      timestamp: "2025-12-29 14:35:22",
    },
    {
      id: 2,
      action: "REJECT",
      entityType: "approval_request",
      entityId: 2,
      userName: "Admin User",
      userEmail: "admin@example.com",
      description: "Rejeitado registro de manutenção",
      changes: '{"status": "pending" -> "rejected"}',
      timestamp: "2025-12-29 13:20:15",
    },
    {
      id: 3,
      action: "CREATE",
      entityType: "timeline_record",
      entityId: 5,
      userName: "João Silva",
      userEmail: "joao@example.com",
      description: "Criado novo registro de inspeção",
      changes: '{"title": "Inspeção mensal", "category": "inspection"}',
      timestamp: "2025-12-29 12:10:45",
    },
    {
      id: 4,
      action: "UPDATE",
      entityType: "asset",
      entityId: 1,
      userName: "Ronaldo Vanzetto",
      userEmail: "vanzettoronaldo@gmail.com",
      description: "Atualizado localização do ativo",
      changes: '{"location": "Downtown" -> "Downtown - Building A"}',
      timestamp: "2025-12-29 11:05:30",
    },
    {
      id: 5,
      action: "CREATE",
      entityType: "approval_workflow",
      entityId: 2,
      userName: "Admin User",
      userEmail: "admin@example.com",
      description: "Criado novo fluxo de aprovação para manutenção urgente",
      changes: '{"name": "Aprovação de Manutenção Urgente"}',
      timestamp: "2025-12-29 10:30:00",
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !selectedAction || log.action === selectedAction;
    
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "APPROVE":
        return "bg-emerald-100 text-emerald-800";
      case "REJECT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: "Criado",
      UPDATE: "Atualizado",
      DELETE: "Deletado",
      APPROVE: "Aprovado",
      REJECT: "Rejeitado",
    };
    return labels[action] || action;
  };

  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Auditoria</h1>
          <p className="text-muted-foreground mt-2">Rastreie todas as ações e mudanças no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const csv = generateCSV(filteredLogs);
              downloadCSV(csv, "audit-log.csv");
            }}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Buscar por usuário, descrição ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedAction === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAction(null)}
              >
                Todas as ações ({auditLogs.length})
              </Button>
              {uniqueActions.map((action: string) => (
                <Button
                  key={action}
                  variant={selectedAction === action ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAction(action)}
                >
                  {getActionLabel(action)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {filteredLogs.length} {filteredLogs.length === 1 ? "registro" : "registros"} encontrado
        </h2>
        
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum registro de auditoria encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getActionBadgeColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono">
                          {log.entityType}#{log.entityId}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{log.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{log.userName}</span>
                        <span>{log.userEmail}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      {log.changes && (
                        <div className="mt-3 p-2 bg-muted rounded font-mono text-xs">
                          {log.changes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function generateCSV(logs: AuditLogEntry[]): string {
  const headers = ["ID", "Ação", "Tipo de Entidade", "ID da Entidade", "Usuário", "Email", "Descrição", "Timestamp"];
  const rows = logs.map(log => [
    log.id,
    log.action,
    log.entityType,
    log.entityId,
    log.userName,
    log.userEmail,
    log.description,
    log.timestamp,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
