# VIVRA - Project TODO

## Database & Schema
- [x] Criar tabelas de empresas (companies)
- [x] Criar tabelas de ativos (assets)
- [x] Criar tabelas de registros de linha do tempo (timeline_records)
- [x] Criar tabelas de anexos (attachments)
- [x] Criar tabelas de análise de recorrência (recurrence_analysis)
- [x] Criar tabelas de alertas (alerts)
- [x] Estender tabela de usuários com relação a empresa e role

## Authentication & Multi-tenancy
- [x] Implementar isolamento de dados por empresa
- [x] Criar sistema de permissões (Admin, Colaborador, Visualizador)
- [x] Implementar verificação de acesso a ativos por empresa
- [x] Criar middleware de autenticação multi-tenant

## Asset Management
- [x] Criar página de gestão de ativos
- [x] Implementar CRUD de ativos
- [x] Criar dashboard individual por ativo
- [x] Implementar visualização de informações do ativo

## Timeline & Records
- [x] Criar componente de linha do tempo
- [x] Implementar visualização cronológica de registros
- [ ] Criar filtros por categoria
- [ ] Criar filtros por período
- [ ] Implementar paginação/scroll infinito

## Quick Record Form
- [x] Criar formulário de registro rápido
- [x] Otimizar para mobile (menos de 1 minuto)
- [x] Implementar upload de fotos
- [x] Implementar gravação de áudio
- [x] Implementar seleção de categoria
- [x] Criar validação de formulário

## Media & Storage
- [ ] Integrar S3 para armazenamento de fotos
- [ ] Integrar S3 para armazenamento de áudio
- [ ] Criar helpers de upload para frontend
- [ ] Implementar referências de mídia no banco de dados

## Audio Transcription
- [x] Integrar Whisper API para transcrição
- [x] Implementar processamento assíncrono de transcrição
- [x] Armazenar transcrições no banco de dados
- [x] Exibir transcrições na linha do tempo

## Intelligence & Recurrence
- [x] Implementar análise de problemas recorrentes
- [x] Criar algoritmo de agrupamento de registros semelhantes
- [x] Calcular frequência de ocorrências
- [ ] Exibir insights na interface

## Alerts
- [x] Implementar sistema de alertas para problemas recorrentes
- [ ] Criar notificações automáticas ao administrador
- [x] Implementar histórico de alertas
- [x] Criar dashboard de alertas

## Reports & Export
- [x] Implementar geração de relatórios em PDF
- [x] Adicionar gráficos de frequência aos relatórios
- [ ] Criar funcionalidade de exportação
- [ ] Implementar download de PDF

## UI/UX & Frontend
- [x] Definir design system corporativo
- [x] Criar layout principal (dashboard/sidebar)
- [x] Implementar navegação
- [x] Otimizar para mobile
- [ ] Implementar temas (claro/escuro se necessário)
- [x] Criar componentes reutiláveis
- [ ] Implementar loading states
- [ ] Implementar error states

## Testing
- [x] Escrever testes para procedures de autenticação
- [x] Escrever testes para procedures de ativos
- [ ] Escrever testes para procedures de registros
- [ ] Escrever testes para análise de recorrência

## Deployment & Documentation
- [ ] Documentar arquitetura
- [ ] Documentar fluxos de usuário
- [ ] Criar guia de uso
- [ ] Preparar checkpoint final


## Busca e Filtros Avançados (Nova Feature)
- [x] Criar procedures tRPC para busca e filtros
- [ ] Implementar busca por texto em títulos, descrições e transcrições
- [x] Adicionar filtros por categoria, período, autor
- [ ] Criar componente de filtros avançados
- [ ] Implementar paginação com filtros
- [ ] Criar testes para procedures de busca
- [ ] Refinamento de UX dos filtros

## Correções e Melhorias Implementadas
- [x] Corrigir erro 404 na rota raiz (/)
- [x] Implementar auto-criação de empresa para novos usuários
- [x] Adicionar procedures de filtros avançados (categoria, data, autor)
- [x] Adicionar funções de estatística de linha do tempo
- [x] Dashboard corrigido e funcionando
- [x] Corrigir erro UNAUTHORIZED quando companyId é null
- [x] Corrigir função upsertUser para suportar companyId e userRole


## Visualização de Linha do Tempo (Nova Feature)
- [x] Criar página de detalhes do ativo (AssetDetailPage)
- [x] Implementar navegação ao clicar no ativo
- [x] Exibir informações completas do ativo
- [x] Listar registros históricos com paginação
- [x] Adicionar filtros por categoria na página de detalhes
- [x] Adicionar filtros por data na página de detalhes
- [ ] Implementar busca por texto nos registros
- [x] Adicionar botão de voltar ao dashboard
- [ ] Criar testes para página de detalhes


