import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const CATEGORIES = [
  { value: "problem", label: "Problemas" },
  { value: "maintenance", label: "Manutenção" },
  { value: "decision", label: "Decisões" },
  { value: "inspection", label: "Inspeções" },
];

export default function ApprovalSettings() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Aprovação de Decisões Críticas",
      category: "decision",
      requiresApproval: true,
      approvers: ["Admin User"],
    },
    {
      id: 2,
      name: "Aprovação de Manutenção Urgente",
      category: "maintenance",
      requiresApproval: true,
      approvers: ["Admin User", "Supervisor"],
    },
  ]);

  const handleToggle = (id: number) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, requiresApproval: !w.requiresApproval } : w
    ));
  };

  const handleDelete = (id: number) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuração de Aprovações</h1>
          <p className="text-muted-foreground mt-2">Defina quais registros requerem aprovação</p>
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

      {/* Add New Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Fluxo de Aprovação</CardTitle>
          <CardDescription>Configure um novo tipo de registro que requer aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Fluxo de Aprovação
          </Button>
        </CardContent>
      </Card>

      {/* Existing Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fluxos de Aprovação Ativos</h2>
        {workflows.map(workflow => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription>
                    Categoria: {getCategoryLabel(workflow.category)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ativo:</span>
                    <Switch
                      checked={workflow.requiresApproval}
                      onCheckedChange={() => handleToggle(workflow.id)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(workflow.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Aprovadores</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {workflow.approvers.map((approver, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {approver}
                        <button
                          onClick={() => {
                            const newApprovers = workflow.approvers.filter((_, i) => i !== idx);
                            setWorkflows(workflows.map(w =>
                              w.id === workflow.id ? { ...w, approvers: newApprovers } : w
                            ));
                          }}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const newApprovers = [...workflow.approvers, "Novo Aprovador"];
                      setWorkflows(workflows.map(w =>
                        w.id === workflow.id ? { ...w, approvers: newApprovers } : w
                      ));
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Aprovador
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-gray-700">
          <p>
            • Quando um registro é criado em uma categoria com aprovação ativa, ele fica em status "Pendente"
          </p>
          <p>
            • Os aprovadores designados recebem uma notificação para revisar o registro
          </p>
          <p>
            • O aprovador pode aprovar com uma justificativa ou rejeitar com um motivo
          </p>
          <p>
            • Apenas registros aprovados são considerados finalizados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
