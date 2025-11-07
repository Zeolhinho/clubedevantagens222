# ClubeLocal Backend API

Backend da aplicação ClubeLocal - Sistema de cupons por assinatura.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="postgresql://postgres:senha@host:5432/postgres"
PORT=5000
NODE_ENV=development
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Aplicar migrations
npm run prisma:migrate

# Popular com dados de teste (opcional)
npm run prisma:seed
```

### 4. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

---

## 📚 Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento (hot reload)
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em produção
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Aplica migrations
- `npm run prisma:studio` - Abre Prisma Studio (interface visual do banco)
- `npm run prisma:seed` - Popula banco com dados de teste

---

## 🔐 Endpoints de Autenticação

### POST `/api/auth/signup`
Criar nova conta

**Body:**
```json
{
  "email": "user@email.com",
  "password": "123456",
  "fullName": "Nome Completo"
}
```

### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "fullName": "Nome Completo",
    "role": "CUSTOMER"
  }
}
```

---

## 🛡️ Middlewares

### `auth`
Verifica se o usuário está autenticado. Adiciona `req.user` com dados do token.

**Uso:**
```typescript
import { auth } from './middleware/auth';

app.get('/rota-protegida', auth, (req, res) => {
  // req.user está disponível aqui
});
```

### `authorize(...roles)`
Verifica se o usuário tem permissão (role) para acessar a rota.

**Uso:**
```typescript
import { authorize } from './middleware/authorize';
import { UserRole } from '@prisma/client';

app.get('/rota-admin', 
  auth, 
  authorize(UserRole.ADMIN), 
  (req, res) => {
    // Apenas admins podem acessar
  }
);
```

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/       # Middlewares (auth, authorize)
│   ├── routes/          # Definição de rotas
│   ├── utils/           # Utilitários (JWT, etc)
│   └── server.ts        # Arquivo principal
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   ├── migrations/      # Migrations aplicadas
│   └── seed.ts          # Dados iniciais
└── package.json
```

---

## 🧪 Testes

Veja o guia completo: [GUIA-TESTE-AUTENTICACAO.md](./GUIA-TESTE-AUTENTICACAO.md)

---

## 📝 Contas de Teste (Seed)

Após rodar `npm run prisma:seed`:

- **Admin:** `admin@clubelocal.com` / `123456`
- **Usuário:** `joao@teste.com` / `123456`
- **Empresa:** `pizzaria@clubelocal.com` / `123456`

---

## 🔧 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** (Supabase)
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

---

## 📖 Documentação

- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)
- [JWT](https://jwt.io/)

