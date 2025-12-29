import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateAssetDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAssetDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const createAssetMutation = trpc.asset.create.useMutation({
    onSuccess: () => {
      toast.success("Ativo criado com sucesso!");
      setName("");
      setType("");
      setLocation("");
      setDescription("");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar ativo");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) {
      toast.error("Nome e tipo são obrigatórios");
      return;
    }
    createAssetMutation.mutate({
      name,
      type,
      location: location || undefined,
      description: description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Ativo</DialogTitle>
          <DialogDescription>
            Adicione um novo ativo físico para gerenciar seu histórico técnico
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Ativo *</Label>
            <Input
              id="name"
              placeholder="Ex: Prédio A, Galpão 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo *</Label>
            <Input
              id="type"
              placeholder="Ex: Prédio, Galpão, Escola, Indústria"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              placeholder="Ex: Rua Principal, 123"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Informações adicionais sobre o ativo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createAssetMutation.isPending}
            >
              {createAssetMutation.isPending ? "Criando..." : "Criar Ativo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
