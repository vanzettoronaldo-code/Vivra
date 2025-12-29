import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import TimelineView from "@/components/TimelineView";

export default function AssetDetail() {
  const params = useParams<{ assetId: string }>();
  const [, setLocation] = useLocation();
  const assetId = parseInt(params?.assetId || "0");

  const { data: asset, isLoading: assetLoading } = trpc.asset.getById.useQuery({
    assetId,
  });

  const { data: records } = trpc.timeline.getByAsset.useQuery({
    assetId,
    limit: 50,
  });

  const { data: recurrence } = trpc.recurrence.getByAsset.useQuery({
    assetId,
  });

  if (assetLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ativo não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{asset.name}</h1>
          <p className="text-slate-600">{asset.type}</p>
        </div>
        <Button onClick={() => setLocation(`/asset/${asset.id}/quick-record`)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Registro
        </Button>
      </div>

      {/* Asset Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Ativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Tipo</p>
              <p className="font-medium">{asset.type}</p>
            </div>
            {asset.location && (
              <div>
                <p className="text-sm text-slate-600">Localização</p>
                <p className="font-medium">{asset.location}</p>
              </div>
            )}
          </div>
          {asset.description && (
            <div>
              <p className="text-sm text-slate-600">Descrição</p>
              <p className="font-medium">{asset.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recurrence Analysis */}
      {recurrence && recurrence.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Problemas Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recurrence.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-blue-900">{item.problemKeyword}</p>
                    <p className="text-sm text-blue-700">
                      {item.occurrenceCount} ocorrências
                    </p>
                  </div>
                  {item.frequency && (
                    <span className="text-sm bg-blue-200 text-blue-900 px-2 py-1 rounded">
                      {item.frequency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            Histórico técnico do ativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records && records.length > 0 ? (
            <TimelineView records={records} />
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">Nenhum registro ainda</p>
              <Button onClick={() => setLocation(`/asset/${asset.id}/quick-record`)}>
                Criar Primeiro Registro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
