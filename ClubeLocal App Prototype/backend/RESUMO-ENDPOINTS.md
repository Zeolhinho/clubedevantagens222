# 📋 Resumo Completo de Endpoints - ClubeLocal API

## 🔐 Autenticação

### POST `/api/auth/signup`
Criar nova conta

### POST `/api/auth/login`
Fazer login

---

## 🎫 Cupons (Público)

### GET `/api/coupons`
Listar cupons (filtros: category, search, companyId, page, limit)

### GET `/api/coupons/categories`
Listar categorias

### GET `/api/coupons/:id`
Detalhes de um cupom

---

## 🎫 Cupons (Empresas) - Requer Auth + Role COMPANY

### POST `/api/coupons`
Criar cupom

### PUT `/api/coupons/:id`
Editar cupom

### DELETE `/api/coupons/:id`
Deletar cupom

### POST `/api/coupons/validate`
Validar código de cupom

---

## 🎫 Cupons (Clientes) - Requer Auth + Role CUSTOMER

### POST `/api/coupons/:id/use`
Usar cupom (gerar código único)

---

## 👤 Usuário - Requer Auth

### GET `/api/users/profile`
Ver perfil do usuário

### PUT `/api/users/profile`
Atualizar perfil

### GET `/api/users/favorites`
Listar empresas favoritadas

### POST `/api/users/favorites`
Adicionar empresa aos favoritos
Body: `{ "companyId": "uuid" }`

### DELETE `/api/users/favorites/:companyId`
Remover favorito

### GET `/api/users/history`
Histórico de cupons usados (apenas CUSTOMER)

---

## 👑 Admin - Requer Auth + Role ADMIN

### GET `/api/admin/stats`
Dashboard com estatísticas gerais

### GET `/api/admin/companies`
Listar empresas (filtros: status, search, page, limit)

### PUT `/api/admin/companies/:id/status`
Aprovar/Suspender empresa
Body: `{ "status": "ACTIVE" | "SUSPENDED" }`

### GET `/api/admin/coupons/pending`
Listar cupons pendentes de aprovação

### PUT `/api/admin/coupons/:id/status`
Aprovar/Rejeitar cupom
Body: `{ "status": "APPROVED" | "REJECTED" }`

### GET `/api/admin/users`
Listar usuários (filtros: role, search, page, limit)

---

## 📊 Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `500` - Erro do servidor

---

## 🔑 Autenticação

Todas as rotas protegidas precisam do header:
```
Authorization: Bearer <token_jwt>
```

---

## 📝 Exemplos de Uso

Veja os guias de teste:
- `TESTE-RAPIDO.md` - Testes básicos
- `TESTE-COMPLETO-EMPRESA.md` - Fluxo completo empresa
- `GUIA-TESTE-AUTENTICACAO.md` - Detalhes de autenticação

