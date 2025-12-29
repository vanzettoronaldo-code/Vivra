import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User
} from "lucide-react";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  services: any[];
}

export default function ServiceCalendar() {
  const { language } = useLanguage();
  const isPt = language === "pt-BR";
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const { data: services, isLoading } = trpc.service.list.useQuery();
  
  const t = {
    title: isPt ? "Calendário de Serviços" : "Service Calendar",
    subtitle: isPt ? "Visualize e gerencie serviços agendados" : "View and manage scheduled services",
    today: isPt ? "Hoje" : "Today",
    noServices: isPt ? "Nenhum serviço agendado" : "No scheduled services",
    serviceDetails: isPt ? "Detalhes do Serviço" : "Service Details",
    provider: isPt ? "Prestador" : "Provider",
    status: isPt ? "Status" : "Status",
    priority: isPt ? "Prioridade" : "Priority",
    scheduledDate: isPt ? "Data Agendada" : "Scheduled Date",
    completedDate: isPt ? "Data de Conclusão" : "Completion Date",
    cost: isPt ? "Custo" : "Cost",
    rating: isPt ? "Avaliação" : "Rating",
    description: isPt ? "Descrição" : "Description",
    feedback: isPt ? "Feedback" : "Feedback",
    close: isPt ? "Fechar" : "Close",
    pendente: isPt ? "Pendente" : "Pending",
    andamento: isPt ? "Em Andamento" : "In Progress",
    aprovado: isPt ? "Aprovado" : "Approved",
    rejeitado: isPt ? "Rejeitado" : "Rejected",
    baixa: isPt ? "Baixa" : "Low",
    media: isPt ? "Média" : "Medium",
    alta: isPt ? "Alta" : "High",
    urgente: isPt ? "Urgente" : "Urgent",
    months: isPt 
      ? ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdays: isPt 
      ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    servicesCount: isPt ? "serviços" : "services",
    serviceCount: isPt ? "serviço" : "service",
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-500";
      case "andamento": return "bg-blue-500";
      case "aprovado": return "bg-green-500";
      case "rejeitado": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
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
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "baixa": return "bg-gray-100 text-gray-800";
      case "media": return "bg-blue-100 text-blue-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "urgente": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const dayServices = services?.filter((service: any) => {
        if (!service.scheduledDate) return false;
        const serviceDate = new Date(service.scheduledDate);
        return (
          serviceDate.getDate() === current.getDate() &&
          serviceDate.getMonth() === current.getMonth() &&
          serviceDate.getFullYear() === current.getFullYear()
        );
      }) || [];
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.getTime() === today.getTime(),
        services: dayServices,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, services]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsDetailDialogOpen(true);
  };
  
  // Count services by status for legend
  const statusCounts = useMemo(() => {
    if (!services) return { pendente: 0, andamento: 0, aprovado: 0, rejeitado: 0 };
    return {
      pendente: services.filter((s: any) => s.status === "pendente").length,
      andamento: services.filter((s: any) => s.status === "andamento").length,
      aprovado: services.filter((s: any) => s.status === "aprovado").length,
      rejeitado: services.filter((s: any) => s.status === "rejeitado").length,
    };
  }, [services]);
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
      </div>
      
      {/* Status Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">{t.pendente} ({statusCounts.pendente})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">{t.andamento} ({statusCounts.andamento})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">{t.aprovado} ({statusCounts.aprovado})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">{t.rejeitado} ({statusCounts.rejeitado})</span>
        </div>
      </div>
      
      {/* Calendar */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {t.months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={goToToday}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              {t.today}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Weekday Headers */}
              {t.weekdays.map((day) => (
                <div 
                  key={day} 
                  className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`bg-white min-h-[100px] p-2 ${
                    !day.isCurrentMonth ? "bg-gray-50" : ""
                  } ${day.isToday ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    !day.isCurrentMonth ? "text-gray-400" : "text-gray-900"
                  } ${day.isToday ? "text-primary" : ""}`}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Services for this day */}
                  <div className="space-y-1">
                    {day.services.slice(0, 3).map((service: any) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceClick(service)}
                        className={`w-full text-left text-xs p-1 rounded truncate ${getStatusColor(service.status)} text-white hover:opacity-80 transition-opacity`}
                      >
                        {service.title}
                      </button>
                    ))}
                    {day.services.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{day.services.length - 3} {day.services.length - 3 === 1 ? t.serviceCount : t.servicesCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Service Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t.serviceDetails}</DialogTitle>
            <DialogDescription>
              {selectedService?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4 py-4">
              {/* Status and Priority */}
              <div className="flex items-center gap-2">
                <Badge className={getStatusBadgeColor(selectedService.status)}>
                  {getStatusIcon(selectedService.status)}
                  <span className="ml-1">{t[selectedService.status as keyof typeof t] || selectedService.status}</span>
                </Badge>
                <Badge className={getPriorityColor(selectedService.priority)}>
                  {t[selectedService.priority as keyof typeof t] || selectedService.priority}
                </Badge>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedService.scheduledDate && (
                  <div>
                    <p className="text-sm text-gray-500">{t.scheduledDate}</p>
                    <p className="font-medium">
                      {new Date(selectedService.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedService.completedDate && (
                  <div>
                    <p className="text-sm text-gray-500">{t.completedDate}</p>
                    <p className="font-medium">
                      {new Date(selectedService.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedService.cost && (
                  <div>
                    <p className="text-sm text-gray-500">{t.cost}</p>
                    <p className="font-medium">R$ {parseFloat(selectedService.cost).toFixed(2)}</p>
                  </div>
                )}
                {selectedService.rating && (
                  <div>
                    <p className="text-sm text-gray-500">{t.rating}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{selectedService.rating}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              {selectedService.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t.description}</p>
                  <p className="text-gray-700">{selectedService.description}</p>
                </div>
              )}
              
              {/* Feedback */}
              {selectedService.feedback && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t.feedback}</p>
                  <p className="text-gray-700 italic">"{selectedService.feedback}"</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
