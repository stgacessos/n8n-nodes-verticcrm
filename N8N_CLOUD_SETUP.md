# 🌐 Guia Completo: Instalar n8n-nodes-verticcrm no n8n Cloud

## ✅ Pré-requisitos

- ✅ Conta no n8n Cloud: https://app.n8n.cloud
- ✅ Pacote publicado no npm: ✅ **FEITO!**
- ✅ Credenciais do VerticCRM (Supabase URL + Anon Key)

---

## 📦 Passo 1: Acessar n8n Cloud

1. Acesse: **https://app.n8n.cloud**
2. Faça login com sua conta
3. Você verá o dashboard principal

---

## 🔌 Passo 2: Instalar o Community Node

### 2.1. Abrir Configurações
1. No menu lateral esquerdo, clique em **⚙️ Settings**
2. Procure a seção **"Community Nodes"**
3. Clique em **"Community Nodes"**

### 2.2. Instalar o Node
1. Clique no botão **"Install a community node"**
2. No campo de texto, digite: **`n8n-nodes-verticcrm`**
3. Clique em **"Install"**

### 2.3. Aguardar Instalação
- ⏳ O n8n Cloud vai baixar e instalar o pacote
- 🕐 Isso leva **1-3 minutos**
- ✅ Você verá uma mensagem de sucesso

**Tela esperada:**
```
Installing community node...
✓ n8n-nodes-verticcrm@1.0.0 installed successfully!
```

---

## 🔑 Passo 3: Configurar Credenciais

### 3.1. Criar Nova Credencial
1. No menu lateral, clique em **"Credentials"**
2. Clique no botão **"+ Add Credential"**
3. Na busca, digite: **"VerticCRM"**
4. Clique em **"VerticCRM API"**

### 3.2. Preencher Dados
Preencha os seguintes campos:

**Supabase URL:**
```
https://ikwjydpctosssptdcshq.supabase.co
```

**Supabase Anon Key:**
```
[Sua chave anon do Supabase]
```

**Company ID (opcional):**
```
[UUID da sua empresa no VerticCRM]
```

### 3.3. Onde encontrar as credenciais?

#### Supabase URL e Anon Key:
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto VerticCRM
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → Campo "Supabase URL"
   - **anon public** → Campo "Supabase Anon Key"

#### Company ID:
1. Acesse sua plataforma VerticCRM
2. Vá em **Configurações**
3. Copie o **Company ID**

### 3.4. Testar Conexão
1. Clique em **"Test"** (botão ao lado de Save)
2. Deve aparecer: ✅ **"Credentials are valid"**
3. Clique em **"Save"**

---

## 🧪 Passo 4: Criar Primeiro Workflow

### 4.1. Novo Workflow
1. No menu lateral, clique em **"Workflows"**
2. Clique em **"+ Add Workflow"**
3. Dê um nome: **"Teste VerticCRM"**

### 4.2. Adicionar Trigger Manual
1. Clique no **"+"** no canvas
2. Procure por **"Manual Trigger"**
3. Adicione ao workflow

### 4.3. Adicionar Node VerticCRM
1. Clique no **"+"** após o Manual Trigger
2. Na busca, digite: **"VerticCRM"**
3. Clique em **"VerticCRM"**

**Você deve ver o node com o logo do VerticCRM! 🎉**

### 4.4. Configurar o Node
1. **Credentials**: Selecione a credencial que criou
2. **Resource**: Selecione **"Lead"**
3. **Operation**: Selecione **"Create"**
4. **Full Name**: Digite **"Teste n8n Cloud"**
5. **Email**: Digite **"teste@cloud.com"**
6. **Phone Number**: Digite **"5511999999999"**
7. **Stage**: Deixe **"novo_lead"**
8. **Priority**: Deixe **"media"**

### 4.5. Executar
1. Clique em **"Execute Node"** (botão no topo do node)
2. Aguarde a execução
3. Você deve ver o resultado com o lead criado! ✅

---

## 🎯 Workflows Prontos para Usar

