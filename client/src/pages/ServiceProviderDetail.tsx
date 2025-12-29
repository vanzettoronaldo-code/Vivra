import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import RateServiceDialog from "@/components/RateServiceDialog";
import StarRating from "@/components/StarRating";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Wrench,
  Sparkles,
  Shield,
  Zap,
  Droplets,
  Wind,
  TreePine,
  MoreHorizontal
} from "lucide-react";

const providerTypes = [
  { value: "manutencao", label: "Manutenção", labelEn: "Maintenance", icon: Wrench, color: "bg-orange-500" },
  { value: "limpeza", label: "Limpeza", labelEn: "Cleaning", icon: Sparkles, color: "bg-purple-500" },
  { value: "seguranca", label: "Segurança", labelEn: "Security", icon: Shield, color: "bg-red-500" },
  { value: "eletrica", label: "Elétrica", labelEn: "Electrical", icon: Zap, color: "bg-yellow-500" },
  { value: "hidraulica", label: "Hidráulica", labelEn: "Plumbing", icon: Droplets, color: "bg-blue-500" },
  { value: "climatizacao", label: "Climatização", labelEn: "HVAC", icon: Wind, color: "bg-cyan-500" },
  { value: "jardinagem", label: "Jardinagem", labelEn: "Landscaping", icon: TreePine, color: "bg-green-500" },
  { value: "outros", label: "Outros", labelEn: "Others", icon: MoreHorizontal, color: "bg-gray-500" },
];

