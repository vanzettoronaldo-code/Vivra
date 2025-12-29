import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import { toast } from "sonner";

interface RateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: number;
    title: string;
    providerName?: string;
  } | null;
  onSuccess?: () => void;
}

export default function RateServiceDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: RateServiceDialogProps) {
  const { language } = useLanguage();
  const isPt = language === "pt-BR";
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  const updateMutation = trpc.service.update.useMutation({
    onSuccess: () => {
      toast.success(isPt ? "Avaliação salva com sucesso!" : "Rating saved successfully!");
      onOpenChange(false);
      setRating(0);
      setFeedback("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(isPt ? "Erro ao salvar avaliação" : "Error saving rating");
      console.error(error);
    },
  });
  
  const handleSubmit = () => {
    if (!service || rating === 0) return;
    
    updateMutation.mutate({
      id: service.id,
      rating,
      feedback: feedback || undefined,
    });
  };
  
  const t = {
    title: isPt ? "Avaliar Serviço" : "Rate Service",
    description: isPt 
      ? "Avalie a qualidade do serviço prestado" 
      : "Rate the quality of the service provided",
    service: isPt ? "Serviço" : "Service",
    provider: isPt ? "Prestador" : "Provider",
    rating: isPt ? "Avaliação" : "Rating",
    ratingHint: isPt ? "Clique nas estrelas para avaliar" : "Click the stars to rate",
    feedback: isPt ? "Comentário (opcional)" : "Feedback (optional)",
    feedbackPlaceholder: isPt 
      ? "Descreva sua experiência com este serviço..." 
      : "Describe your experience with this service...",
    cancel: isPt ? "Cancelar" : "Cancel",
    submit: isPt ? "Enviar Avaliação" : "Submit Rating",
    selectRating: isPt ? "Selecione uma avaliação" : "Select a rating",
    excellent: isPt ? "Excelente" : "Excellent",
    good: isPt ? "Bom" : "Good",
    average: isPt ? "Regular" : "Average",
    poor: isPt ? "Ruim" : "Poor",
    terrible: isPt ? "Péssimo" : "Terrible",
  };
  
  const getRatingLabel = (value: number) => {
    switch (value) {
      case 5: return t.excellent;
      case 4: return t.good;
      case 3: return t.average;
      case 2: return t.poor;
      case 1: return t.terrible;
      default: return t.selectRating;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        
        {service && (
          <div className="space-y-6 py-4">
            {/* Service Info */}
            <div className="space-y-2">
              <div>
                <Label className="text-gray-500">{t.service}</Label>
                <p className="font-medium">{service.title}</p>
              </div>
              {service.providerName && (
                <div>
                  <Label className="text-gray-500">{t.provider}</Label>
                  <p className="font-medium">{service.providerName}</p>
                </div>
              )}
            </div>
            
            {/* Rating */}
            <div className="space-y-3">
              <Label>{t.rating}</Label>
              <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <StarRating 
                  value={rating} 
                  onChange={setRating} 
                  size="lg"
                />
                <p className={`text-sm font-medium ${rating > 0 ? "text-gray-900" : "text-gray-400"}`}>
                  {getRatingLabel(rating)}
                </p>
              </div>
              <p className="text-xs text-gray-500 text-center">{t.ratingHint}</p>
            </div>
            
            {/* Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback">{t.feedback}</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t.feedbackPlaceholder}
                rows={4}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || updateMutation.isPending}
          >
            {updateMutation.isPending ? "..." : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
