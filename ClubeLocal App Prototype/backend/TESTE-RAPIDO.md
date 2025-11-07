# 🧪 Como Testar a API - Guia Rápido

## 🎯 Método 1: Thunder Client (VS Code) - MAIS FÁCIL!

1. **Instalar extensão:**
   - Abra VS Code
   - Extensions (Ctrl+Shift+X)
   - Busque "Thunder Client"
   - Clique em Install

2. **Testar Health Check:**
   - Clique no ícone do Thunder Client na barra lateral
   - Clique em "New Request"
   - Método: **GET**
   - URL: `http://localhost:5000/api/health`
   - Clique em **Send**

3. **Testar Login:**
   - New Request
   - Método: **POST**
   - URL: `http://localhost:5000/api/auth/login`
   - Aba **Body** → selecione **JSON**
   - Cole:
   ```json
   {
     "email": "joao@teste.com",
     "password": "123456"
   }
   ```
   - Clique em **Send**

4. **Testar Signup:**
   - New Request
   - Método: **POST**
   - URL: `http://localhost:5000/api/auth/signup`
   - Body → JSON:
   ```json
   {
     "email": "novo@teste.com",
     "password": "123456",
     "fullName": "Novo Usuário"
   }
   ```
   - Clique em **Send**

---

## 🎯 Método 2: PowerShell (Terminal)

### Teste 1: Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
```

### Teste 2: Login
```powershell
$body = @{
    email = "joao@teste.com"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Teste 3: Signup
```powershell
$body = @{
    email = "novo@teste.com"
    password = "123456"
    fullName = "Novo Usuário"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 🎯 Método 3: Postman / Insomnia

### Postman:
1. Baixe: https://www.postman.com/downloads/
2. Crie nova requisição
3. Configure método, URL e body
4. Clique Send

### Insomnia:
1. Baixe: https://insomnia.rest/download
2. Crie nova requisição
3. Configure método, URL e body
4. Clique Send

---

## 🎯 Método 4: Navegador (apenas GET)

Abra no navegador:
```
http://localhost:5000/api/health
```

Você verá o JSON diretamente!

---

## 🎯 Método 5: cURL (se tiver instalado)

### Health Check:
```bash
curl http://localhost:5000/api/health
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"joao@teste.com\",\"password\":\"123456\"}"
```

### Signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"novo@teste.com\",\"password\":\"123456\",\"fullName\":\"Novo Usuário\"}"
```

---

## ✅ Respostas Esperadas

### Health Check (200 OK):
```json
{
  "status": "OK",
  "message": "ClubeLocal API está funcionando!",
  "timestamp": "2025-11-06T..."
}
```

### Login/Signup (200/201 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "joao@teste.com",
    "fullName": "João Silva",
    "role": "CUSTOMER"
  }
}
```

### Erro (400/401):
```json
{
  "error": "Mensagem de erro aqui"
}
```

---

## 🚀 Recomendação

**Use Thunder Client no VS Code** - É o mais rápido e prático!

1. Já está no seu editor
2. Interface visual
3. Salva histórico de requisições
4. Fácil de compartilhar

---

## 📝 Contas de Teste

- **Admin:** `admin@clubelocal.com` / `123456`
- **Usuário:** `joao@teste.com` / `123456`
- **Empresa:** `pizzaria@clubelocal.com` / `123456`

