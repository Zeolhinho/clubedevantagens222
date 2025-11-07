# 🧪 Guia de Teste - Endpoints de Cupons

## ✅ Endpoints Implementados

### 1. **Listar Cupons** (GET)
**URL:** `http://localhost:5000/api/coupons`

**Query Parameters:**
- `category` - Filtrar por categoria (nome)
- `search` - Buscar por texto (título, descrição, empresa)
- `companyId` - Filtrar por empresa (UUID)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 20)
- `sortBy` - Ordenar por: `createdAt` ou `validUntil` (padrão: createdAt)
- `sortOrder` - Ordem: `asc` ou `desc` (padrão: desc)

**Exemplo:**
```
GET http://localhost:5000/api/coupons
GET http://localhost:5000/api/coupons?search=pizza
GET http://localhost:5000/api/coupons?category=Alimentação
GET http://localhost:5000/api/coupons?page=1&limit=10
```

**Resposta:**
```json
{
  "coupons": [
    {
      "id": "uuid",
      "title": "20% de desconto no rodízio",
      "description": "...",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "imageUrl": "...",
      "validFrom": "2025-11-06T...",
      "validUntil": "2026-01-06T...",
      "company": {
        "id": "uuid",
        "name": "Pizzaria Bella",
        "logoUrl": null,
        "city": "São Paulo"
      },
      "category": {
        "id": "uuid",
        "name": "Alimentação",
        "icon": "🍔"
      },
      "usageCount": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1
  }
}
```

---

### 2. **Detalhes de um Cupom** (GET)
**URL:** `http://localhost:5000/api/coupons/:id`

**Exemplo:**
```
GET http://localhost:5000/api/coupons/uuid-do-cupom
```

**Resposta:**
```json
{
  "id": "uuid",
  "title": "20% de desconto no rodízio",
  "description": "...",
  "company": {
    "id": "uuid",
    "name": "Pizzaria Bella",
    "address": "Rua das Pizzas, 123",
    "phone": "(11) 98765-4321"
  },
  "category": {
    "id": "uuid",
    "name": "Alimentação"
  },
  "usageCount": 0
}
```

---

### 3. **Listar Categorias** (GET)
**URL:** `http://localhost:5000/api/coupons/categories`

**Exemplo:**
```
GET http://localhost:5000/api/coupons/categories
```

**Resposta:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Alimentação",
      "icon": "🍔",
      "couponCount": 2
    },
    {
      "id": "uuid",
      "name": "Beleza",
      "icon": "💇",
      "couponCount": 2
    }
  ]
}
```

---

## 🧪 Testes Rápidos (PowerShell)

### Listar todos os cupons:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/coupons" -UseBasicParsing
```

### Buscar por texto:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/coupons?search=pizza" -UseBasicParsing
```

### Filtrar por categoria:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/coupons?category=Alimentação" -UseBasicParsing
```

### Listar categorias:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/coupons/categories" -UseBasicParsing
```

---

## ✅ Funcionalidades

- ✅ Listar cupons aprovados e ativos
- ✅ Filtrar por categoria
- ✅ Buscar por texto (título, descrição, empresa)
- ✅ Paginação
- ✅ Ordenação
- ✅ Detalhes de cupom
- ✅ Listar categorias com contagem
- ✅ Apenas cupons válidos (não expirados)

---

## 📝 Próximos Passos

- Criar cupom (empresas)
- Editar cupom
- Deletar cupom
- Sistema de uso de cupons (gerar código único)

