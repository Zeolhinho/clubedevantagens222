# 🧪 Guia de Teste - Endpoints de Cupons (Empresas e Uso)

## 🏢 Endpoints para Empresas

### 1. **Criar Cupom** (POST)
**URL:** `http://localhost:5000/api/coupons`  
**Autenticação:** Sim (Bearer Token - Role: COMPANY)

**Headers:**
```
Authorization: Bearer <token_da_empresa>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "30% OFF em pizzas grandes",
  "description": "Desconto válido para pizzas grandes. Não cumulativo.",
  "discountType": "PERCENTAGE",
  "discountValue": 30,
  "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  "termsConditions": "Válido apenas de segunda a quinta. Não cumulativo com outras promoções.",
  "validFrom": "2025-11-07T00:00:00Z",
  "validUntil": "2025-12-07T23:59:59Z",
  "maxUsesPerUser": 1,
  "totalUsesLimit": 100,
  "categoryId": "uuid-da-categoria"
}
```

**Resposta (201):**
```json
{
  "message": "Cupom criado com sucesso! Aguardando aprovação do administrador.",
  "coupon": {
    "id": "uuid",
    "title": "30% OFF em pizzas grandes",
    "status": "PENDING",
    "isActive": false
  }
}
```

**Nota:** Cupom criado com status `PENDING` - precisa aprovação do admin para ficar ativo.

---

### 2. **Editar Cupom** (PUT)
**URL:** `http://localhost:5000/api/coupons/:id`  
**Autenticação:** Sim (Bearer Token - Role: COMPANY)

**Headers:**
```
Authorization: Bearer <token_da_empresa>
Content-Type: application/json
```

**Body (campos opcionais - só enviar o que quer alterar):**
```json
{
  "title": "35% OFF em pizzas grandes",
  "description": "Nova descrição",
  "discountValue": 35
}
```

**Resposta (200):**
```json
{
  "message": "Cupom atualizado com sucesso!",
  "coupon": { ... }
}
```

**Nota:** Se cupom estava aprovado, volta para `PENDING` após edição.

---

### 3. **Deletar Cupom** (DELETE)
**URL:** `http://localhost:5000/api/coupons/:id`  
**Autenticação:** Sim (Bearer Token - Role: COMPANY)

**Headers:**
```
Authorization: Bearer <token_da_empresa>
```

**Resposta (200):**
```json
{
  "message": "Cupom deletado com sucesso"
}
```

---

### 4. **Validar Código de Cupom** (POST)
**URL:** `http://localhost:5000/api/coupons/validate`  
**Autenticação:** Sim (Bearer Token - Role: COMPANY)

**Headers:**
```
Authorization: Bearer <token_da_empresa>
Content-Type: application/json
```

**Body:**
```json
{
  "code": "ABC12345"
}
```

**Resposta (200):**
```json
{
  "message": "Cupom validado com sucesso!",
  "couponUsage": {
    "code": "ABC12345",
    "user": {
      "fullName": "João Silva",
      "email": "joao@teste.com"
    },
    "coupon": {
      "title": "20% de desconto no rodízio",
      "discountType": "PERCENTAGE",
      "discountValue": 20
    },
    "usedAt": "2025-11-06T..."
  }
}
```

---

## 👤 Endpoints para Clientes

### 5. **Usar Cupom** (POST) - Gerar Código Único
**URL:** `http://localhost:5000/api/coupons/:id/use`  
**Autenticação:** Sim (Bearer Token - Role: CUSTOMER)

**Headers:**
```
Authorization: Bearer <token_do_cliente>
```

**Resposta (201):**
```json
{
  "message": "Cupom ativado com sucesso!",
  "code": "ABC12345",
  "couponUsage": {
    "id": "uuid",
    "code": "ABC12345",
    "coupon": {
      "title": "20% de desconto no rodízio",
      "description": "...",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "validUntil": "2026-01-06T..."
    },
    "createdAt": "2025-11-06T..."
  },
  "qrCode": "CLUBELOCAL:coupon-id:ABC12345"
}
```

**Validações:**
- ✅ Cupom deve estar aprovado e ativo
- ✅ Cupom não pode estar expirado
- ✅ Usuário não pode ter usado mais que `maxUsesPerUser`
- ✅ Cupom não pode ter atingido `totalUsesLimit` (se houver)

---

## 🧪 Testes Rápidos (PowerShell)

### 1. Login como Empresa:
```powershell
$body = '{"email":"pizzaria@clubelocal.com","password":"123456"}'
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
$companyToken = $json.token
Write-Host "Token: $companyToken"
```

### 2. Criar Cupom:
```powershell
# Primeiro, buscar ID de uma categoria
$categories = Invoke-WebRequest -Uri "http://localhost:5000/api/coupons/categories" -UseBasicParsing
$catJson = $categories.Content | ConvertFrom-Json
$categoryId = $catJson.categories[0].id

# Criar cupom
$couponBody = @{
    title = "Teste Cupom"
    description = "Descrição do cupom"
    discountType = "PERCENTAGE"
    discountValue = 20
    validFrom = "2025-11-07T00:00:00Z"
    validUntil = "2025-12-07T23:59:59Z"
    categoryId = $categoryId
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $companyToken"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/coupons" `
    -Method POST `
    -Headers $headers `
    -Body $couponBody `
    -UseBasicParsing
```

### 3. Login como Cliente:
```powershell
$body = '{"email":"joao@teste.com","password":"123456"}'
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
$customerToken = $json.token
```

### 4. Usar Cupom (gerar código):
```powershell
# Primeiro, buscar ID de um cupom aprovado
$coupons = Invoke-WebRequest -Uri "http://localhost:5000/api/coupons" -UseBasicParsing
$couponsJson = $coupons.Content | ConvertFrom-Json
$couponId = $couponsJson.coupons[0].id

# Usar cupom
$headers = @{
    "Authorization" = "Bearer $customerToken"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/coupons/$couponId/use" `
    -Method POST `
    -Headers $headers `
    -UseBasicParsing
```

---

## ✅ Funcionalidades Implementadas

### Para Empresas:
- ✅ Criar cupom (status PENDING)
- ✅ Editar cupom próprio
- ✅ Deletar cupom próprio
- ✅ Validar código de cupom (marcar como usado)

### Para Clientes:
- ✅ Usar cupom (gerar código único de 8 caracteres)
- ✅ Validações de limites
- ✅ Verificação de validade
- ✅ QR Code string para frontend

### Sistema de Códigos:
- ✅ Código único de 8 caracteres
- ✅ Alfanumérico (sem I, O, 0, 1 para evitar confusão)
- ✅ Verificação de unicidade
- ✅ Formato: `ABC12345`

---

## 🔐 Segurança

- ✅ Apenas empresas podem criar/editar/deletar cupons
- ✅ Empresas só podem editar/deletar seus próprios cupons
- ✅ Apenas clientes podem usar cupons
- ✅ Validação de limites de uso
- ✅ Verificação de validade de datas
- ✅ Códigos únicos garantidos

---

## 📝 Próximos Passos

- Endpoints Admin (aprovar/rejeitar cupons)
- Endpoints de Usuário (perfil, favoritos)
- Integração com Frontend

