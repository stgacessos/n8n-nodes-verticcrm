# 🚀 Guia de Instalação - n8n-nodes-verticcrm

## Opção 1: Instalação via npm (Produção)

### Quando o pacote estiver publicado no npm:

```bash
npm install n8n-nodes-verticcrm
```

Depois reinicie o n8n.

---

## Opção 2: Instalação Manual (Desenvolvimento/Teste Local)

### Passo 1: Preparar o node

```bash
cd /Users/davisantiago/Desktop/Dev\ VerticCRM/n8n-nodes-verticcrm
npm install
npm run build
npm link
```

### Passo 2: Instalar no n8n

Existem duas formas:

#### A) Se você tem n8n instalado globalmente:

```bash
cd ~/.n8n
npm link n8n-nodes-verticcrm
```

#### B) Se você tem n8n em um diretório específico:

```bash
cd /caminho/para/seu/n8n
npm link n8n-nodes-verticcrm
```

#### C) Se você usa n8n via Docker:

Adicione ao seu `docker-compose.yml`:

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./n8n-nodes-verticcrm:/home/node/.n8n/custom/n8n-nodes-verticcrm
```

### Passo 3: Reiniciar n8n

```bash
# Se instalado globalmente
n8n start

# Se via Docker
docker-compose restart
```

---

## Opção 3: Desenvolvimento com Hot Reload

Para desenvolver e testar mudanças em tempo real:

### Terminal 1 - Compilação contínua:
```bash
cd /Users/davisantiago/Desktop/Dev\ VerticCRM/n8n-nodes-verticcrm
npm run dev
```

### Terminal 2 - n8n rodando:
```bash
n8n start
```

Sempre que você alterar o código, o TypeScript recompilará automaticamente. Reinicie o n8n para ver as mudanças.

---

## Verificando a Instalação

1. Abra o n8n: `http://localhost:5678`
2. Crie um novo workflow
3. Clique no **+** para adicionar um node
4. Procure por **"VerticCRM"**
5. Se aparecer, instalação bem-sucedida! 🎉

---

## Configurar Credenciais

1. No n8n, vá em **Credentials** → **New**
2. Procure por **"VerticCRM API"**
3. Preencha:
   - **Supabase URL**: `https://ikwjydpctosssptdcshq.supabase.co`
   - **Supabase Anon Key**: Sua chave anon do Supabase
   - **Company ID** (opcional): ID da sua empresa

### Onde encontrar as credenciais?

No seu projeto VerticCRM:
- Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
- Settings → API
- Copie **Project URL** e **anon public key**

---

## Testando o Node

### Teste Rápido: Criar um Lead

1. Crie um workflow novo
2. Adicione um node **Manual Trigger**
3. Adicione um node **VerticCRM**
4. Configure:
   - Resource: `Lead`
   - Operation: `Create`
   - Full Name: `Teste Node n8n`
   - Email: `teste@verticcrm.com`
   - Phone: `5511999999999`
5. Execute o workflow
6. Verifique no seu VerticCRM se o lead foi criado!

---

## Troubleshooting

### Erro: "Node not found"
- Certifique-se de ter executado `npm link` no diretório do node
- Reinicie o n8n completamente
- Verifique se o build foi executado com sucesso (`npm run build`)

### Erro: "Credentials invalid"
- Verifique se a Supabase URL está correta
- Confirme que a Anon Key está correta
- Teste a conexão diretamente no Supabase Dashboard

### Erro: "Company ID required"
- Algumas operações requerem Company ID
- Configure nas credenciais ou passe via parâmetro

### Build falhou
```bash
# Limpar e rebuildar
rm -rf dist/ node_modules/
npm install
npm run build
```

---

## Publicar no npm (Para Mantenedores)

```bash
# 1. Fazer login no npm
npm login

# 2. Atualizar versão no package.json
# Exemplo: "version": "1.0.1"

# 3. Build
npm run build

# 4. Publicar
npm publish
```

---

## Estrutura de Arquivos Gerados

Após o build, você terá:

```
dist/
├── credentials/
│   └── VerticCrmApi.credentials.js
├── nodes/
│   └── VerticCrm/
│       ├── VerticCrm.node.js
│       ├── descriptions/
│       │   ├── LeadDescription.js
│       │   ├── TaskDescription.js
│       │   ├── WhatsAppDescription.js
│       │   └── AutomationDescription.js
│       └── verticcrm.svg
```

---

## Próximos Passos

1. ✅ Instalação concluída
2. ✅ Credenciais configuradas
3. ✅ Teste básico funcionando
4. 📚 Ler o [README.md](README.md) para exemplos avançados
5. 🚀 Criar seus workflows automatizados!

---

**Dúvidas?** Abra uma issue no GitHub ou consulte a [documentação completa](README.md).
