# 🧪 Guia de Teste Completo - ClubeLocal MVP

Este guia cobre todos os fluxos principais da aplicação integrada com o backend.

## 📋 Pré-requisitos

1. **Backend rodando:**
   ```bash
   cd "ClubeLocal App Prototype/backend"
   npm run dev
   ```
   - Deve estar rodando em `http://localhost:5000`

2. **Frontend rodando:**
   ```bash
   cd "ClubeLocal App Prototype"
   npm run dev
   ```
   - Deve estar rodando em `http://localhost:5173` (ou porta similar)

3. **Banco de dados populado:**
   - Execute o seed se necessário: `npm run prisma:seed`

---

## 👤 1. TESTE DE AUTENTICAÇÃO

### 1.1 Criar Conta (Signup)

**Passos:**
1. Acesse `http://localhost:5173`
2. Clique em "Criar Conta" ou acesse `/signup`
3. Preencha o formulário:
   - Nome: `Teste Usuario`
   - Email: `teste@exemplo.com`
   - Senha: `123456` (mínimo 6 caracteres)
4. Clique em "Criar Conta"

**Resultado esperado:**
- ✅ Toast verde: "Conta criada com sucesso! Bem-vindo(a)!"
- ✅ Redirecionamento automático para `/dashboard`
- ✅ Usuário logado aparece no header

**Teste de erro:**
- Tente criar conta com email já existente
- Deve mostrar toast de erro (sem duplicação)
- Toast deve permanecer visível por 4 segundos

### 1.2 Login

**Passos:**
1. Faça logout (se estiver logado)
2. Acesse `/login`
3. Use credenciais de teste:
   - **Cliente:** `joao@teste.com` / `123456`
   - **Empresa:** `pizzaria@clubelocal.com` / `123456`
   - **Admin:** `admin@clubelocal.com` / `123456`
4. Clique em "Entrar"

**Resultado esperado:**
- ✅ Toast verde: "Login realizado com sucesso!"
- ✅ Redirecionamento automático baseado no role:
  - Cliente → `/dashboard`
  - Empresa → `/business`
  - Admin → `/admin`

**Teste de erro:**
- Tente login com senha errada
- Deve mostrar toast de erro (sem duplicação)
- Toast deve permanecer visível por 4 segundos

### 1.3 Logout

**Passos:**
1. Estando logado, clique em "Sair da conta" (no perfil)
2. Ou use o botão de logout no header

**Resultado esperado:**
- ✅ Toast informativo: "Logout realizado"
- ✅ Redirecionamento para `/`
- ✅ Token removido do localStorage

---

## 🎫 2. TESTE DE CUPONS (Cliente)

### 2.1 Listar Cupons

**Passos:**
1. Faça login como cliente (`joao@teste.com`)
2. Acesse `/dashboard`
3. Aguarde carregar os cupons

**Resultado esperado:**
- ✅ Skeleton loading aparece durante carregamento
- ✅ Cupons do banco de dados são exibidos
- ✅ Cada cupom mostra: imagem, título, empresa, desconto, categoria

### 2.2 Buscar Cupons

**Passos:**
1. No dashboard, use a barra de busca
2. Digite: `pizza` ou `restaurante`
3. Aguarde 300ms (debounce)

**Resultado esperado:**
- ✅ Apenas cupons que contêm o termo são exibidos
- ✅ Busca funciona em título, descrição e nome da empresa

### 2.3 Filtrar por Categoria

**Passos:**
1. Clique em uma categoria (ex: "Alimentação")
2. Observe os cupons filtrados

**Resultado esperado:**
- ✅ Apenas cupons da categoria selecionada são exibidos
- ✅ Badge da categoria fica destacado
- ✅ Clicar em "Todos" remove o filtro

### 2.4 Paginação

**Passos:**
1. Role até o final da lista de cupons
2. Clique em "Carregar mais"

**Resultado esperado:**
- ✅ Mais cupons são carregados
- ✅ Skeleton aparece durante carregamento
- ✅ Botão desaparece quando não há mais cupons

### 2.5 Usar Cupom

**Passos:**
1. Clique em "Usar Cupom" em qualquer cupom
2. Modal abre
3. Clique em "Usar Cupom" no modal

