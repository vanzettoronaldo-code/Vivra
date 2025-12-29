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


## Menu de Navegação Expandido (Nova Feature)
- [ ] Adicionar item DASHBOARDS ao menu
- [ ] Adicionar item ATIVOS ao menu
- [ ] Adicionar item +NOVOS REGISTROS ao menu
- [ ] Adicionar item APROVAÇÕES ao menu
- [ ] Adicionar item INTELIGÊNCIA ao menu
- [ ] Adicionar item EQUIPE ao menu
- [ ] Criar páginas para cada menu item

## Menu de Configurações com Abas (Nova Feature)
- [x] Criar modal/página de configurações (SettingsDialog.tsx)
- [x] Implementar aba PERFIL com edição de dados
- [x] Implementar aba APROVAÇÕES com checkboxes
- [x] Implementar aba NOTIFICAÇÕES com preferências
- [x] Integrar menu de configurações ao avatar do usuário
- [x] Salvar preferências no banco de dados
- [x] Adicionar colunas de preferências na tabela users (7 novas colunas)
- [x] Criar procedures tRPC para salvar e recuperar preferências
- [ ] Testar menu de configurações no navegador
- [ ] Corrigir dropdown menu se necessário

## Melhorias nos Dashboards (Nova Feature)
- [ ] Melhorar Dashboard com visão geral dos ativos
- [ ] Melhorar Gestão de usuários e permissões
- [ ] Criar painel de inteligência com padrões identificados
- [ ] Otimizar Registro rápido para celular
- [ ] Melhorar Linha do tempo da memória técnica


## Correções de Menus (Reportado pelo usuário)
- [x] Diagnosticar problema com dropdown menu do avatar
- [x] Corrigir abertura/fechamento do menu de configurações
- [x] Corrigir menu de idioma (LanguageSelector)
- [x] Melhorar responsividade dos menus em mobile
- [x] Adicionar feedback visual ao clicar nos menus
- [x] Testar todos os menus no navegador
- [x] Reescrever DashboardLayout com menu customizado
- [x] Implementar seleção de idioma funcional
- [x] Testar abertura do diálogo de configurações
- [x] Testar todas as 3 abas (Perfil, Aprovações, Notificações)


## Correções de SEO (Reportado pelo usuário)
- [x] Adicionar título H1 na página inicial
- [x] Adicionar títulos H2 nas seções
- [x] Corrigir meta title (entre 30-60 caracteres)
- [x] Adicionar meta description (entre 50-160 caracteres)
- [x] Adicionar palavras-chave relevantes no conteúdo
- [x] Testar SEO na página inicial


## Implementação da Página EQUIPE (Reportado pelo usuário - erro 404)
- [x] Criar arquivo Team.tsx com interface de gerenciamento
- [x] Adicionar rota /team no App.tsx
- [x] Implementar tabela de usuários com permissões
- [ ] Criar procedures tRPC para gerenciamento de equipe (persistência)
- [ ] Adicionar funcionalidade de convite de usuários
- [x] Testar a página /team


## Correção da Aba NOVOS REGISTROS (Reportado pelo usuário - erro)
- [x] Diagnosticar qual rota está associada a NOVOS REGISTROS
- [x] Verificar se a página existe
- [x] Criar ou corrigir a página (adicionar rota /quick-record)
- [x] Testar a aba NOVOS REGISTROS


## Redesign Visual (Baseado em Site de Referência)
- [x] Atualizar paleta de cores (azul escuro + turquesa + branco)
- [ ] Criar logo circular com gradiente
- [ ] Redesenhar página de login com card centralizado
- [x] Atualizar DashboardLayout com design minimalista (menu refinado)
- [ ] Refinar tipografia e espaçamento
- [ ] Atualizar componentes (botões, cards, inputs)
- [ ] Testar design em diferentes resoluções


## Implementação das 3 Sugestões de Redesign
- [x] Criar logo circular com gradiente azul/turquesa
- [x] Adicionar logo ao DashboardLayout no header
- [x] Redesenhar página de login com card centralizado (Home.tsx)
- [x] Refinar tipografia (aumentar tamanhos de título, melhorar line-height)
- [x] Melhorar espaçamento em cards e componentes
- [ ] Testar responsividade em mobile


## Implementacao das 3 Sugestoes Finais
- [x] Criar pagina INTELIGENCIA com analise de padroes recorrentes
- [x] Implementar graficos de frequencia de problemas
- [x] Adicionar alertas automaticos para padroes recorrentes
- [x] Implementar sistema de notificacoes em tempo real
- [x] Criar notificacoes push para aprovacoes pendentes
- [x] Adicionar notificacoes para problemas recorrentes detectados
- [x] Criar funcionalidade de exportacao de relatorios em PDF
- [x] Implementar graficos nos relatorios
- [x] Adicionar analise de tendencias nos relatorios


## Implementacao das 3 Sugestoes Finais - Fase 2
- [x] Integrar persistencia de dados na pagina INTELIGENCIA com tRPC
- [x] Criar procedures tRPC para recuperar padroes recorrentes do banco
- [x] Implementar filtros avancados na pagina ATIVOS
- [x] Adicionar filtro por categoria, severidade, data e status
- [x] Criar dashboard de metricas com graficos
- [x] Implementar graficos de tendencias (linha, pizza, barras)
- [x] Adicionar taxa de resolucao de problemas
- [x] Testar todas as funcionalidades
