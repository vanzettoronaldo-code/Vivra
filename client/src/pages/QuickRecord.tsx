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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Camera, Mic, Upload, X, Volume2, Loader2 } from "lucide-react";

export default function QuickRecord() {
  const params = useParams<{ assetId: string }>();
  const [, setLocation] = useLocation();
  const assetId = parseInt(params?.assetId || "0");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"problem" | "maintenance" | "decision" | "inspection">("problem");
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTranscription, setAudioTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const createRecordMutation = trpc.timeline.create.useMutation({
    onSuccess: async (result: any) => {
      // Upload attachments if any
      if (photos.length > 0 || audioFile) {
        try {
          setUploadProgress(10);

          // Upload photos
          for (let i = 0; i < photos.length; i++) {
            const photo = photos[i].file;
            const formData = new FormData();
            formData.append("file", photo);
            formData.append("type", "photo");
            formData.append("recordId", result.id?.toString() || "");

            // Note: This would need a proper upload endpoint
            // For now, we'll just track progress
            setUploadProgress(10 + ((i + 1) / (photos.length + 1)) * 40);
          }

          // Upload audio if exists
          if (audioFile) {
            setUploadProgress(50);
            const formData = new FormData();
            formData.append("file", audioFile);
            formData.append("type", "audio");
            formData.append("recordId", result.id?.toString() || "");
            formData.append("transcription", audioTranscription);

            // Note: This would need a proper upload endpoint
            setUploadProgress(90);
          }

          setUploadProgress(100);
        } catch (error) {
          console.error("Error uploading attachments:", error);
          toast.error("Erro ao fazer upload dos anexos");
        }
      }

      toast.success("Registro criado com sucesso!");
      setTitle("");
      setDescription("");
      setCategory("problem");
      setPhotos([]);
      setAudioFile(null);
      setAudioTranscription("");
      setUploadProgress(0);
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
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotos((prev) => [
            ...prev,
            {
              file,
              preview: event.target?.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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
        toast.success("Áudio gravado com sucesso!");
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Gravação iniciada");
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

  const handleTranscribeAudio = async () => {
    if (!audioFile) return;

    setIsTranscribing(true);
    try {
      // Create FormData with audio file
      const formData = new FormData();
      formData.append("audio", audioFile);

      // Send to transcription endpoint
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao transcrever áudio");
      }

      const data = await response.json();
      setAudioTranscription(data.transcription || "");
      toast.success("Áudio transcrito com sucesso!");
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro ao transcrever áudio");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioTranscription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Título é obrigatório");
      return;
    }

    // If there's audio transcription, add it to description
    let finalDescription = description;
    if (audioTranscription) {
      finalDescription = finalDescription
        ? `${finalDescription}\n\n[Transcrição de áudio]\n${audioTranscription}`
        : `[Transcrição de áudio]\n${audioTranscription}`;
    }

    createRecordMutation.mutate({
      assetId,
      title,
      description: finalDescription || undefined,
      category,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-6">
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Novo Registro</h1>
          <p className="text-slate-600 text-sm">Registre em menos de 1 minuto</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Título *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Vazamento detectado"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Categoria *
              </Label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger id="category" className="mt-1">
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
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Detalhes adicionais..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 resize-none"
              />
            </div>

            {/* Photos Section */}
            <div className="border-t pt-4">
              <Label className="block mb-3 text-sm font-medium">Fotos</Label>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="gap-2 flex-1 text-sm"
                >
                  <Camera className="w-4 h-4" />
                  Tirar Foto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 flex-1 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative bg-slate-100 rounded overflow-hidden aspect-square">
                      <img
                        src={photo.preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 h-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {photos.length > 1 ? `${index + 1}/${photos.length}` : ""}
                      </span>
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
              <Label className="block mb-3 text-sm font-medium">Áudio</Label>
              <div className="flex gap-2 mb-3">
                {!isRecording ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleStartRecording}
                    className="gap-2 flex-1 text-sm"
                  >
                    <Mic className="w-4 h-4" />
                    Gravar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleStopRecording}
                    className="gap-2 flex-1 text-sm"
                  >
                    <Mic className="w-4 h-4" />
                    Parar
                  </Button>
                )}
              </div>

              {audioFile && (
                <div className="bg-slate-100 rounded p-3 mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-slate-600" />
                      <div>
                        <p className="text-sm font-medium">{audioFile.name}</p>
                        <p className="text-xs text-slate-600">
                          {(audioFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
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

                  {!audioTranscription && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTranscribeAudio}
                      disabled={isTranscribing}
                      className="w-full text-sm"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Transcrevendo...
                        </>
                      ) : (
                        "Transcrever Áudio"
                      )}
                    </Button>
                  )}

                  {audioTranscription && (
                    <div className="bg-white rounded p-2 border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-1">Transcrição:</p>
                      <p className="text-sm text-slate-700 line-clamp-3">{audioTranscription}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Enviando anexos...</p>
                  <p className="text-sm text-slate-600">{uploadProgress}%</p>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Submit */}
            <div className="border-t pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation(`/asset/${assetId}`)}
                className="flex-1 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createRecordMutation.isPending}
                className="flex-1 text-sm"
              >
                {createRecordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Registro"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