**Resultado esperado:**
- ✅ Loading aparece no botão
- ✅ Toast verde: "Cupom ativado com sucesso! 🎉"
- ✅ QR Code é gerado
- ✅ Código único é exibido
- ✅ Botão muda para "Fechar"

**Teste de erro:**
- Tente usar o mesmo cupom novamente (se houver limite)
- Deve mostrar erro apropriado

### 2.6 Copiar Código do Cupom

**Passos:**
1. Após usar um cupom, clique no ícone de copiar
2. Verifique se foi copiado

**Resultado esperado:**
- ✅ Toast: "Código copiado!"
- ✅ Ícone muda para check
- ✅ Código está na área de transferência

---

## ❤️ 3. TESTE DE FAVORITOS

### 3.1 Adicionar Favorito

**Passos:**
1. No dashboard, clique no coração em um cupom
2. Observe o comportamento

**Resultado esperado:**
- ✅ Coração fica preenchido (vermelho)
- ✅ Toast: "Adicionado aos favoritos! ❤️"
- ✅ Favorito é salvo no backend

### 3.2 Remover Favorito

**Passos:**
1. Clique novamente no coração do cupom favoritado
2. Observe o comportamento

**Resultado esperado:**
- ✅ Coração fica vazio
- ✅ Toast: "Removido dos favoritos"
- ✅ Favorito é removido do backend

### 3.3 Ver Favoritos

**Passos:**
1. Clique na aba "Favoritos" (ícone de estrela)
2. Observe a lista

**Resultado esperado:**
- ✅ Apenas cupons favoritados são exibidos
- ✅ Se não houver favoritos, mostra mensagem e botão para explorar

---

## 📜 4. TESTE DE HISTÓRICO

### 4.1 Ver Histórico de Cupons Usados

**Passos:**
1. Use alguns cupons primeiro (seção 2.5)
2. Clique na aba "Histórico" (ícone de relógio)
3. Aguarde carregar

**Resultado esperado:**
- ✅ Skeleton loading aparece
- ✅ Lista de cupons usados é exibida
- ✅ Cada item mostra: empresa, título, desconto, data de uso, código
- ✅ Badge "Usado" aparece em verde

**Teste de estado vazio:**
- Se não houver histórico, mostra mensagem e botão para explorar

---

## 👤 5. TESTE DE PERFIL

### 5.1 Ver Perfil

**Passos:**
1. Clique na aba "Perfil" (ícone de usuário)
2. Observe as informações

**Resultado esperado:**
- ✅ Skeleton loading aparece
- ✅ Nome, email e telefone (se houver) são exibidos
- ✅ Informações de assinatura (se houver)
- ✅ Estatísticas: cupons usados, economia total, favoritos

---

## 🏢 6. TESTE DE DASHBOARD EMPRESA

### 6.1 Acessar Dashboard

**Passos:**
1. Faça login como empresa (`pizzaria@clubelocal.com`)
2. Deve redirecionar para `/business`

**Resultado esperado:**
- ✅ Dashboard da empresa é exibido
- ✅ Nome da empresa aparece no header
- ✅ Estatísticas são carregadas

### 6.2 Ver Estatísticas

**Resultado esperado:**
- ✅ 3 cards com estatísticas:
  - Cupons Ativos
  - Cupons Usados
  - Total de Cupons

### 6.3 Listar Cupons da Empresa

**Passos:**
1. Role até "Meus Cupons"
2. Observe a lista

**Resultado esperado:**
- ✅ Skeleton loading aparece
- ✅ Apenas cupons da empresa logada são exibidos
- ✅ Cada cupom mostra: imagem, título, status, usos, data de validade

### 6.4 Criar Cupom

**Passos:**
1. Clique em "Criar Cupom"
2. Preencha o formulário:
   - Título: `Teste Cupom`
   - Descrição: `Descrição do cupom de teste`
   - Tipo de desconto: `PERCENTAGE`
   - Valor: `20`
   - Imagem: URL válida (opcional)
   - Data início: Data futura
   - Data fim: Data futura
   - Categoria: Selecione uma
3. Clique em "Criar"

**Resultado esperado:**
- ✅ Toast verde: "Cupom criado com sucesso"
- ✅ Modal fecha
- ✅ Lista de cupons é atualizada
- ✅ Novo cupom aparece com status "Pendente"

