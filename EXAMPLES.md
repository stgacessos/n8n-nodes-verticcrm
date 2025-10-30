# 📚 Exemplos de Workflows com VerticCRM Node

Este documento contém exemplos práticos de workflows usando o node VerticCRM para n8n.

---

## 1️⃣ Capturar Leads de Formulário Web

**Descrição**: Captura leads de um formulário HTML e cria automaticamente no VerticCRM.

**Workflow**:
```
Webhook → VerticCRM (Create Lead) → Slack (Notificação)
```

**Configuração VerticCRM**:
- Resource: `Lead`
- Operation: `Create`
- Full Name: `{{$json["body"]["name"]}}`
- Email: `{{$json["body"]["email"]}}`
- Phone Number: `{{$json["body"]["phone"]}}`
- Stage: `novo_lead`
- Priority: `alta`
- Notes: `Lead capturado via formulário web em {{$now}}`

**JSON do Webhook esperado**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "5511999999999"
}
```

---

## 2️⃣ Evitar Leads Duplicados (Lookup Inteligente)

**Descrição**: Verifica se o lead já existe antes de criar um novo.

**Workflow**:
```
Webhook → VerticCRM (Lookup) → IF → [Update / Create New]
```

**Passo 1 - Lookup**:
- Resource: `Lead`
- Operation: `Lookup`
- Email: `{{$json["body"]["email"]}}`

**Passo 2 - IF Node**:
- Condition: `{{$json["found"]}} === true`

**Passo 3a - Se encontrado (Update)**:
- Resource: `Lead`
- Operation: `Update`
- Lead ID: `{{$json["lead"]["id"]}}`
- Update Fields: Adicionar notas sobre novo contato

**Passo 3b - Se não encontrado (Create)**:
- Resource: `Lead`
- Operation: `Create`
- Preencher todos os campos

---

## 3️⃣ Follow-up Automático com Tarefas

**Descrição**: Ao criar um lead, cria automaticamente uma tarefa de follow-up.

**Workflow**:
```
VerticCRM (Create Lead) → VerticCRM (Create Task) → Email (Lembrete)
```

**Passo 1 - Create Lead**:
- Resource: `Lead`
- Operation: `Create`
- (campos do lead)

**Passo 2 - Create Task**:
- Resource: `Task`
- Operation: `Create`
- Title: `Follow-up: {{$node["VerticCrm"].json["data"]["full_name"]}}`
- Description: `Entrar em contato sobre interesse em nossos serviços`
- Lead ID: `{{$node["VerticCrm"].json["data"]["id"]}}`
- Due Date: `{{$now.plus(2, 'days')}}`
- Priority: `alta`
- Task Type: `follow_up`

---

## 4️⃣ Integração com Meta Ads (Facebook/Instagram)

**Descrição**: Captura leads do Facebook Lead Ads e cria no VerticCRM com informações da campanha.

**Workflow**:
```
Facebook Lead Ads Trigger → VerticCRM (Create Lead) → VerticCRM (Send WhatsApp)
```

**Create Lead com campos Meta**:
```javascript
{
  "full_name": "{{$json["field_data"].find(f => f.name === 'full_name').values[0]}}",
  "email": "{{$json["field_data"].find(f => f.name === 'email').values[0]}}",
  "phone_number": "{{$json["field_data"].find(f => f.name === 'phone_number').values[0]}}",
  "platform": "facebook",
  "campaign_name": "{{$json["campaign_name"]}}",
  "campaign_id": "{{$json["campaign_id"]}}",
  "ad_name": "{{$json["ad_name"]}}",
  "ad_id": "{{$json["ad_id"]}}",
  "form_name": "{{$json["form_name"]}}",
  "is_organic": "false",
  "stage": "novo_lead"
}
```

---

## 5️⃣ Envio de WhatsApp ao Criar Lead

**Descrição**: Envia mensagem de boas-vindas via WhatsApp automaticamente.

**Workflow**:
```
VerticCRM (Create Lead) → VerticCRM (Send WhatsApp)
```

**Send WhatsApp Message**:
- Resource: `WhatsApp`
- Operation: `Send Message`
- Session ID: `[seu-session-id]`
- Phone Number: `{{$node["VerticCrm"].json["data"]["phone_number"]}}`
- Message:
```
Olá {{$node["VerticCrm"].json["data"]["full_name"]}}! 👋

Obrigado por se interessar pela VerticCRM.

Em breve entraremos em contato para entender melhor suas necessidades.

Atenciosamente,
Equipe VerticCRM
```

---

## 6️⃣ Mover Leads Inativos para "Perdido"

**Descrição**: A cada dia, verifica leads sem atividade há 30 dias e move para "perdido".

**Workflow**:
```
Schedule Trigger → VerticCRM (List Leads) → Filter → Loop → VerticCRM (Change Stage)
```

**Schedule**: Diariamente às 9h

**List Leads**:
- Resource: `Lead`
- Operation: `List`
- Limit: `1000`
- Filters → Stage: `novo_lead`

**Filter (Code Node)**:
```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