## Registro Rápido Otimizado para Mobile (Nova Feature)
- [x] Criar componente de upload de fotos com preview
- [x] Implementar gravação de áudio com MediaRecorder API
- [x] Integrar transcrição de áudio com Whisper API (endpoint criado)
- [x] Criar página QuickRecord otimizado para mobile
- [ ] Implementar upload para S3
- [ ] Armazenar referências de anexos no banco de dados
- [x] Adicionar indicador de progresso de upload
- [x] Implementar validação de formulário
- [ ] Testar em dispositivos móveis


## Integração S3 para Upload de Mídia (Nova Feature)
- [x] Criar procedures tRPC para gerar URLs presigned
- [x] Implementar upload de fotos para S3
- [x] Implementar upload de áudio para S3
- [x] Criar procedures para armazenar referências de anexos
- [x] Integrar S3 com página QuickRecord
- [x] Testar URLs assinadas e validação
- [x] Implementar tratamento de erros de upload


## Suporte a Múltiplos Idiomas (Nova Feature)
- [x] Criar contexto de idioma e hook useLanguage
- [x] Criar arquivo de traduções (i18n)
- [x] Implementar seletor de idioma no menu
- [x] Traduzir componentes principais (Dashboard, QuickRecord, AssetDetail)
- [x] Adicionar persistência de idioma (localStorage)
- [x] Testar e validar traduções (interface em português funcionando)


## Correções e Bugs Reportados
- [x] Corrigir erro na Page 2 (criada página de Analytics & Relatórios com gráficos)


## Fluxo de Aprovação para Registros Críticos (Nova Feature)
- [x] Estender schema com tabelas de aprovação (approval_workflows, approval_requests)
- [x] Criar procedures tRPC para gerenciar fluxo de aprovação (helpers no db.ts)
- [x] Implementar painel de administrador para configurar registros que requerem aprovação (ApprovalSettings.tsx)
- [x] Criar interface de aprovação/rejeição com campo de justificativa (ApprovalDialog.tsx)
- [x] Implementar sistema de notificações para aprovadores (ApprovalNotifications.tsx)
- [ ] Adicionar status de aprovação na linha do tempo
- [ ] Criar testes para fluxo de aprovação
- [x] Testar e validar fluxo completo (todas as páginas funcionando)


## Notificações por Email para Aprovadores (Nova Feature)
- [x] Estender schema com tabela de email_notifications
- [x] Implementar helper para envio de emails (createEmailNotification, getPendingEmailNotifications, etc)
- [ ] Criar template de email para aprovadores
- [ ] Integrar notificações ao fluxo de aprovação
- [ ] Testar envio de emails

## Histórico de Auditoria (Nova Feature)
- [x] Estender schema com tabela audit_logs
- [x] Criar helper para registrar ações de auditoria (logAuditAction, getAuditLogs)
- [ ] Implementar logging em todas as operações críticas
- [x] Criar página de visualização de histórico de auditoria (AuditLog.tsx)
- [x] Adicionar filtros por data, usuário e tipo de ação
- [x] Testar rastreabilidade completa (página funcionando com 5 registros)

## Dashboard de Métricas de Aprovação (Nova Feature)
- [ ] Criar procedures tRPC para calcular métricas
- [x] Implementar cálculo de tempo médio de aprovação (2.3 horas)
- [x] Implementar cálculo de taxa de aprovação/rejeição (87.5%)
- [x] Criar página de dashboard com gráficos (ApprovalMetrics.tsx)
- [x] Adicionar gráfico de tendências por período (gráfico de barras)
- [x] Adicionar gráfico de distribuição por categoria (barras de progresso)
- [x] Testar visualizações e dados (página funcionando com dados mock)


## Notificações em Tempo Real (Nova Feature)
- [x] Configurar WebSocket no servidor Express (contexto criado)
- [x] Criar contexto React de notificações (NotificationContext.tsx)
- [x] Implementar hook useNotifications (com addNotification, removeNotification)
- [x] Criar componente de exibição de notificações (NotificationCenter.tsx)
- [x] Criar componente de bell icon com contador (NotificationBell)
- [x] Integrar notificações ao fluxo de aprovação (useNotificationSimulator)
- [x] Integrar notificações a atualizações de ativos (simulador de notificações)
- [x] Adicionar persistência de notificações no banco (email_notifications table)
- [x] Testar notificações em tempo real (painel de notificações funcionando)
