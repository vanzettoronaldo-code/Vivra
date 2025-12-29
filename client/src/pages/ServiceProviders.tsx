import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Star, Building2, Phone, Mail, FileText, Wrench, Sparkles, Shield, Zap, Droplets, Wind, TreePine, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const providerTypes = [
  { value: "manutencao", label: "Manutenção", labelEn: "Maintenance", icon: Wrench },
  { value: "limpeza", label: "Limpeza", labelEn: "Cleaning", icon: Sparkles },
  { value: "seguranca", label: "Segurança", labelEn: "Security", icon: Shield },
  { value: "eletrica", label: "Elétrica", labelEn: "Electrical", icon: Zap },
  { value: "hidraulica", label: "Hidráulica", labelEn: "Plumbing", icon: Droplets },
  { value: "climatizacao", label: "Climatização", labelEn: "HVAC", icon: Wind },
  { value: "jardinagem", label: "Jardinagem", labelEn: "Landscaping", icon: TreePine },
  { value: "outros", label: "Outros", labelEn: "Others", icon: MoreHorizontal },
];

export default function ServiceProviders() {
  const { language } = useLanguage();
  const isPt = language === "pt-BR";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "manutencao" as const,
    email: "",
    phone: "",
    document: "",
    address: "",
    notes: "",
  });
  
  const { data: providers, isLoading, refetch } = trpc.serviceProvider.list.useQuery();
  const createMutation = trpc.serviceProvider.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });
  const deleteMutation = trpc.serviceProvider.delete.useMutation({
    onSuccess: () => refetch(),
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      type: "manutencao",
      email: "",
      phone: "",
      document: "",
      address: "",
      notes: "",
    });
  };
  
  const handleCreate = () => {
    createMutation.mutate({
      name: formData.name,
      type: formData.type,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      document: formData.document || undefined,
      address: formData.address || undefined,
      notes: formData.notes || undefined,
    });
  };
  
  const handleDelete = (id: number) => {
    if (confirm(isPt ? "Tem certeza que deseja excluir este prestador?" : "Are you sure you want to delete this provider?")) {
      deleteMutation.mutate({ id });
    }
  };
  
  const getTypeInfo = (type: string) => {
    return providerTypes.find(t => t.value === type) || providerTypes[7];
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "andamento": return "bg-blue-100 text-blue-800";
      case "aprovado": return "bg-green-100 text-green-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const filteredProviders = providers?.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.phone?.includes(searchTerm);
    const matchesType = filterType === "all" || provider.type === filterType;
    return matchesSearch && matchesType;
  }) || [];
  
  const t = {
    title: isPt ? "Prestadores de Serviços" : "Service Providers",
    subtitle: isPt ? "Gerencie seus prestadores de serviços e acompanhe o desempenho" : "Manage your service providers and track performance",
    newProvider: isPt ? "Novo Prestador" : "New Provider",
    search: isPt ? "Buscar por nome, email ou telefone..." : "Search by name, email or phone...",
    allTypes: isPt ? "Todos os tipos" : "All types",
    allStatus: isPt ? "Todos os status" : "All status",
    name: isPt ? "Nome" : "Name",
    type: isPt ? "Tipo" : "Type",
    email: isPt ? "Email" : "Email",
    phone: isPt ? "Telefone" : "Phone",
    document: isPt ? "CNPJ/CPF" : "Tax ID",
    address: isPt ? "Endereço" : "Address",
    notes: isPt ? "Observações" : "Notes",
    services: isPt ? "Serviços" : "Services",
    rating: isPt ? "Avaliação" : "Rating",
    status: isPt ? "Status" : "Status",
    actions: isPt ? "Ações" : "Actions",
    view: isPt ? "Visualizar" : "View",
    edit: isPt ? "Editar" : "Edit",
    delete: isPt ? "Excluir" : "Delete",
    cancel: isPt ? "Cancelar" : "Cancel",
    save: isPt ? "Salvar" : "Save",
    createTitle: isPt ? "Novo Prestador de Serviços" : "New Service Provider",
    createDescription: isPt ? "Adicione um novo prestador de serviços à sua base" : "Add a new service provider to your database",
    noProviders: isPt ? "Nenhum prestador encontrado" : "No providers found",
    noProvidersDesc: isPt ? "Adicione seu primeiro prestador de serviços" : "Add your first service provider",
    totalProviders: isPt ? "Total de Prestadores" : "Total Providers",
    activeProviders: isPt ? "Prestadores Ativos" : "Active Providers",
    totalServices: isPt ? "Total de Serviços" : "Total Services",
    avgRating: isPt ? "Avaliação Média" : "Average Rating",
    pendente: isPt ? "Pendente" : "Pending",
    andamento: isPt ? "Em Andamento" : "In Progress",
    aprovado: isPt ? "Aprovado" : "Approved",
    rejeitado: isPt ? "Rejeitado" : "Rejected",
    providerDetails: isPt ? "Detalhes do Prestador" : "Provider Details",
    serviceStats: isPt ? "Estatísticas de Serviços" : "Service Statistics",
  };
  
  // Calculate stats
  const totalProviders = providers?.length || 0;
  const activeProviders = providers?.filter(p => p.isActive).length || 0;
  const totalServices = providers?.reduce((acc, p) => acc + (p.stats?.total || 0), 0) || 0;
  const avgRating = providers?.length 
    ? (providers.reduce((acc, p) => acc + parseFloat(p.rating || "0"), 0) / providers.length).toFixed(1) 
    : "0.0";
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {t.newProvider}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t.createTitle}</DialogTitle>
              <DialogDescription>{t.createDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t.name} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isPt ? "Nome do prestador" : "Provider name"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t.type} *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {isPt ? type.label : type.labelEn}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">{t.document}</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">{t.address}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={isPt ? "Endereço completo" : "Full address"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">{t.notes}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isPt ? "Observações sobre o prestador" : "Notes about the provider"}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name || createMutation.isPending}>
                {createMutation.isPending ? "..." : t.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.totalProviders}</p>
                <p className="text-2xl font-bold">{totalProviders}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.activeProviders}</p>
                <p className="text-2xl font-bold">{activeProviders}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.totalServices}</p>
                <p className="text-2xl font-bold">{totalServices}</p>
              </div>
              <FileText className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.avgRating}</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {avgRating}
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t.allTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTypes}</SelectItem>
                {providerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {isPt ? type.label : type.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Providers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProviders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{t.noProviders}</h3>
            <p className="text-gray-500 mt-1">{t.noProvidersDesc}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProviders.map((provider) => {
            const typeInfo = getTypeInfo(provider.type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          {!provider.isActive && (
                            <Badge variant="secondary">{isPt ? "Inativo" : "Inactive"}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {isPt ? typeInfo.label : typeInfo.labelEn}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          {provider.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {provider.email}
                            </span>
                          )}
                          {provider.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {provider.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      {/* Service Stats */}
                      <div className="flex items-center gap-2">
                        <div className="text-center px-3 py-1 bg-gray-100 rounded">
                          <p className="text-xs text-gray-500">{t.services}</p>
                          <p className="font-semibold">{provider.stats?.total || 0}</p>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{provider.rating || "0.0"}</span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      {provider.stats && (provider.stats.total > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {provider.stats.pendente > 0 && (
                            <Badge className={getStatusColor("pendente")}>
                              {provider.stats.pendente} {t.pendente}
                            </Badge>
                          )}
                          {provider.stats.andamento > 0 && (
                            <Badge className={getStatusColor("andamento")}>
                              {provider.stats.andamento} {t.andamento}
                            </Badge>
                          )}
                          {provider.stats.aprovado > 0 && (
                            <Badge className={getStatusColor("aprovado")}>
                              {provider.stats.aprovado} {t.aprovado}
                            </Badge>
                          )}
                          {provider.stats.rejeitado > 0 && (
                            <Badge className={getStatusColor("rejeitado")}>
                              {provider.stats.rejeitado} {t.rejeitado}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedProvider(provider); setIsViewDialogOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            {t.view}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(provider.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* View Provider Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t.providerDetails}</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const TypeIcon = getTypeInfo(selectedProvider.type).icon;
                    return <TypeIcon className="w-8 h-8 text-primary" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedProvider.name}</h3>
                  <p className="text-gray-500">
                    {isPt ? getTypeInfo(selectedProvider.type).label : getTypeInfo(selectedProvider.type).labelEn}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedProvider.email && (
                  <div>
                    <Label className="text-gray-500">{t.email}</Label>
                    <p>{selectedProvider.email}</p>
                  </div>
                )}
                {selectedProvider.phone && (
                  <div>
                    <Label className="text-gray-500">{t.phone}</Label>
                    <p>{selectedProvider.phone}</p>
                  </div>
                )}
                {selectedProvider.document && (
                  <div>
                    <Label className="text-gray-500">{t.document}</Label>
                    <p>{selectedProvider.document}</p>
                  </div>
                )}
                {selectedProvider.address && (
                  <div className="col-span-2">
                    <Label className="text-gray-500">{t.address}</Label>
                    <p>{selectedProvider.address}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-gray-500">{t.serviceStats}</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{selectedProvider.stats?.pendente || 0}</p>
                    <p className="text-xs text-gray-500">{t.pendente}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedProvider.stats?.andamento || 0}</p>
                    <p className="text-xs text-gray-500">{t.andamento}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedProvider.stats?.aprovado || 0}</p>
                    <p className="text-xs text-gray-500">{t.aprovado}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedProvider.stats?.rejeitado || 0}</p>
                    <p className="text-xs text-gray-500">{t.rejeitado}</p>
                  </div>
                </div>
              </div>
              
              {selectedProvider.notes && (
                <div>
                  <Label className="text-gray-500">{t.notes}</Label>
                  <p className="mt-1 text-gray-700">{selectedProvider.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
