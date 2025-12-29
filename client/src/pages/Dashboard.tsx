import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import CreateAssetDialog from "@/components/CreateAssetDialog";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: assets, isLoading, error, refetch } = trpc.asset.list.useQuery();
  const { data: alerts } = trpc.alert.list.useQuery({ unreadOnly: true });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro ao carregar ativos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ativos</h1>
          <p className="text-slate-600 mt-1">Gerencie seus ativos físicos e histórico técnico</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ativo
        </Button>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5" />
              Alertas de Problemas Recorrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert: any) => (
                <div key={alert.id} className="text-sm text-orange-800">
                  <p className="font-medium">{alert.title}</p>
                  {alert.message && <p className="text-orange-700">{alert.message}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Grid */}
      {assets && assets.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card
              key={asset.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setLocation(`/asset/${asset.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <CardDescription>{asset.type}</CardDescription>
              </CardHeader>
              <CardContent>
                {asset.location && (
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Local:</span> {asset.location}
                  </p>
                )}
                {asset.description && (
                  <p className="text-sm text-slate-600">
                    {asset.description.substring(0, 100)}
                    {asset.description.length > 100 ? "..." : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">Nenhum ativo cadastrado ainda</p>
              <Button onClick={() => setShowCreateDialog(true)}>Criar Primeiro Ativo</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Asset Dialog */}
      <CreateAssetDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          refetch();
        }}
      />
    </div>
  );
}