### 6.5 Pausar/Ativar Cupom

**Passos:**
1. Encontre um cupom ativo
2. Clique no ícone de pausa
3. Observe o comportamento

**Resultado esperado:**
- ✅ Toast: "Cupom pausado com sucesso"
- ✅ Status muda para "Pausado"
- ✅ Botão muda para play (para reativar)

### 6.6 Deletar Cupom

**Passos:**
1. Clique no ícone de lixeira em um cupom
2. Confirme a exclusão

**Resultado esperado:**
- ✅ Confirmação aparece
- ✅ Toast: "Cupom excluído com sucesso"
- ✅ Cupom desaparece da lista

---

## 👨‍💼 7. TESTE DE DASHBOARD ADMIN

### 7.1 Acessar Dashboard

**Passos:**
1. Faça login como admin (`admin@clubelocal.com`)
2. Deve redirecionar para `/admin`

**Resultado esperado:**
- ✅ Dashboard admin é exibido
- ✅ 4 cards com estatísticas no topo

### 7.2 Ver Estatísticas Gerais

**Resultado esperado:**
- ✅ Assinantes Ativos
- ✅ Empresas Parceiras
- ✅ Cupons Aprovados
- ✅ Receita Mensal

### 7.3 Aprovar Empresa

**Passos:**
1. Vá para a aba "Empresas"
2. Encontre uma empresa com status "Pendente"
3. Clique em "Aprovar"

**Resultado esperado:**
- ✅ Toast: "Empresa aprovada com sucesso"
- ✅ Empresa desaparece da lista de pendentes
- ✅ Estatísticas são atualizadas

### 7.4 Rejeitar Empresa

**Passos:**
1. Encontre uma empresa pendente
2. Clique em "Rejeitar"

**Resultado esperado:**
- ✅ Toast: "Empresa suspensa"
- ✅ Empresa desaparece da lista

### 7.5 Aprovar Cupom

**Passos:**
1. Vá para a aba "Cupons"
2. Encontre um cupom pendente
3. Clique em "Aprovar"

**Resultado esperado:**
- ✅ Toast: "Cupom aprovado com sucesso"
- ✅ Cupom desaparece da lista de pendentes
- ✅ Estatísticas são atualizadas
- ✅ Cupom fica ativo para clientes

### 7.6 Rejeitar Cupom

**Passos:**
1. Encontre um cupom pendente
2. Clique em "Rejeitar"

**Resultado esperado:**
- ✅ Toast: "Cupom rejeitado"
- ✅ Cupom desaparece da lista

### 7.7 Ver Assinantes

**Passos:**
1. Vá para a aba "Assinantes"
2. Aguarde carregar

**Resultado esperado:**
- ✅ Skeleton loading aparece
- ✅ Lista de assinantes é exibida
- ✅ Cada linha mostra: nome, email, plano, data, cupons usados, status

---

## 🔄 8. TESTE DE FLUXO COMPLETO

### 8.1 Fluxo End-to-End

**Cenário:** Cliente usa cupom completo

1. **Login como Cliente**
   - Login: `joao@teste.com` / `123456`
   - ✅ Redireciona para dashboard

2. **Explorar Cupons**
   - Buscar por "pizza"
   - Filtrar por categoria "Alimentação"
   - ✅ Cupons filtrados aparecem

3. **Favoritar Cupom**
   - Clicar no coração
   - ✅ Cupom favoritado

4. **Usar Cupom**
   - Clicar em "Usar Cupom"
   - Clicar em "Usar Cupom" no modal
   - ✅ Código gerado
   - Copiar código
   - ✅ Código copiado

5. **Ver Histórico**
   - Ir para aba "Histórico"
   - ✅ Cupom usado aparece na lista

6. **Ver Perfil**
   - Ir para aba "Perfil"
   - ✅ Estatísticas atualizadas (cupons usados +1)

### 8.2 Fluxo Empresa Completo

**Cenário:** Empresa cria e gerencia cupom

1. **Login como Empresa**
   - Login: `pizzaria@clubelocal.com` / `123456`
   - ✅ Redireciona para dashboard empresa

2. **Criar Cupom**
   - Clicar em "Criar Cupom"
   - Preencher formulário
   - ✅ Cupom criado com status "Pendente"

