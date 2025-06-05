# 🌱 Hidroponia Site - Backend

Bem-vindo ao backend do **Hidroponia Site**!  
Este projeto é uma API moderna e segura para gestão de pedidos, usuários e produtos em um sistema de hortas hidropônicas.

---

## 🚀 Funcionalidades

- **Autenticação JWT** com refresh token
- **Cadastro, login, logout** e recuperação de senha por email
- **Gestão de pedidos**: criação, histórico, upload de comprovante, cancelamento e edição
- **Gestão de produtos**: listagem e controle de estoque
- **Área do cliente**: atualização de perfil, troca de senha, exclusão de conta
- **Auditoria completa** das ações do usuário
- **Testes automatizados** com Jest + Supertest
- **Upload seguro** de arquivos (comprovantes)
- **Proteção de rotas** e permissões

---

## 🛠️ Tecnologias

- Node.js + Express
- PostgreSQL
- JWT (JSON Web Token)
- Multer (upload)
- Nodemailer (email)
- Jest + Supertest (testes)
- Dotenv

---

## ⚡ Como rodar

1. **Clone o repositório**
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas variáveis (exemplo no `.env.example`)
4. Crie o banco de dados usando o script em `/conections/hidroponia.sql`
5. Inicie o servidor:
   ```bash
   npm start
   ```
6. Rode os testes:
   ```bash
   npm test
   ```

---

## 📁 Estrutura

```
├── controllers/
├── models/
├── routes/
├── middlewares/
├── uploads/
├── conections/
├── tests/
├── app.js
├── .env
├── .gitignore
└── package.json
```

---

## 💡 Diferenciais

- Segurança de ponta a ponta
- Auditoria de todas as ações sensíveis
- Pronto para integração com frontend moderno (React, Vue, etc)
- Fácil de evoluir para múltiplos perfis (cliente, funcionário, admin)
- Código limpo, modular e testado

---

## 🌱 Hidroponia Site — Tecnologia para uma alimentação mais saudável!
