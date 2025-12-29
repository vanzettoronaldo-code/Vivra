import { useParams, useLocation } from "wouter";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Camera, Mic, Upload, X } from "lucide-react";
// Storage will be handled server-side

export default function QuickRecord() {
  const params = useParams<{ assetId: string }>();
  const [, setLocation] = useLocation();
  const assetId = parseInt(params?.assetId || "0");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"problem" | "maintenance" | "decision" | "inspection">("problem");
  const [photos, setPhotos] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const createRecordMutation = trpc.timeline.create.useMutation({
    onSuccess: async (result) => {
      // Upload attachments if any
      if (photos.length > 0 || audioFile) {
        try {
          for (const photo of photos) {
            const fileKey = `assets/${assetId}/photos/${Date.now()}-${photo.name}`;
            const buffer = await photo.arrayBuffer();
            // Note: This would need proper S3 integration
            // await storagePut(fileKey, buffer, photo.type);
          }

          if (audioFile) {
            const fileKey = `assets/${assetId}/audio/${Date.now()}-${audioFile.name}`;
            const buffer = await audioFile.arrayBuffer();
            // Note: This would need proper S3 integration and transcription
            // await storagePut(fileKey, buffer, audioFile.type);
          }
        } catch (error) {
          console.error("Error uploading attachments:", error);
        }
      }

      toast.success("Registro criado com sucesso!");
      setTitle("");
      setDescription("");
      setCategory("problem");
      setPhotos([]);
      setAudioFile(null);
      setLocation(`/asset/${assetId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar registro");
    },
  });

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setPhotos([...photos, ...Array.from(files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setAudioFile(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Erro ao acessar microfone");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Título é obrigatório");
      return;
    }
    createRecordMutation.mutate({
      assetId,
      title,
      description: description || undefined,
      category,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation(`/asset/${assetId}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Novo Registro</h1>
          <p className="text-slate-600">Registre em menos de 1 minuto</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Vazamento detectado"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="problem">🔴 Problema</SelectItem>
                  <SelectItem value="maintenance">🔧 Manutenção</SelectItem>
                  <SelectItem value="decision">✅ Decisão</SelectItem>
                  <SelectItem value="inspection">📋 Inspeção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Detalhes adicionais..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Photos Section */}
            <div className="border-t pt-4">
              <Label className="block mb-3">Fotos</Label>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="gap-2 flex-1"
                >
                  <Camera className="w-4 h-4" />
                  Tirar Foto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 flex-1"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative bg-slate-100 rounded p-2">
                      <p className="text-xs text-slate-600 truncate">{photo.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelected}
                className="hidden"
                multiple
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelected}
                className="hidden"
                multiple
              />
            </div>

            {/* Audio Section */}
            <div className="border-t pt-4">
              <Label className="block mb-3">Áudio</Label>
              <div className="flex gap-2 mb-3">
                {!isRecording ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleStartRecording}
                    className="gap-2 flex-1"
                  >
                    <Mic className="w-4 h-4" />
                    Gravar Áudio
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleStopRecording}
                    className="gap-2 flex-1"
                  >
                    <Mic className="w-4 h-4" />
                    Parar Gravação
                  </Button>
                )}
              </div>

              {audioFile && (
                <div className="bg-slate-100 rounded p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{audioFile.name}</p>
                    <p className="text-xs text-slate-600">
                      {(audioFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAudio}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="border-t pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation(`/asset/${assetId}`)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createRecordMutation.isPending}
                className="flex-1"
              >
                {createRecordMutation.isPending ? "Salvando..." : "Salvar Registro"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