export default function ServiceProviderDetail() {
  const { language } = useLanguage();
  const isPt = language === "pt-BR";
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/providers/:id");
  const [match2, params2] = useRoute("/prestadores/:id");
  
  const providerId = parseInt(params?.id || params2?.id || "0");
  
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ id: number; title: string; providerName?: string } | null>(null);
  
  const { data: provider, isLoading, refetch: refetchProvider } = trpc.serviceProvider.getById.useQuery(
    { id: providerId },
    { enabled: providerId > 0 }
  );
  
  const { data: services, refetch: refetchServices } = trpc.serviceProvider.getServices.useQuery(
    { providerId },
    { enabled: providerId > 0 }
  );
  
  const handleRateService = (service: any) => {
    setSelectedService({
      id: service.id,
      title: service.title,
      providerName: provider?.name,
    });
    setRateDialogOpen(true);
  };
  
  const handleRatingSuccess = () => {
    refetchServices();
    refetchProvider();
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="w-4 h-4" />;
      case "andamento": return <AlertCircle className="w-4 h-4" />;
      case "aprovado": return <CheckCircle2 className="w-4 h-4" />;
      case "rejeitado": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };
  
  const t = {
    back: isPt ? "Voltar" : "Back",
    loading: isPt ? "Carregando..." : "Loading...",
    notFound: isPt ? "Prestador não encontrado" : "Provider not found",
    overview: isPt ? "Visão Geral" : "Overview",
    services: isPt ? "Serviços" : "Services",
    performance: isPt ? "Desempenho" : "Performance",
    contact: isPt ? "Contato" : "Contact",
    phone: isPt ? "Telefone" : "Phone",
    email: isPt ? "Email" : "Email",
    address: isPt ? "Endereço" : "Address",
    document: isPt ? "CNPJ/CPF" : "Tax ID",
    notes: isPt ? "Observações" : "Notes",
    rating: isPt ? "Avaliação" : "Rating",
    totalServices: isPt ? "Total de Serviços" : "Total Services",
    completedServices: isPt ? "Serviços Concluídos" : "Completed Services",
    pendingServices: isPt ? "Serviços Pendentes" : "Pending Services",
    inProgressServices: isPt ? "Em Andamento" : "In Progress",
    rejectedServices: isPt ? "Rejeitados" : "Rejected",
    serviceHistory: isPt ? "Histórico de Serviços" : "Service History",
    noServices: isPt ? "Nenhum serviço registrado" : "No services registered",
    performanceChart: isPt ? "Desempenho ao Longo do Tempo" : "Performance Over Time",
    monthlyServices: isPt ? "Serviços por Mês" : "Services per Month",
    avgRating: isPt ? "Avaliação Média" : "Average Rating",
    completionRate: isPt ? "Taxa de Conclusão" : "Completion Rate",
    responseTime: isPt ? "Tempo de Resposta" : "Response Time",
    days: isPt ? "dias" : "days",
    active: isPt ? "Ativo" : "Active",
    inactive: isPt ? "Inativo" : "Inactive",
    pendente: isPt ? "Pendente" : "Pending",
    andamento: isPt ? "Em Andamento" : "In Progress",
    aprovado: isPt ? "Aprovado" : "Approved",
    rejeitado: isPt ? "Rejeitado" : "Rejected",
    jan: isPt ? "Jan" : "Jan",
    feb: isPt ? "Fev" : "Feb",
    mar: isPt ? "Mar" : "Mar",
    apr: isPt ? "Abr" : "Apr",
    may: isPt ? "Mai" : "May",
    jun: isPt ? "Jun" : "Jun",
    priority: isPt ? "Prioridade" : "Priority",
    baixa: isPt ? "Baixa" : "Low",
    media: isPt ? "Média" : "Medium",
    alta: isPt ? "Alta" : "High",
    urgente: isPt ? "Urgente" : "Urgent",
    scheduledDate: isPt ? "Data Agendada" : "Scheduled Date",
    completedDate: isPt ? "Data de Conclusão" : "Completion Date",
    cost: isPt ? "Custo" : "Cost",
    feedback: isPt ? "Feedback" : "Feedback",
    rateService: isPt ? "Avaliar Serviço" : "Rate Service",
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!provider) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => setLocation("/prestadores")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t.notFound}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const typeInfo = getTypeInfo(provider.type);
  const TypeIcon = typeInfo.icon;
  
  // Calculate stats from services
  const totalServices = services?.length || 0;
  const completedServices = services?.filter((s: { status: string }) => s.status === "aprovado").length || 0;
  const pendingServices = services?.filter((s: { status: string }) => s.status === "pendente").length || 0;
  const inProgressServices = services?.filter((s: { status: string }) => s.status === "andamento").length || 0;
  const rejectedServices = services?.filter((s: { status: string }) => s.status === "rejeitado").length || 0;
  const completionRate = totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0;
  
  // Calculate average rating from services with ratings
  const ratedServices = services?.filter((s: { rating: number | null }) => s.rating !== null) || [];
  const avgRating = ratedServices.length > 0 
    ? (ratedServices.reduce((acc: number, s: { rating: number | null }) => acc + (s.rating || 0), 0) / ratedServices.length).toFixed(1)
    : provider.rating || "0.0";
  
  // Mock monthly data for chart
  const monthlyData = [
    { month: t.jan, services: 3, rating: 4.5 },
    { month: t.feb, services: 5, rating: 4.2 },
    { month: t.mar, services: 4, rating: 4.8 },
    { month: t.apr, services: 6, rating: 4.6 },
    { month: t.may, services: 4, rating: 4.7 },
    { month: t.jun, services: 7, rating: 4.9 },
  ];
  
  const maxServices = Math.max(...monthlyData.map(d => d.services));
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/prestadores")} className="shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>
      </div>
      
      {/* Provider Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Icon and Basic Info */}
            <div className={`w-20 h-20 rounded-2xl ${typeInfo.color} flex items-center justify-center shrink-0`}>
              <TypeIcon className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                  <p className="text-gray-500 mt-1">
                    {isPt ? typeInfo.label : typeInfo.labelEn}
                  </p>
                </div>
                <Badge variant={provider.isActive ? "default" : "secondary"}>
                  {provider.isActive ? t.active : t.inactive}
                </Badge>
              </div>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {provider.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{provider.phone}</span>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{provider.email}</span>
                  </div>
                )}
                {provider.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{provider.address}</span>
                  </div>
                )}
                {provider.document && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{provider.document}</span>
                  </div>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(parseFloat(avgRating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{avgRating}</span>
                <span className="text-gray-500">({ratedServices.length} {isPt ? "avaliações" : "reviews"})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">{t.totalServices}</div>
            <div className="text-2xl font-bold mt-1">{totalServices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">{t.completedServices}</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{completedServices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">{t.completionRate}</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{completionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">{t.avgRating}</div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">{avgRating}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">{t.services}</TabsTrigger>
          <TabsTrigger value="performance">{t.performance}</TabsTrigger>
        </TabsList>
        
        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.serviceHistory}</CardTitle>
              <CardDescription>
                {isPt 
                  ? `${totalServices} serviços registrados` 
                  : `${totalServices} services registered`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services && services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service: any) => (
                    <div 
                      key={service.id} 
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{service.title}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <Badge className={getStatusColor(service.status)}>
                            {t[service.status as keyof typeof t] || service.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          {service.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(service.scheduledDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {service.cost && (
                            <div className="flex items-center gap-1">
                              <span>R$ {parseFloat(service.cost).toFixed(2)}</span>
                            </div>
                          )}
                          {service.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span>{service.rating}</span>
                            </div>
                          )}
                          <Badge variant="outline">
                            {t[service.priority as keyof typeof t] || service.priority}
                          </Badge>
                        </div>
                        {service.feedback && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 italic">"{service.feedback}"</p>
                          </div>
                        )}
                        {/* Rate button for completed services without rating */}
                        {service.status === "aprovado" && !service.rating && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => handleRateService(service)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {t.rateService}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">{t.noServices}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Monthly Services Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.monthlyServices}</CardTitle>
              <CardDescription>
                {isPt ? "Quantidade de serviços realizados por mês" : "Number of services performed per month"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-gray-500">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(data.services / maxServices) * 100} 
                          className="h-8"
                        />
                        <span className="text-sm font-medium w-8">{data.services}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 w-16">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">{data.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{isPt ? "Distribuição por Status" : "Status Distribution"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{t.pendente}</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 mt-2">{pendingServices}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{t.andamento}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mt-2">{inProgressServices}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{t.aprovado}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-2">{completedServices}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{t.rejeitado}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mt-2">{rejectedServices}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>{isPt ? "Métricas de Desempenho" : "Performance Metrics"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-primary">{completionRate}%</div>
                  <div className="text-sm text-gray-500 mt-2">{t.completionRate}</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+5% {isPt ? "vs mês anterior" : "vs last month"}</span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    <span className="text-4xl font-bold">{avgRating}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">{t.avgRating}</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-gray-500">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm">{isPt ? "Estável" : "Stable"}</span>
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-primary">2.3</div>
                  <div className="text-sm text-gray-500 mt-2">{t.responseTime} ({t.days})</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm">-0.5 {isPt ? "dias" : "days"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Notes */}
      {provider.notes && (
        <Card>
          <CardHeader>
            <CardTitle>{t.notes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{provider.notes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Rate Service Dialog */}
      <RateServiceDialog
        open={rateDialogOpen}
        onOpenChange={setRateDialogOpen}
        service={selectedService}
        onSuccess={handleRatingSuccess}
      />
    </div>
  );
}
