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

  const { data: asset, isLoading: assetLoading } = trpc.asset.get.useQuery({
    id: assetId,
  });

  const { data: records = [] } = trpc.timeline.list.useQuery({
    assetId,
    limit: 50,
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{asset.name}</h1>
          <p className="text-slate-600 mt-1">{asset.type}</p>
        </div>
        <Button
          onClick={() => setLocation(`/asset/${assetId}/quick-record`)}
          className="ml-auto gap-2 bg-blue-600 hover:bg-blue-700"
        >
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
              <p className="text-sm font-medium text-slate-600">Tipo</p>
              <p className="text-lg text-slate-900">{asset.type}</p>
            </div>
            {asset.location && (
              <div>
                <p className="text-sm font-medium text-slate-600">Localização</p>
                <p className="text-lg text-slate-900">{asset.location}</p>
              </div>
            )}
          </div>
          {asset.description && (
            <div>
              <p className="text-sm font-medium text-slate-600">Descrição</p>
              <p className="text-slate-900">{asset.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            {records.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <TimelineView records={records} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">Nenhum registro encontrado</p>
              <Button
                onClick={() => setLocation(`/asset/${assetId}/quick-record`)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Registro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
