# Integração Frontend com Backend API

## ✅ O que foi implementado

### 1. Configuração do Axios
- ✅ Arquivo `src/lib/api.ts` com configuração base
- ✅ Interceptor para adicionar token JWT automaticamente
- ✅ Interceptor para tratar erros 401 (token expirado)
- ✅ URL base configurável via `VITE_API_URL`

### 2. Serviços de API
- ✅ `src/services/authService.ts` - Autenticação (login, signup, logout)
- ✅ `src/services/couponService.ts` - Cupons (listar, buscar, usar, criar, editar, deletar)
- ✅ `src/services/userService.ts` - Usuário (perfil, favoritos, histórico)
- ✅ `src/services/adminService.ts` - Admin (stats, empresas, cupons, usuários)

### 3. Integração de Autenticação
- ✅ `AuthContext` atualizado para usar API real
- ✅ Login e Signup conectados ao backend
- ✅ Token JWT salvo automaticamente
- ✅ Redirecionamento após login/signup

### 4. Integração de Cupons
- ✅ `UserDashboard` busca cupons do backend
- ✅ Filtros por categoria funcionando
- ✅ Busca por texto funcionando
- ✅ Paginação implementada
- ✅ Loading states (skeleton)
- ✅ Adaptador de cupons (`couponAdapter.ts`) para converter formato API → Frontend

### 5. Integração de Favoritos
- ✅ `FavoritesContext` atualizado para usar API
- ✅ Favoritos por empresa (conforme backend)
- ✅ Compatibilidade com favoritos locais (offline)
- ✅ Sincronização automática quando autenticado

### 6. Integração de Uso de Cupons
- ✅ `CouponModal` atualizado para gerar código via API
- ✅ QR Code gerado com código real
- ✅ Botão "Usar Cupom" chama API
- ✅ Loading state durante ativação

## 🔄 Como funciona

### Fluxo de Autenticação
1. Usuário faz login/signup
2. API retorna token JWT + dados do usuário
3. Token é salvo no localStorage
4. Token é adicionado automaticamente em todas as requisições
5. Se token expirar (401), usuário é redirecionado para login

### Fluxo de Cupons
1. Dashboard carrega categorias da API
2. Carrega cupons com filtros/paginação
3. Cupons são adaptados para formato do frontend
4. Usuário pode buscar, filtrar, favoritar
5. Ao usar cupom, código único é gerado via API

### Fluxo de Favoritos
1. Se autenticado: carrega favoritos da API (por empresa)
2. Se não autenticado: usa localStorage
3. Ao favoritar: chama API para adicionar/remover empresa
4. Estado local sincronizado com API

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Como testar

1. **Inicie o backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicie o frontend:**
   ```bash
   npm run dev
   ```

3. **Teste o fluxo completo:**
   - Criar conta / Login
   - Ver cupons do banco de dados
   - Buscar e filtrar cupons
   - Favoritar empresas
   - Usar cupom (gerar código)

## 🐛 Problemas conhecidos

- Favoritos por empresa: O backend usa favoritos por empresa, mas o frontend também mantém favoritos por cupom para compatibilidade
- Categorias: Se selecionar categoria antes de carregar, pode não filtrar corretamente na primeira vez

## 🚀 Próximos passos

- [ ] Integrar histórico de cupons usados
- [ ] Integrar perfil do usuário (atualizar dados)
- [ ] Integrar dashboard de empresa
- [ ] Integrar dashboard de admin
- [ ] Adicionar tratamento de erros mais robusto
- [ ] Adicionar retry automático em caso de falha de rede