3. **Aguardar Aprovação**
   - (Admin precisa aprovar)

4. **Login como Admin**
   - Login: `admin@clubelocal.com` / `123456`
   - Ir para aba "Cupons"
   - ✅ Cupom pendente aparece

5. **Aprovar Cupom**
   - Clicar em "Aprovar"
   - ✅ Cupom aprovado

6. **Voltar como Empresa**
   - Logout admin
   - Login empresa
   - ✅ Cupom aparece como "Ativo"

7. **Pausar Cupom**
   - Clicar em pausa
   - ✅ Cupom pausado

8. **Reativar Cupom**
   - Clicar em play
   - ✅ Cupom reativado

---

## 🐛 9. TESTE DE ERROS E VALIDAÇÕES

### 9.1 Validação de Formulários

**Login:**
- ✅ Email inválido mostra erro
- ✅ Senha vazia mostra erro
- ✅ Senha com menos de 6 caracteres mostra erro

**Signup:**
- ✅ Nome vazio mostra erro
- ✅ Email inválido mostra erro
- ✅ Senha fraca mostra erro

### 9.2 Tratamento de Erros da API

**Teste:**
1. Desligue o backend temporariamente
2. Tente fazer login
3. ✅ Toast de erro aparece (sem duplicação)
4. ✅ Mensagem de erro clara

**Teste:**
1. Tente usar cupom já usado (se houver limite)
2. ✅ Erro apropriado é exibido

### 9.3 Token Expirado

**Teste:**
1. Remova o token manualmente do localStorage
2. Tente acessar uma rota protegida
3. ✅ Redireciona para login
4. ✅ Toast informa sobre sessão expirada

---

## ✅ 10. CHECKLIST FINAL

### Autenticação
- [ ] Criar conta funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Redirecionamento por role funciona
- [ ] Toasts não duplicam
- [ ] Toasts permanecem visíveis por 4 segundos

### Cupons (Cliente)
- [ ] Listagem carrega do backend
- [ ] Busca funciona
- [ ] Filtro por categoria funciona
- [ ] Paginação funciona
- [ ] Usar cupom gera código único
- [ ] QR Code é gerado
- [ ] Copiar código funciona

### Favoritos
- [ ] Adicionar favorito funciona
- [ ] Remover favorito funciona
- [ ] Aba de favoritos mostra apenas favoritados
- [ ] Favoritos sincronizam com backend

### Histórico
- [ ] Histórico carrega do backend
- [ ] Cupons usados aparecem corretamente
- [ ] Estado vazio é tratado

### Perfil
- [ ] Perfil carrega do backend
- [ ] Estatísticas são exibidas corretamente
- [ ] Assinatura é exibida (se houver)

### Dashboard Empresa
- [ ] Estatísticas são exibidas
- [ ] Lista de cupons da empresa funciona
- [ ] Criar cupom funciona
- [ ] Pausar/ativar cupom funciona
- [ ] Deletar cupom funciona

### Dashboard Admin
- [ ] Estatísticas são exibidas
- [ ] Listar empresas pendentes funciona
- [ ] Aprovar empresa funciona
- [ ] Rejeitar empresa funciona
- [ ] Listar cupons pendentes funciona
- [ ] Aprovar cupom funciona
- [ ] Rejeitar cupom funciona
- [ ] Listar assinantes funciona

### Performance
- [ ] Loading states aparecem durante requisições
- [ ] Skeleton loaders aparecem
- [ ] Debounce na busca funciona (300ms)

### UX
- [ ] Mensagens de erro são claras
- [ ] Mensagens de sucesso são claras
- [ ] Estados vazios têm mensagens apropriadas
- [ ] Navegação é intuitiva

---

## 📝 Notas

- **Duração dos toasts:** 4 segundos (configurado)
- **Debounce da busca:** 300ms
- **Paginação:** 12 itens por página
- **URL da API:** `http://localhost:5000/api` (configurável via `.env`)

---

## 🚨 Problemas Conhecidos

Nenhum problema conhecido no momento. Se encontrar algum bug, documente aqui:

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se backend e frontend estão rodando
2. Verifique o console do navegador (F12)
3. Verifique os logs do backend
4. Verifique se o banco de dados está populado

---

**Última atualização:** $(date)

