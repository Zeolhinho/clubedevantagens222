# Script PowerShell para testar a API ClubeLocal

Write-Host "🧪 Testando API ClubeLocal" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Health Check
Write-Host "1️⃣ Testando Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📄 Resposta:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    Write-Host ""
}

# Teste 2: Login
Write-Host "2️⃣ Testando Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "joao@teste.com"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📄 Resposta:" -ForegroundColor Cyan
    $jsonResponse = $response.Content | ConvertFrom-Json
    $jsonResponse | ConvertTo-Json -Depth 5
    
    # Salvar token para próximos testes
    if ($jsonResponse.token) {
        $global:token = $jsonResponse.token
        Write-Host ""
        Write-Host "🔑 Token salvo para próximos testes!" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

# Teste 3: Signup (criar nova conta)
Write-Host "3️⃣ Testando Signup..." -ForegroundColor Yellow
$signupBody = @{
    email = "novo$(Get-Random)@teste.com"
    password = "123456"
    fullName = "Usuário Teste"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signupBody `
        -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📄 Resposta:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor: $responseBody" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "✨ Testes concluídos!" -ForegroundColor Cyan

