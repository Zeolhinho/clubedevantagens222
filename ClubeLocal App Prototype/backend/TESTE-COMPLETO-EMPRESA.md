# 🧪 Teste Completo - Criar Cupom (Passo a Passo)

## 📋 Passo a Passo Completo

### **PASSO 1: Fazer Login como Empresa**

**POST** `http://localhost:5000/api/auth/login`

**Body:**
```json
{
  "email": "pizzaria@clubelocal.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "pizzaria@clubelocal.com",
    "role": "COMPANY"
  }
}
```

**⚠️ IMPORTANTE:** Copie o `token` da resposta!

---

### **PASSO 2: Buscar ID de uma Categoria**

**GET** `http://localhost:5000/api/coupons/categories`

**Resposta:**
```json
{
  "categories": [
    {
      "id": "abc-123-def",
      "name": "Alimentação",
      "icon": "🍔",
      "couponCount": 2
    }
  ]
}
```

**⚠️ IMPORTANTE:** Copie o `id` da categoria que você quer usar!

---

### **PASSO 3: Criar Cupom (com Token!)**

**POST** `http://localhost:5000/api/coupons`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
  "termsConditions": "Válido apenas de segunda a quinta.",
  "validFrom": "2025-11-07T00:00:00Z",
  "validUntil": "2025-12-07T23:59:59Z",
  "maxUsesPerUser": 1,
  "totalUsesLimit": 100,
  "categoryId": "abc-123-def"
}
```

**✅ Sucesso (201):**
```json
{
  "message": "Cupom criado com sucesso! Aguardando aprovação do administrador.",
  "coupon": {
    "id": "novo-uuid",
    "title": "30% OFF em pizzas grandes",
    "status": "PENDING",
    "isActive": false
  }
}
```

---

## 🖥️ Teste no PowerShell (Automático)

Cole este script completo no PowerShell:

```powershell
# PASSO 1: Login como Empresa
Write-Host "1. Fazendo login como empresa..." -ForegroundColor Yellow
$loginBody = '{"email":"pizzaria@clubelocal.com","password":"123456"}'
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody `
    -UseBasicParsing

$loginJson = $loginResponse.Content | ConvertFrom-Json
$token = $loginJson.token
Write-Host "✅ Token obtido!" -ForegroundColor Green
Write-Host ""

# PASSO 2: Buscar Categorias
Write-Host "2. Buscando categorias..." -ForegroundColor Yellow
$categoriesResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/coupons/categories" -UseBasicParsing
$categoriesJson = $categoriesResponse.Content | ConvertFrom-Json
$categoryId = $categoriesJson.categories[0].id
Write-Host "✅ Categoria encontrada: $($categoriesJson.categories[0].name) (ID: $categoryId)" -ForegroundColor Green
Write-Host ""

# PASSO 3: Criar Cupom
Write-Host "3. Criando cupom..." -ForegroundColor Yellow
$couponBody = @{
    title = "30% OFF em pizzas grandes"
    description = "Desconto válido para pizzas grandes. Não cumulativo."
    discountType = "PERCENTAGE"
    discountValue = 30
    imageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
    termsConditions = "Válido apenas de segunda a quinta."
    validFrom = "2025-11-07T00:00:00Z"
    validUntil = "2025-12-07T23:59:59Z"
    maxUsesPerUser = 1
    totalUsesLimit = 100
    categoryId = $categoryId
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $createResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/coupons" `
        -Method POST `
        -Headers $headers `
        -Body $couponBody `
        -UseBasicParsing
    
    Write-Host "✅ Status: $($createResponse.StatusCode)" -ForegroundColor Green
    $createJson = $createResponse.Content | ConvertFrom-Json
    Write-Host "📄 Resposta:" -ForegroundColor Cyan
    $createJson | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor: $responseBody" -ForegroundColor Red
    }
}
```

---

## 🎯 Teste no Thunder Client (VS Code)

### **1. Login:**
- New Request
- POST `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "pizzaria@clubelocal.com",
  "password": "123456"
}
```
- Send
- **Copie o token** da resposta

### **2. Buscar Categorias:**
- New Request
- GET `http://localhost:5000/api/coupons/categories`
- Send
- **Copie o ID** de uma categoria

### **3. Criar Cupom:**
- New Request
- POST `http://localhost:5000/api/coupons`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer <cole_o_token_aqui>`
- Body (JSON):
```json
{
  "title": "30% OFF em pizzas grandes",
  "description": "Desconto válido para pizzas grandes.",
  "discountType": "PERCENTAGE",
  "discountValue": 30,
  "validFrom": "2025-11-07T00:00:00Z",
  "validUntil": "2025-12-07T23:59:59Z",
  "maxUsesPerUser": 1,
  "categoryId": "<cole_o_id_da_categoria>"
}
```
- Send

---

## 🔑 Contas de Teste

**Empresa:**
- Email: `pizzaria@clubelocal.com`
- Senha: `123456`

**Cliente:**
- Email: `joao@teste.com`
- Senha: `123456`

**Admin:**
- Email: `admin@clubelocal.com`
- Senha: `123456`

---

## ⚠️ Erros Comuns

**401 Unauthorized:**
- Token não foi enviado
- Token inválido ou expirado
- Solução: Faça login novamente

**403 Forbidden:**
- Usuário não tem role COMPANY
- Solução: Use conta de empresa

**400 Bad Request:**
- Campos obrigatórios faltando
- Datas inválidas
- Solução: Verifique o body da requisição

---

## ✅ Checklist

- [ ] Login como empresa feito
- [ ] Token copiado
- [ ] Categoria buscada
- [ ] CategoryId copiado
- [ ] Header Authorization configurado
- [ ] Body JSON completo
- [ ] Cupom criado com sucesso

