# 🚀 Quick Start - Teste Local do n8n-nodes-verticcrm

Este guia permite testar o node imediatamente em sua máquina local.

---

## ⚡ Instalação Rápida (5 minutos)

### Passo 1: Clone o repositório
```bash
git clone https://github.com/stgacessos/n8n-nodes-verticcrm.git
cd n8n-nodes-verticcrm
```

### Passo 2: Instale as dependências
```bash
npm install
```

### Passo 3: Compile o projeto
```bash
npm run build
```

### Passo 4: Link localmente
```bash
npm link
```

### Passo 5: Instale no n8n

**Se você tem n8n instalado globalmente:**
```bash
cd ~/.n8n
npm link n8n-nodes-verticcrm
```

**Se você usa Docker:**
```bash
# Adicione ao docker-compose.yml:
volumes:
  - ./n8n-nodes-verticcrm:/home/node/.n8n/custom/n8n-nodes-verticcrm
```

### Passo 6: Inicie o n8n
```bash
n8n start
# Ou se via Docker:
docker-compose up -d
```

### Passo 7: Acesse o n8n
Abra: http://localhost:5678

---

## 🔑 Configurar Credenciais

1. No n8n, clique em **"Credentials"** no menu
2. Clique em **"New"**
3. Procure por **"VerticCRM API"**
4. Preencha:

```
Supabase URL: https://ikwjydpctosssptdcshq.supabase.co
Supabase Anon Key: [sua-chave-anon]
Company ID: [seu-company-id] (opcional)
```

### Onde encontrar as credenciais?

**Supabase Dashboard:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto VerticCRM
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → Supabase URL
   - **anon public** → Supabase Anon Key

**Company ID:**
- Acesse sua plataforma VerticCRM
- Vá em Configurações
- Copie o Company ID

5. Clique em **"Save"**

---

## 🧪 Teste Rápido (1 minuto)

### Teste 1: Criar um Lead

1. Crie um novo workflow
2. Adicione node **"Manual Trigger"**
3. Adicione node **"VerticCRM"**
4. Configure:
   - **Credentials**: Selecione a credencial criada
   - **Resource**: `Lead`
   - **Operation**: `Create`
   - **Full Name**: `Teste Node n8n`
   - **Email**: `teste@verticcrm.com`
   - **Phone Number**: `5511999999999`
   - **Stage**: `novo_lead`
   - **Priority**: `alta`

5. Clique em **"Execute Node"**
6. Veja o resultado com o lead criado! 🎉

### Teste 2: Lookup de Lead (Evitar Duplicatas)

1. No mesmo workflow, adicione outro node **"VerticCRM"**
2. Configure:
   - **Resource**: `Lead`
   - **Operation**: `Lookup`
   - **Email**: `teste@verticcrm.com`

3. Execute
4. Deve retornar `found: true` com os dados do lead! ✅

### Teste 3: Criar Task

1. Adicione node **"VerticCRM"**
2. Configure:
   - **Resource**: `Task`
   - **Operation**: `Create`
   - **Title**: `Follow-up com {{$node["VerticCrm"].json["data"]["full_name"]}}`
   - **Lead ID**: `{{$node["VerticCrm"].json["data"]["id"]}}`
   - **Due Date**: `2025-11-02T10:00:00Z`
   - **Priority**: `alta`

3. Execute
4. Task criada com sucesso! 📋

---

## 📊 Verificar se Funcionou

### No VerticCRM:
1. Faça login na sua plataforma VerticCRM
2. Vá para **Leads**
3. Você deve ver o lead "Teste Node n8n" criado! ✅
4. Vá para **Tasks**
5. Você deve ver a task de follow-up! ✅

---

## 🔥 Workflows Prontos para Testar

