# 🧪 Guia de Teste - Sistema de Autenticação JWT

## 🚀 Preparação

### 1. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` no diretório `backend/` contém:

```env
DATABASE_URL="postgresql://postgres:ceni6075@db.hshwhxjonwyzhlapfmzg.supabase.co:5432/postgres"
PORT=5000
NODE_ENV=development
JWT_SECRET=clubelocal_jwt_secret_change_in_production_12345
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 2. Iniciar o Servidor

```bash
cd backend
npm run dev
```

O servidor deve iniciar na porta **5000**:
```
🚀 Servidor rodando na porta 5000
📍 Health check: http://localhost:5000/api/health
```

---

## ✅ Testes da API

### **Teste 1: Health Check**

**GET** `http://localhost:5000/api/health`

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "ClubeLocal API está funcionando!",
  "timestamp": "2025-11-06T..."
}
```

---

### **Teste 2: Signup (Criar Conta)**

**POST** `http://localhost:5000/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "novo@teste.com",
  "password": "123456",
  "fullName": "Novo Usuário"
}
```

**Resposta esperada (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "novo@teste.com",
    "fullName": "Novo Usuário",
    "role": "CUSTOMER",
    "phone": null,
    "avatarUrl": null,
    "createdAt": "2025-11-06T..."
  }
}
```

**Testes de Validação:**

1. **Email inválido:**
   ```json
   {
     "email": "email-invalido",
     "password": "123456",
     "fullName": "Teste"
   }
   ```
   **Resposta:** `400 - {"error": "Email inválido"}`

2. **Senha curta:**
   ```json
   {
     "email": "teste@teste.com",
     "password": "123",
     "fullName": "Teste"
   }
   ```
   **Resposta:** `400 - {"error": "Senha deve ter no mínimo 6 caracteres"}`

3. **Nome muito curto:**
   ```json
   {
     "email": "teste@teste.com",
     "password": "123456",
     "fullName": "AB"
   }
   ```
   **Resposta:** `400 - {"error": "Nome deve ter no mínimo 3 caracteres"}`

4. **Email já cadastrado:**
   ```json
   {
     "email": "joao@teste.com",
     "password": "123456",
     "fullName": "João Duplicado"
   }
   ```
   **Resposta:** `400 - {"error": "Email já cadastrado"}`

---

### **Teste 3: Login**

**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (com conta existente do seed):**
```json
{
  "email": "joao@teste.com",
  "password": "123456"
}
```

**Resposta esperada (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "joao@teste.com",
    "fullName": "João Silva",
    "role": "CUSTOMER",
    "phone": null,
    "avatarUrl": null,
    "createdAt": "2025-11-06T..."
  }
}
```

**Testes de Validação:**

1. **Email inválido:**
   ```json
   {
     "email": "naoexiste@teste.com",
     "password": "123456"
   }
   ```
   **Resposta:** `401 - {"error": "Email ou senha inválidos"}`

2. **Senha incorreta:**
   ```json
   {
     "email": "joao@teste.com",
     "password": "senhaerrada"
   }
   ```
   **Resposta:** `401 - {"error": "Email ou senha inválidos"}`

3. **Campos vazios:**
   ```json
   {
     "email": "",
     "password": ""
   }
   ```
   **Resposta:** `400 - {"error": "Email é obrigatório"}` ou `{"error": "Senha é obrigatória"}`

---

### **Teste 4: Login com Diferentes Roles**

**Teste com Admin:**
```json
{
  "email": "admin@clubelocal.com",
  "password": "123456"
}
```
**Resposta:** Token com `"role": "ADMIN"`

**Teste com Empresa:**
```json
{
  "email": "pizzaria@clubelocal.com",
  "password": "123456"
}
```
**Resposta:** Token com `"role": "COMPANY"`

---

## 🔐 Testes de Middleware de Autenticação

### **Teste 5: Rota Protegida (sem token)**

Crie uma rota de teste protegida temporariamente no `server.ts`:

```typescript
import { auth } from './middleware/auth';