return items.filter(item => {
  const updatedAt = new Date(item.json.updated_at);
  return updatedAt < thirtyDaysAgo;
});
```

**Loop + Change Stage**:
- Resource: `Lead`
- Operation: `Change Stage`
- Lead ID: `{{$json["id"]}}`
- New Stage: `perdido`

---

## 7️⃣ Notificação Slack de Leads Quentes

**Descrição**: Quando um lead de prioridade alta é criado, notifica no Slack.

**Workflow**:
```
Webhook → VerticCRM (Create Lead) → IF (Priority = Alta) → Slack
```

**IF Condition**:
```javascript
{{$json["data"]["priority"]}} === "alta"
```

**Slack Message**:
```
🔥 *Novo Lead QUENTE!*

*Nome:* {{$json["data"]["full_name"]}}
*Email:* {{$json["data"]["email"]}}
*Telefone:* {{$json["data"]["phone_number"]}}
*Origem:* {{$json["data"]["platform"] || "Website"}}

*Link:* https://verticcrm.com/leads/{{$json["data"]["id"]}}
```

---

## 8️⃣ Sincronizar Leads com Google Sheets

**Descrição**: Exporta leads para planilha do Google Sheets.

**Workflow**:
```
Schedule Trigger → VerticCRM (List Leads) → Google Sheets (Append)
```

**List Leads**:
- Filters → Stage: `ganho` (apenas leads convertidos)
- Limit: `100`

**Google Sheets Append**:
- Spreadsheet: Seu sheet
- Sheet: `Leads Convertidos`
- Columns:
  - Nome: `{{$json["full_name"]}}`
  - Email: `{{$json["email"]}}`
  - Telefone: `{{$json["phone_number"]}}`
  - Valor: `{{$json["estimated_value"]}}`
  - Data: `{{$json["created_at"]}}`

---

## 9️⃣ Atribuição Automática de Leads por Round Robin

**Descrição**: Distribui leads entre vendedores de forma equilibrada.

**Workflow**:
```
VerticCRM (Create Lead) → Code (Round Robin) → VerticCRM (Assign Lead)
```

**Code Node (Round Robin)**:
```javascript
// Lista de IDs dos vendedores
const sellers = [
  'uuid-vendedor-1',
  'uuid-vendedor-2',
  'uuid-vendedor-3'
];

// Usa o ID do lead para distribuir uniformemente
const leadId = items[0].json.data.id;
const index = Math.abs(leadId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % sellers.length;

return [{
  json: {
    leadId: leadId,
    assignTo: sellers[index]
  }
}];
```

**Assign Lead**:
- Resource: `Lead`
- Operation: `Assign`
- Lead ID: `{{$json["leadId"]}}`
- User ID: `{{$json["assignTo"]}}`

---

## 🔟 Pipeline Completo de Lead Nurturing

**Descrição**: Workflow complexo que captura, qualifica e nutre leads.

**Workflow**:
```
Webhook
  → VerticCRM (Lookup)
  → IF (Exists?)
    → YES: Update + Add Note
    → NO: Create Lead
  → VerticCRM (Create Task - Day 1)
  → Wait 2 Days
  → VerticCRM (Send WhatsApp - Follow-up)
  → Wait 3 Days
  → VerticCRM (Create Task - Day 5)
  → Email (Proposta)
```

---

## 🎯 Dicas de Melhores Práticas

### 1. Sempre use Lookup antes de Create
Evita duplicatas:
```
Webhook → Lookup → IF → [Update/Create]
```

### 2. Adicione Error Handling
Use "Continue on Fail" para não interromper o workflow:
- Em Settings do node → Continue On Fail: `true`

### 3. Use Company ID para Multi-tenant
Se você gerencia várias empresas:
```javascript
{
  "company_id": "{{$json["company_id"]}}"
}
```

### 4. Valide dados antes de enviar
Use um Code Node para validar:
```javascript
const email = items[0].json.email;
const phone = items[0].json.phone;

if (!email && !phone) {
  throw new Error('Email ou telefone obrigatório');
}

return items;
```

### 5. Log de atividades
Adicione nodes Set para registrar o que aconteceu:
```javascript
{
  "action": "lead_created",
  "timestamp": "{{$now}}",
  "leadId": "{{$json.data.id}}"
}
```

---

## 🚀 Workflows Avançados

### A) Scoring de Leads
Atribua pontuação baseada em comportamento e mova para estágios diferentes.

### B) Integração com CRM Externo
Sincronize bidirecionalmente com Pipedrive, HubSpot, etc.

### C) Análise de Sentimento
Use AI para analisar mensagens do WhatsApp e classificar leads.

### D) Automação de Propostas
Gere propostas em PDF automaticamente quando lead move para estágio específico.

---

**Mais exemplos?** Contribua com seus workflows no repositório GitHub!