### Workflow 1: Capturar Lead de Formulário
```
Webhook → VerticCRM (Create Lead) → Slack (Notificação)
```

### Workflow 2: Follow-up Automático
```
VerticCRM (Create Lead) → VerticCRM (Create Task)
```

### Workflow 3: WhatsApp Automático
```
VerticCRM (Create Lead) → VerticCRM (Send WhatsApp)
```

### Workflow 4: Evitar Duplicatas
```
Webhook → VerticCRM (Lookup) → IF → [Update / Create]
```

Veja mais exemplos em: [EXAMPLES.md](EXAMPLES.md)

---

## 🐛 Troubleshooting

### ❌ Node não aparece após instalação
**Solução:**
1. Aguarde 3-5 minutos
2. Recarregue a página (F5)
3. Limpe o cache do browser (Ctrl+Shift+Del)
4. Se não funcionar, reinstale:
   - Settings → Community Nodes
   - Remove o node
   - Instale novamente

### ❌ "Credentials are invalid"
**Solução:**
1. Verifique se a **Supabase URL** está correta (sem `/` no final)
2. Confirme que a **Anon Key** está correta
3. Teste a conexão diretamente no Supabase Dashboard
4. Verifique se o projeto está ativo

### ❌ "Company ID required"
**Solução:**
- Configure o **Company ID** nas credenciais
- Ou deixe em branco (funciona para single-tenant)

### ❌ Erro ao criar lead: "Email ou telefone obrigatório"
**Solução:**
- Preencha pelo menos um dos campos: Email OU Phone Number
- Ambos podem estar preenchidos também

### ❌ Instalação falhou no n8n Cloud
**Solução:**
1. Verifique se o pacote está publicado: https://www.npmjs.com/package/n8n-nodes-verticcrm
2. Aguarde alguns minutos (cache do npm)
3. Tente novamente
4. Entre em contato com suporte n8n se persistir

---

## 📊 Verificar se Está Funcionando

### No n8n Cloud:
1. ✅ Node "VerticCRM" aparece na busca
2. ✅ Credenciais testam com sucesso
3. ✅ Execução cria lead no VerticCRM

### No VerticCRM:
1. ✅ Acesse sua plataforma VerticCRM
2. ✅ Vá para **Leads**
3. ✅ Veja o lead "Teste n8n Cloud" criado!

---

## 🚀 Próximos Passos

Agora que está funcionando:

1. ✅ **Explore as operações**
   - List Leads (listar leads)
   - Lookup (buscar por email/telefone)
   - Change Stage (mudar estágio)
   - Create Task (criar tarefa)
   - Send WhatsApp (enviar mensagem)

2. ✅ **Crie workflows reais**
   - Integre com seus formulários
   - Automatize follow-ups
   - Configure WhatsApp automático
   - Sincronize com outras ferramentas

3. ✅ **Leia os exemplos**
   - [EXAMPLES.md](EXAMPLES.md) - 10+ workflows prontos
   - [README.md](README.md) - Documentação completa

---

## 🆘 Precisa de Ajuda?

- 📖 **Documentação**: [README.md](README.md)
- 💡 **Exemplos**: [EXAMPLES.md](EXAMPLES.md)
- 🐛 **Bugs**: [GitHub Issues](https://github.com/stgacessos/n8n-nodes-verticcrm/issues)
- 📧 **Suporte**: contact@verticcrm.com

---

## 📈 Estatísticas

- **Instalações n8n Cloud**: Em tempo real no npm
- **Versão Atual**: 1.0.0
- **Última Atualização**: 2025-10-30
- **Status**: ✅ Estável e Funcional

---

## 🎉 Parabéns!

Você instalou com sucesso o **n8n-nodes-verticcrm** no n8n Cloud!

Agora você pode:
- ✅ Automatizar criação de leads
- ✅ Gerenciar tasks automaticamente
- ✅ Enviar WhatsApp automático
- ✅ Executar automações customizadas

**Aproveite as automações! 🚀**

---

**Criado com ❤️ pela equipe VerticCRM**
