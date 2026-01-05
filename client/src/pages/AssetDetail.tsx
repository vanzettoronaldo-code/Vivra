import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import TimelineView from "@/components/TimelineView";
import TimelineFilters, { TimelineFilterState } from "@/components/TimelineFilters";
import { useState } from "react";

export default function AssetDetail() {
  const params = useParams<{ assetId: string }>();
  const [, setLocation] = useLocation();
  const assetId = parseInt(params?.assetId || "0");
  const [filters, setFilters] = useState<TimelineFilterState>({});

  const { data: asset, isLoading: assetLoading } = trpc.asset.get.useQuery({
    id: assetId,
  });

  // Determine which query to use based on filters
  const { data: allRecords = [] } = trpc.timeline.list.useQuery(
    { assetId, limit: 100 },
    { enabled: !filters.category && !filters.startDate && !filters.endDate }
  );

  const { data: categoryRecords = [] } = trpc.timeline.listByCategory.useQuery(
    {
      assetId,
      category: filters.category!,
      limit: 100,
    },
    { enabled: !!filters.category && !filters.startDate && !filters.endDate }
  );

  const { data: dateRangeRecords = [] } = trpc.timeline.listByDateRange.useQuery(
    {
      assetId,
      startDate: filters.startDate || new Date(0),
      endDate: filters.endDate || new Date(),
      limit: 100,
    },
    { enabled: !!(filters.startDate || filters.endDate) }
  );

  // Get stats for the asset
  const { data: stats } = trpc.timeline.getStats.useQuery({ assetId });

  // Select appropriate records based on active filters
  let records = allRecords;
  if (filters.category) {
    records = categoryRecords;
  } else if (filters.startDate || filters.endDate) {
    records = dateRangeRecords;
  }

  if (assetLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32 ml-auto" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-slate-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalRecords}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Problemas</p>
                <p className="text-2xl font-bold text-red-600">{stats.problemCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Manutenção</p>
                <p className="text-2xl font-bold text-blue-600">{stats.maintenanceCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Inspeções</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inspectionCount}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline with Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            {records.length} de {stats?.totalRecords || 0} registros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TimelineFilters
            onFilterChange={setFilters}
            onClearFilters={() => setFilters({})}
          />

          {records.length > 0 ? (
            <TimelineView records={records} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">
                {Object.keys(filters).length > 0
                  ? "Nenhum registro encontrado com os filtros aplicados"
                  : "Nenhum registro encontrado"}
              </p>
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
