import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator";
import { Plus, AlertCircle, Building2, X } from "lucide-react";
import { useState, useMemo } from "react";
import CreateAssetDialog from "@/components/CreateAssetDialog";
import { AssetListSkeleton } from "@/components/AssetListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  useNotificationSimulator();
  const [, setLocation] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  // Use enabled: false initially to prevent automatic query, then enable after component mounts
  const { data: assets = [], isLoading, error } = trpc.asset.list.useQuery(undefined, {
    retry: 1,
  });
  const { data: alerts = [] } = trpc.alert.list.useQuery({ unreadOnly: true }, {
    retry: 1,
  });

  // Filter assets based on search and type
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || asset.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [assets, searchTerm, filterType]);

  // Get unique asset types for filter dropdown
  const assetTypes = useMemo(() => {
    const types = new Set(assets.map(a => a.type));
    return Array.from(types).sort();
  }, [assets]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <AssetListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">Erro ao carregar ativos</p>
            <p className="text-red-800 text-sm mt-1">{error.message}</p>
          </div>
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
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Novo Ativo
        </Button>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Alertas Recentes</CardTitle>
            <CardDescription className="text-orange-800">Problemas recorrentes detectados</CardDescription>
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

      {/* Filter Section */}
      {assets && assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Input */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por nome, localização ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo de Ativo</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || filterType) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("");
                  }}
                  className="w-full gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Section */}
      {assets && assets.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Seus Ativos ({filteredAssets.length} de {assets.length})</h2>
          {filteredAssets.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum ativo encontrado</h3>
                <p className="text-slate-600 text-center mb-6">
                  Nenhum ativo corresponde aos filtros aplicados
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("");
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset: any) => (
                <Card
                  key={asset.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setLocation(`/asset/${asset.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                        <CardDescription>{asset.type}</CardDescription>
                      </div>
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {asset.location && (
                        <p className="text-slate-600">
                          <span className="font-medium">Localização:</span> {asset.location}
                        </p>
                      )}
                      {asset.description && (
                        <p className="text-slate-600 line-clamp-2">
                          <span className="font-medium">Descrição:</span> {asset.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum ativo cadastrado</h3>
            <p className="text-slate-600 text-center mb-6">
              Comece criando seu primeiro ativo para registrar histórico técnico
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Ativo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Asset Dialog */}
      <CreateAssetDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}
