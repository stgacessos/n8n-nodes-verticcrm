# n8n-nodes-verticcrm

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/stgacessos/n8n-nodes-verticcrm/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-community-FF6D5A.svg)](https://n8n.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

Este é um node customizado para [n8n](https://n8n.io) que permite integração completa com o **VerticCRM** - uma plataforma CRM moderna construída com Supabase.

![VerticCRM Logo](nodes/VerticCrm/verticcrm.svg)

## 📚 Documentação Rápida

- 🚀 **[Quick Start](QUICKSTART.md)** - Teste em 5 minutos
- 📦 **[Instalação](INSTALLATION.md)** - Guia completo de instalação
- 💡 **[Exemplos](EXAMPLES.md)** - 10+ workflows práticos
- ✅ **[Checklist](CHECKLIST.md)** - Status e roadmap

## 🚀 Funcionalidades

### 📊 Leads
- ✅ **Create** - Criar novos leads com validação inteligente
- ✅ **Update** - Atualizar informações de leads existentes
- ✅ **Get** - Buscar lead por ID
- ✅ **List** - Listar leads com filtros avançados
- ✅ **Lookup** - Buscar leads por email ou telefone (evita duplicatas)
- ✅ **Change Stage** - Alterar estágio do lead no funil
- ✅ **Assign** - Atribuir lead a um usuário responsável

### 📋 Tasks (Tarefas)
- ✅ **Create** - Criar tarefas vinculadas a leads
- ✅ **Update** - Atualizar tarefas existentes
- ✅ **Get** - Buscar tarefa por ID
- ✅ **List** - Listar tarefas por lead ou gerais
- ✅ **Complete** - Marcar tarefa como concluída

### 💬 WhatsApp
- ✅ **Send Message** - Enviar mensagens via WhatsApp
- ✅ **Get Session Status** - Verificar status da sessão WhatsApp
- ✅ **List Conversations** - Listar conversas do WhatsApp

### 🔄 Automations (Automações)
- ✅ **Execute** - Executar automação para um lead específico
- ✅ **List** - Listar automações disponíveis

## 📦 Instalação

### Via npm (quando publicado)

```bash
npm install n8n-nodes-verticcrm
```

### Instalação Manual (Desenvolvimento)

1. Clone este repositório:
```bash
git clone https://github.com/verticcrm/n8n-nodes-verticcrm.git
cd n8n-nodes-verticcrm
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

4. Link localmente para testar:
```bash
npm link
```

5. No diretório do seu n8n:
```bash
npm link n8n-nodes-verticcrm
```

6. Reinicie o n8n:
```bash
n8n start
```

## 🔑 Configuração de Credenciais

Para usar este node, você precisa configurar as credenciais do VerticCRM:

1. No n8n, vá em **Credentials** → **New**
2. Selecione **VerticCRM API**
3. Preencha os campos:
   - **Supabase URL**: URL do seu projeto Supabase (ex: `https://xxxxx.supabase.co`)
   - **Supabase Anon Key**: Chave pública/anon do Supabase
   - **Company ID** (opcional): ID da sua empresa no VerticCRM (para ambientes multi-tenant)

### Onde encontrar as credenciais?

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto VerticCRM
3. Vá em **Settings** → **API**
4. Copie:
   - **URL**: Campo "Project URL"
   - **Anon Key**: Campo "anon public"

## 📖 Exemplos de Uso

### Exemplo 1: Criar Lead a partir de formulário web

```
Webhook Trigger → VerticCRM (Create Lead)
```

**Configuração do VerticCRM Node:**
- Resource: `Lead`
- Operation: `Create`
- Full Name: `{{$json["name"]}}`
- Email: `{{$json["email"]}}`
- Phone Number: `{{$json["phone"]}}`
- Stage: `novo_lead`
- Priority: `alta`

### Exemplo 2: Lookup inteligente de leads (evita duplicatas)

```
HTTP Request → VerticCRM (Lookup Lead) → IF → [Lead Exists / Create New]
```

**Configuração:**
- Resource: `Lead`
- Operation: `Lookup`
- Email: `{{$json["email"]}}`

Se o lead já existir, retorna os dados. Se não, crie um novo.

### Exemplo 3: Automatizar follow-up com tarefas

```
VerticCRM (Create Lead) → VerticCRM (Create Task)
```

**Criar Task:**
- Resource: `Task`
- Operation: `Create`
- Title: `Follow-up com {{$json["data"]["full_name"]}}`
- Lead ID: `{{$json["data"]["id"]}}`
- Due Date: `+2 days`
- Priority: `alta`

### Exemplo 4: Enviar WhatsApp ao criar lead

```
VerticCRM (Create Lead) → VerticCRM (Send WhatsApp Message)
```

**Enviar Mensagem:**
- Resource: `WhatsApp`
- Operation: `Send Message`
- Session ID: `[seu-session-id]`
- Phone Number: `{{$json["data"]["phone_number"]}}`
- Message: `Olá {{$json["data"]["full_name"]}}, recebemos seu contato!`

### Exemplo 5: Mover leads entre estágios automaticamente

```
Schedule Trigger → VerticCRM (List Leads) → Filter → VerticCRM (Change Stage)
```

**Filtrar leads sem contato há 3 dias e mover para "Perdido":**
- List Leads com filtros
- Usar IF para verificar data
- Change Stage para `perdido`

## 🎯 Diferenciais

- **Lookup Inteligente**: Evita criação de leads duplicados
- **Multi-tenant Ready**: Suporte nativo para múltiplas empresas
- **WhatsApp Integrado**: Envie mensagens diretamente pelo n8n
- **Custom Fields**: Suporte completo a campos customizados
- **Validações Robustas**: Email OU telefone obrigatório
- **Edge Functions**: Usa Supabase Edge Functions para performance máxima

## 🔧 Desenvolvimento

### Scripts disponíveis

```bash
# Compilar o projeto
npm run build

# Modo desenvolvimento (watch)
npm run dev

# Lint
npm run lint
npm run lintfix

# Formatar código
npm run format
```

### Estrutura do projeto

```
n8n-nodes-verticcrm/
├── credentials/
│   └── VerticCrmApi.credentials.ts
├── nodes/
│   └── VerticCrm/
│       ├── VerticCrm.node.ts
│       ├── descriptions/
│       │   ├── LeadDescription.ts
│       │   ├── TaskDescription.ts
│       │   ├── WhatsAppDescription.ts
│       │   └── AutomationDescription.ts
│       └── verticcrm.svg
├── package.json
├── tsconfig.json
└── README.md
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 🆘 Suporte

- **Documentação VerticCRM**: [docs.verticcrm.com](https://docs.verticcrm.com)
- **Documentação n8n**: [docs.n8n.io](https://docs.n8n.io)
- **Issues**: [GitHub Issues](https://github.com/verticcrm/n8n-nodes-verticcrm/issues)

## 🔗 Links Úteis

- [VerticCRM](https://verticcrm.com)
- [n8n](https://n8n.io)
- [Supabase](https://supabase.com)

---

Feito com ❤️ pela equipe VerticCRM
