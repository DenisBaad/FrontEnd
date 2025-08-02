# 📊 Sistema de Gestão de Faturas e Clientes com Autenticação por Usuário

🔗 Acesse o sistema em produção:
👉 https://apolo-orcin.vercel.app/login

Este projeto é uma aplicação web full stack desenvolvida com foco em autenticação, controle individualizado de dados e geração de relatórios. Ele simula um sistema de gestão onde **cada usuário cadastrado possui seus próprios dados isolados**, 
garantindo segurança, privacidade e escalabilidade no uso da aplicação.

---

## 💡 Visão Geral

O sistema foi pensado para resolver um problema comum em projetos de demonstração: todos testarem com o mesmo usuário. Para isso, foi implementado um **fluxo completo de autenticação com JWT** e vinculação de dados por usuário.

Cada usuário pode:

- Fazer **cadastro** e **login** com e-mail e senha
- Gerenciar seus **clientes**, **planos** e **faturas**
- Ter **dados 100% isolados** de outros usuários
- Gerar **relatórios personalizados de faturas por cliente**, com filtros avançados

Além disso, foi criado um **serviço em background** que verifica periodicamente faturas vencidas e automaticamente:

- Atualiza o status da fatura para "Atrasada"
- Inativa o cliente relacionado

---

## 🔗 Fluxo do Sistema

1. **Cadastro de Usuário:** Crie seu próprio usuário na aplicação.
2. **Login:** Acesse o sistema com seus dados; um **token JWT** será gerado.
3. **Cadastro de Cliente:** Vinculado ao seu `userId`.
4. **Cadastro de Plano:** Também vinculado ao seu `userId`.
5. **Cadastro de Fatura:** Relacionada a um cliente e plano do usuário.
6. **Relatórios de Faturas:** Gere relatórios com múltiplos filtros:
   - Clientes (multi-seleção)
   - Status da fatura (emitida, vencida, etc.)
   - Intervalo de datas

---

🧱 Estratégias de Arquitetura no Backend
Para garantir robustez, escalabilidade e manutenção do sistema, foram adotadas diversas boas práticas e padrões no backend:

✅ Fluent Validation: Validação clara, reutilizável e desacoplada das entidades.

✅ Middleware de tratamento de erros: Captura global de exceções com respostas padronizadas.

✅ Filtro de exceções: Tratamento centralizado de erros em endpoints específicos.

✅ AutoMapper: Mapeamento automático entre DTOs e entidades de domínio.

✅ Migrations com EF Core: Controle de versões do banco de dados de forma segura e rastreável.

✅ Injeção de Dependências: Uso nativo do DI container do ASP.NET Core para manter o código desacoplado e testável.

✅ Mensagens personalizadas por cultura (Localization): As mensagens de erro são traduzidas dinamicamente conforme o idioma da requisição (ex: pt-BR ou en-US).

✅ Serviço em background (Hosted Service): Processo contínuo que verifica faturas vencidas e aplica regras de negócio automaticamente.

---

## 🧠 Estratégias de Arquitetura no Frontend
Durante o desenvolvimento da interface com Angular, foram aplicadas boas práticas para garantir **performance, organização e manutenção do código**:

- ✅ **Lazy Loading de Módulos:** Melhora a performance ao carregar partes do sistema sob demanda.

- ✅ **Guarda de Rotas (Route Guards):** Protege páginas internas contra acesso não autorizado.

- ✅ **Gerenciamento de Assinaturas:** Uso consciente de `takeUntil`, `async pipe` e `Subject` para evitar **memory leaks** em componentes.

- ✅ **Estrutura modularizada por feature:** Facilita escalabilidade e isolamento de responsabilidades.

- ✅ **Componentes reutilizáveis:** Interfaces mais consistentes e fáceis de manter.

---

## ⚙️ Tecnologias Utilizadas

### Backend
- ASP.NET Core
- Entity Framework Core
- JWT Authentication
- MySQL
- BackgroundService (Hosted Service)

### Frontend
- Angular
- Angular Material
- Html
- Css
- Typescript

### Outros
- Docker (para deploy)
- Swagger (documentação da API)
- Azure DevOps (CI/CD configurado via pipelines)
- Git (versionamento do código)

---

## 📦 Funcionalidades

- [x] Cadastro/Login com autenticação JWT
- [x] CRUD de Clientes
- [x] CRUD de Planos
- [x] CRUD de Faturas
- [x] Relatório de Faturas por Cliente com múltiplos filtros
- [x] Serviço em background para inativar clientes com faturas vencidas
- [x] Separação de dados por `userId` para garantir segurança
- [x] Interface amigável e responsiva com Angular + Angular Material

---

## 🚀 Como Rodar

### Pré-requisitos

- Docker (ou .NET + Angular CLI + MySQL local)
- Node.js (para o frontend)

### Clonar o projeto