app.get('/api/test-auth', auth, (req, res) => {
  res.json({ 
    message: 'Autenticado!',
    user: req.user 
  });
});
```

**GET** `http://localhost:5000/api/test-auth` (sem header)

**Resposta:** `401 - {"error": "Token não fornecido"}`

---

### **Teste 6: Rota Protegida (com token válido)**

**GET** `http://localhost:5000/api/test-auth`

**Headers:**
```
Authorization: Bearer <token_do_login>
```

**Resposta esperada (200):**
```json
{
  "message": "Autenticado!",
  "user": {
    "userId": "uuid",
    "email": "joao@teste.com",
    "role": "CUSTOMER"
  }
}
```

---

### **Teste 7: Token Inválido**

**GET** `http://localhost:5000/api/test-auth`

**Headers:**
```
Authorization: Bearer token_invalido_12345
```

**Resposta:** `401 - {"error": "Token inválido ou expirado"}`

---

### **Teste 8: Formato de Token Inválido**

**GET** `http://localhost:5000/api/test-auth`

**Headers:**
```
Authorization: token_sem_bearer
```

**Resposta:** `401 - {"error": "Formato de token inválido"}`

---

## 🛡️ Testes de Middleware de Autorização

### **Teste 9: Rota Apenas para Admin**

Adicione uma rota de teste:

```typescript
import { auth } from './middleware/auth';
import { authorize } from './middleware/authorize';
import { UserRole } from '@prisma/client';

app.get('/api/test-admin', 
  auth, 
  authorize(UserRole.ADMIN), 
  (req, res) => {
    res.json({ message: 'Acesso admin permitido!' });
  }
);
```

**Teste com usuário CUSTOMER:**
- Login como `joao@teste.com`
- Use o token no header
- **Resposta:** `403 - {"error": "Acesso negado. Permissão insuficiente."}`

**Teste com usuário ADMIN:**
- Login como `admin@clubelocal.com`
- Use o token no header
- **Resposta:** `200 - {"message": "Acesso admin permitido!"}`

---

## 📋 Checklist de Testes

- [ ] Health check funciona
- [ ] Signup cria conta com sucesso
- [ ] Signup valida email inválido
- [ ] Signup valida senha curta
- [ ] Signup valida nome curto
- [ ] Signup rejeita email duplicado
- [ ] Login funciona com credenciais corretas
- [ ] Login rejeita email inexistente
- [ ] Login rejeita senha incorreta
- [ ] Login valida campos obrigatórios
- [ ] Token JWT é gerado corretamente
- [ ] Token contém userId, email e role
- [ ] Middleware auth bloqueia sem token
- [ ] Middleware auth aceita token válido
- [ ] Middleware auth rejeita token inválido
- [ ] Middleware authorize bloqueia role incorreto
- [ ] Middleware authorize permite role correto
- [ ] Senha nunca aparece nas respostas

---

## 🛠️ Ferramentas para Testar

### **Opção 1: Postman / Insomnia**
- Importe as rotas
- Configure headers
- Teste todas as requisições

### **Opção 2: cURL (Terminal)**

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456","fullName":"Teste User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","password":"123456"}'
```

**Rota Protegida:**
```bash
curl -X GET http://localhost:5000/api/test-auth \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### **Opção 3: Thunder Client (VS Code)**
- Extensão do VS Code
- Interface visual para testar APIs

---

## 🐛 Troubleshooting

**Erro: "Cannot find module '@prisma/client'"**
- Execute: `npx prisma generate`

**Erro: "Token inválido"**
- Verifique se o JWT_SECRET no .env está correto
- Certifique-se de usar o token completo (não cortado)

**Erro: "Email já cadastrado" no signup**
- Use um email diferente ou delete o usuário do banco

**Erro de conexão com banco**
- Verifique a DATABASE_URL no .env
- Teste a conexão: `npx prisma studio`

---

## ✅ Próximos Passos

Após validar todos os testes:
1. Integrar com frontend (substituir simulação)
2. Criar endpoints de cupons
3. Implementar favoritos
4. Criar dashboard admin

---

**Status:** ✅ Sistema de Autenticação Completo e Pronto para Teste!

