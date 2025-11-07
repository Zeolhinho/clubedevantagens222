# 🧪 Guia de Teste - ClubeLocal MVP

## 🚀 Iniciar o Projeto

```bash
cd "ClubeLocal App Prototype"
npm run dev
```

Acesse: **http://localhost:5173**

---

## ✅ Roteiro de Testes

### 1. **Landing Page** (/)
- [ok] Visualizar página inicial
- [ok] Clicar em "Entrar" → redireciona para `/login`
- [ok] Clicar em "Assinar Agora" → redireciona para `/signup`
- [ok] Scroll pela página (ver seções: Como Funciona, Categorias, Benefícios)

### 2. **Signup** (/signup)
- [ok] Clicar em "Criar conta" sem preencher → ver erros de validação 
- [ok] Preencher com email inválido → ver erro "E-mail inválido"
- [ok] Preencher senha curta (< 6 caracteres) → ver erro
- [ok] Preencher corretamente e submeter:
  - Nome: `João Silva`
  - Email: `joao@teste.com`
  - Senha: `123456`
   ##esta dando o erro seguinte "Invalid input: expected string, received undefined" em todos os campos
- [ok] Ver toast de sucesso ✅
- [ok] Ver loading spinner durante criação
- [ok] Ser redirecionado para `/dashboard`

### 3. **Dashboard do Usuário** (/dashboard)
- [ok] Ver status da assinatura ativa (bolinha verde)
- [ok] Ver nome e email no perfil (quando clicar em aba Perfil)
- [ok] Ver lista de cupons

#### 3.1. **Busca**
- [ok] Digitar na busca: "pizza"
- [ok] Ver apenas cupons relacionados (debounce de 300ms)
- [ok] Limpar busca

#### 3.2. **Filtros de Categoria**
- [ok] Clicar em "Alimentação" → ver apenas cupons de alimentação
- [ok] Clicar em "Beleza" → ver cupons de beleza
- [ok] Clicar em "Todos" → ver todos novamente

#### 3.3. **Favoritar Cupons**
- [ok] Clicar no ❤️ de um cupom → ver toast "adicionado aos favoritos"
- [ok] Coração ficar vermelho
- [ok] Ir para aba "Favoritos" → ver cupom favoritado
- [ok] Clicar novamente no ❤️ → remover dos favoritos
- [ok] Ver toast "removido dos favoritos"

#### 3.4. **Usar Cupom**
- [ok] Clicar em "Usar Cupom"
- [ok] Ver modal com:
  - QR Code real (gerado dinamicamente)
  - Código do cupom
  - Informações do estabelecimento
- [ok] Clicar em copiar código → ver toast "Código copiado!"
- [ok] Fechar modal

#### 3.5. **Navegação Entre Abas**
- [ok] Clicar em "Início" (ícone casa)
- [ok] Clicar em "Favoritos" (ícone estrela)
- [ok] Clicar em "Histórico" (ícone relógio)
- [ok] Clicar em "Perfil" (ícone pessoa)
- [ok] Ver informações do usuário no perfil
- [ok] Ver estatísticas (cupons usados, economia, favoritos)

### 4. **Logout**
- [ok] Ir para aba "Perfil"
- [ok] Clicar em "Sair da conta"
- [ok] Ser redirecionado para `/`
- [ok] Tentar acessar `/dashboard` diretamente → ser redirecionado para `/login`

### 5. **Login como Empresa** (/login)
- [ok] Email: `empresa@teste.com`
- [ok] Senha: `123456`
- [ok] Ver toast de sucesso
- [ok] Ser redirecionado para `/business`
- [ok] Ver Dashboard da Empresa:
  - Estatísticas (Cupons Ativos, Usados, Taxa de Conversão)
  - Lista de cupons da empresa
  - Botões de editar, pausar, estatísticas
- [ok] Clicar em "+ Criar Cupom" → ver modal
- [ok] Fazer logout

### 6. **Login como Admin** (/login)
- [ok] Email: `admin@teste.com`
- [ok] Senha: `123456`
- [ok] Ser redirecionado para `/admin`
- [ok] Ver Painel Administrativo:
  - Cards com estatísticas gerais
  - Abas: Empresas, Cupons, Usuários, Analytics
  - Aprovar/Rejeitar empresas pendentes
  - Aprovar/Rejeitar cupons pendentes
- [ok] Fazer logout

### 7. **Persistência de Dados**
- [ok] Fazer login como usuário
- [ok] Favoritar 2-3 cupons
- [ok] **Recarregar a página (F5)**
- [ok] Verificar se continua logado ✅
- [ok] Ir para aba Favoritos → ver cupons favoritados ✅
- [ok] **Fechar aba e abrir novamente**
- [ok] Verificar se ainda está logado

### 8. **Rotas Protegidas**
- [ok] Fazer logout (estar deslogado)
- [ok] Tentar acessar `/dashboard` diretamente → redirecionar para `/login`
- [ok] Fazer login como empresa
- [ok] Tentar acessar `/dashboard` → ser redirecionado para `/business`
- [ok] Tentar acessar `/admin` → ser redirecionado para `/business`

### 9. **Responsividade (opcional)**
- [ok] Redimensionar janela para mobile (< 768px)
- [ok] Ver layout adaptado
- [ok] Ver navegação inferior (bottom nav) no dashboard
- [ok] Testar filtros e busca no mobile

### 10. **Validações de Formulário**
- [ok] Ir para `/login`
- [ok] Tentar submeter vazio → ver erros
- [ok] Colocar email inválido → ver erro específico
- [ok] Colocar senha muito curta → ver erro específico
- [ok] Ver mensagens em português ✅

---

## 🎯 Checklist Final

✅ Todas as navegações funcionando  
✅ Login/Signup com validação  
✅ Busca com debounce  
✅ Filtros por categoria  
✅ Favoritos persistem  
✅ QR Code real gerado  
✅ Toast notifications aparecem  
✅ Loading states visíveis  
✅ Logout limpa dados  
✅ Rotas protegidas funcionando  
✅ LocalStorage persistindo dados  

---

## 🐛 Encontrou um Bug?

Documente:
1. O que você estava fazendo
2. O que esperava que acontecesse
3. O que realmente aconteceu
4. Console do navegador (F12) - erros em vermelho

---

## 📸 Screenshot dos Toasts Esperados

- **Login:** "Login realizado com sucesso!"
- **Signup:** "Conta criada com sucesso! Bem-vindo(a)!"
- **Favoritar:** "Cupom adicionado aos favoritos! ❤️"
- **Desfavoritar:** "Cupom removido dos favoritos"
- **Usar cupom:** "Cupom ativado! 🎉"
- **Copiar código:** "Código copiado!"

---

**Tempo estimado de teste:** 15-20 minutos

**Status:** ✅ Pronto para testar!

