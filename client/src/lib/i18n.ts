/**
 * i18n - Internationalization translations
 * Supports Portuguese (pt-BR) and English (en-US)
 */

export type Language = "pt-BR" | "en-US";

export const translations = {
  "pt-BR": {
    // Navigation
    navigation: "Navegação",
    page1: "Página 1",
    page2: "Página 2",
    logout: "Sair",
    language: "Idioma",

    // Dashboard
    assets: "Ativos",
    manageAssets: "Gerencie seus ativos físicos e histórico técnico",
    yourAssets: "Seus Ativos",
    newAsset: "Novo Ativo",
    noAssets: "Nenhum ativo encontrado",

    // Asset Details
    assetInfo: "Informações do Ativo",
    type: "Tipo",
    location: "Localização",
    description: "Descrição",
    timeline: "Linha do Tempo",
    records: "registros",
    filters: "Filtros",
    createFirstRecord: "Criar Primeiro Registro",
    noRecords: "Nenhum registro encontrado",

    // Quick Record
    newRecord: "Novo Registro",
    recordInLessThanMinute: "Registre em menos de 1 minuto",
    title: "Título",
    titlePlaceholder: "Ex: Vazamento detectado",
    category: "Categoria",
    categoryProblem: "🔴 Problema",
    categoryMaintenance: "🔧 Manutenção",
    categoryDecision: "✅ Decisão",
    categoryInspection: "📋 Inspeção",
    descriptionPlaceholder: "Detalhes adicionais...",
    photos: "Fotos",
    takePhoto: "Tirar Foto",
    uploadPhoto: "Upload",
    audio: "Áudio",
    record: "Gravar",
    stop: "Parar",
    cancel: "Cancelar",
    saveRecord: "Salvar Registro",
    saving: "Salvando...",
    transcribeAudio: "Transcrever Áudio",
    transcribing: "Transcrevendo...",
    audioTranscription: "Transcrição de áudio",
    uploadingAttachments: "Enviando anexos...",
    recordCreatedSuccess: "Registro criado com sucesso!",
    recordCreatedError: "Erro ao criar registro",
    photoUploadError: "Erro ao fazer upload da foto",
    audioUploadError: "Erro ao fazer upload do áudio",
    audioRecordingStarted: "Gravação iniciada",
    audioRecordingSuccess: "Áudio gravado com sucesso!",
    audioTranscriptionSuccess: "Áudio transcrito com sucesso!",
    audioTranscriptionError: "Erro ao transcrever áudio",
    microphoneAccessError: "Erro ao acessar microfone",
    titleRequired: "Título é obrigatório",

    // Timeline Filters
    filterByCategory: "Filtrar por categoria",
    filterByDate: "Filtrar por data",
    filterByAuthor: "Filtrar por autor",
    allCategories: "Todas as categorias",
    startDate: "Data inicial",
    endDate: "Data final",
    author: "Autor",
    applyFilters: "Aplicar filtros",
    clearFilters: "Limpar filtros",

    // Common
    back: "Voltar",
    save: "Salvar",
    delete: "Deletar",
    edit: "Editar",
    close: "Fechar",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    required: "obrigatório",
  },
  "en-US": {
    // Navigation
    navigation: "Navigation",
    page1: "Page 1",
    page2: "Page 2",
    logout: "Logout",
    language: "Language",

    // Dashboard
    assets: "Assets",
    manageAssets: "Manage your physical assets and technical history",
    yourAssets: "Your Assets",
    newAsset: "New Asset",
    noAssets: "No assets found",

    // Asset Details
    assetInfo: "Asset Information",
    type: "Type",
    location: "Location",
    description: "Description",
    timeline: "Timeline",
    records: "records",
    filters: "Filters",
    createFirstRecord: "Create First Record",
    noRecords: "No records found",

    // Quick Record
    newRecord: "New Record",
    recordInLessThanMinute: "Record in less than 1 minute",
    title: "Title",
    titlePlaceholder: "E.g., Leak detected",
    category: "Category",
    categoryProblem: "🔴 Problem",
    categoryMaintenance: "🔧 Maintenance",
    categoryDecision: "✅ Decision",
    categoryInspection: "📋 Inspection",
    descriptionPlaceholder: "Additional details...",
    photos: "Photos",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload",
    audio: "Audio",
    record: "Record",
    stop: "Stop",
    cancel: "Cancel",
    saveRecord: "Save Record",
    saving: "Saving...",
    transcribeAudio: "Transcribe Audio",
    transcribing: "Transcribing...",
    audioTranscription: "Audio transcription",
    uploadingAttachments: "Uploading attachments...",
    recordCreatedSuccess: "Record created successfully!",
    recordCreatedError: "Error creating record",
    photoUploadError: "Error uploading photo",
    audioUploadError: "Error uploading audio",
    audioRecordingStarted: "Recording started",
    audioRecordingSuccess: "Audio recorded successfully!",
    audioTranscriptionSuccess: "Audio transcribed successfully!",
    audioTranscriptionError: "Error transcribing audio",
    microphoneAccessError: "Error accessing microphone",
    titleRequired: "Title is required",

    // Timeline Filters
    filterByCategory: "Filter by category",
    filterByDate: "Filter by date",
    filterByAuthor: "Filter by author",
    allCategories: "All categories",
    startDate: "Start date",
    endDate: "End date",
    author: "Author",
    applyFilters: "Apply filters",
    clearFilters: "Clear filters",

    // Common
    back: "Back",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    required: "required",
  },
};

export function getTranslation(language: Language, key: keyof typeof translations["pt-BR"]): string {
  return translations[language][key as keyof typeof translations[Language]] || key;
}