### 1. Captura de Lead de Formulário
```json
[
  {
    "name": "Webhook",
    "type": "n8n-nodes-base.webhook"
  },
  {
    "name": "VerticCRM",
    "type": "n8n-nodes-verticcrm.verticCrm",
    "credentials": { "verticCrmApi": "VerticCRM" },
    "parameters": {
      "resource": "lead",
      "operation": "create",
      "full_name": "={{$json[\"body\"][\"name\"]}}",
      "email": "={{$json[\"body\"][\"email\"]}}",
      "phone_number": "={{$json[\"body\"][\"phone\"]}}"
    }
  }
]
```

**Como testar:**
```bash
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "5511999999999"
  }'
```

### 2. Follow-up Automático
- Create Lead → Create Task (configurado acima)

### 3. WhatsApp Automático
```
VerticCRM (Create Lead) → VerticCRM (Send WhatsApp)
```

Configure o Send WhatsApp:
- **Session ID**: [seu-session-id]
- **Phone Number**: `{{$node["VerticCrm"].json["data"]["phone_number"]}}`
- **Message**: `Olá {{$node["VerticCrm"].json["data"]["full_name"]}}! Recebemos seu contato.`

---

## 🐛 Troubleshooting

### Erro: "Node not found"
```bash
# Refaça o npm link
cd n8n-nodes-verticcrm
npm unlink
npm link

cd ~/.n8n
npm unlink n8n-nodes-verticcrm
npm link n8n-nodes-verticcrm

# Reinicie o n8n
n8n start
```

### Erro: "Credentials invalid"
- Verifique se a **Supabase URL** está correta (sem `/` no final)
- Confirme que a **Anon Key** está correta
- Teste a conexão diretamente no Supabase Dashboard

### Erro: "Company ID required"
- Configure o **Company ID** nas credenciais
- Ou remova a validação temporariamente no código

### Build falhou
```bash
rm -rf dist/ node_modules/
npm install
npm run build
```

### Node não aparece no n8n
```bash
# Verifique se o link está funcionando
npm list -g --depth=0 | grep n8n-nodes-verticcrm

# Se não aparecer, refaça o link
npm link
```

---

## 📈 Próximos Passos

Depois de testar localmente:

1. ✅ **Teste funcionando** → Prossiga para exemplos avançados
2. 📚 **Leia o EXAMPLES.md** → 10+ workflows prontos
3. 🚀 **Crie seus workflows** → Automatize seu CRM
4. 📦 **Publique no npm** (opcional) → Compartilhe com a comunidade

---

## 🎯 Exemplos Rápidos de Operações

### Listar Leads
```javascript
Resource: Lead
Operation: List
Limit: 50
Filters:
  - Stage: novo_lead
  - Priority: alta
```

### Mudar Estágio
```javascript
Resource: Lead
Operation: Change Stage
Lead ID: [uuid-do-lead]
New Stage: contato_realizado
```

### Atribuir Lead
```javascript
Resource: Lead
Operation: Assign
Lead ID: [uuid-do-lead]
User ID: [uuid-do-usuario]
```

### Completar Task
```javascript
Resource: Task
Operation: Complete
Task ID: [uuid-da-task]
```

### Status WhatsApp
```javascript
Resource: WhatsApp
Operation: Get Session Status
Session ID: [seu-session-id]
```

---

## 💡 Dicas

1. **Use o Lookup antes de Create** - Evita duplicatas
2. **Configure Company ID** - Para multi-tenant
3. **Ative "Continue on Fail"** - Para workflows robustos
4. **Use variáveis** - `{{$json["campo"]}}` para dados dinâmicos
5. **Teste com dados reais** - Valide integrações end-to-end

---

## 🆘 Precisa de Ajuda?

- 📖 [Documentação Completa](README.md)
- 💡 [10+ Exemplos de Workflows](EXAMPLES.md)
- 🛠️ [Guia de Instalação Detalhado](INSTALLATION.md)
- 🐛 [Reportar Bug](https://github.com/stgacessos/n8n-nodes-verticcrm/issues)

---

**Tempo total de setup**: 5-10 minutos
**Primeiro teste funcionando**: 1 minuto
**Complexidade**: ⭐⭐☆☆☆ (Fácil)

Bons testes! 🚀
