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
