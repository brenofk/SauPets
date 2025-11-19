# 🐾 SauPet

**SauPet** é um aplicativo mobile desenvolvido com **React Native (Expo)** que ajuda tutores de pets a gerenciar os documentos dos seus animais — como carteiras de vacinação, registros médicos e outros documentos importantes — de forma prática e organizada.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React Native, Expo, TypeScript, React Navigation, @expo/vector-icons  
- **Backend:** Node.js, Express.js  
- **Banco de Dados:** MySQL  
- **ORM:** Prisma  
- **Gerenciamento de Estado/Autenticação:** Context API  
- **Armazenamento Local:** AsyncStorage  

---

## 📂 Estrutura do Projeto

SauPet/  
├─ App.tsx  
├─ src/  
│  ├─ screens/  
│  │  ├─ Auth/        # Login e Cadastro  
│  │  ├─ Main/        # Dashboard, Configurações, Perfil  
│  │  ├─ Pets/        # Cadastro de Pets e Vacinas  
│  ├─ contexts/       # AuthContext  
│  ├─ routes/         # AppRoutes.tsx  
│  ├─ config/         # Configurações, API_URL  
├─ server/             # Backend Node.js  
│  ├─ server.js  
│  ├─ routes/  
│  ├─ controllers/  
│  └─ models/  
│     └─ schema.prisma # Modelo do banco (Prisma)  
├─ package.json  
└─ README.md  

---

## 🐾 Modelos de Dados

### Usuário (`users`)
| Campo       | Tipo       | Observações                  |
|------------|------------|-----------------------------|
| id         | INT        | PK, auto-increment           |
| nome       | VARCHAR    | Nome do usuário              |
| email      | VARCHAR    | Único                        |
| senha      | VARCHAR    | Criptografada                |
| telefone   | VARCHAR    | Opcional                     |
| cpf        | VARCHAR    | Opcional                     |

### Pets (`pets`)
| Campo       | Tipo       | Observações                  |
|------------|------------|-----------------------------|
| id         | INT        | PK, auto-increment           |
| nome       | VARCHAR    | Obrigatório                  |
| tipo       | VARCHAR    | Cachorro/Gato                |
| sexo       | CHAR       | Opcional                     |
| peso       | DECIMAL    | Opcional                     |
| foto_url   | VARCHAR    | Opcional                     |
| usuarioId  | INT        | FK → users.id                |

### Vacinas (`vacinas`)
| Campo           | Tipo       | Observações                  |
|-----------------|------------|-----------------------------|
| id              | INT        | PK, auto-increment           |
| pet_id          | INT        | FK → pets.id                 |
| nome_vacina     | VARCHAR    | Obrigatório                  |
| data_aplicacao  | DATE       | Obrigatório                  |
| data_reforco    | DATE       | Opcional                     |
| veterinario     | VARCHAR    | Opcional                     |

### Lembretes (`lembretes`)
| Campo           | Tipo       | Observações                  |
|-----------------|------------|-----------------------------|
| id              | INT        | PK, auto-increment           |
| pet_id          | INT        | FK → pets.id                 |
| titulo          | VARCHAR    | Obrigatório                  |
| descricao       | TEXT       | Opcional                     |
| data_hora       | DATETIME   | Obrigatório                  |

---

## 🌐 Rotas Principais da API

| Método | Rota                     | Descrição                        |
|--------|--------------------------|---------------------------------|
| POST   | `/login`                 | Autenticação de usuário          |
| POST   | `/usuarios`              | Cadastro de usuário              |
| GET    | `/pets/:usuarioId`       | Lista pets de um usuário         |
| POST   | `/pets`                  | Cadastrar um novo pet            |
| POST   | `/vacinas`               | Cadastrar vacina para um pet     |
| GET    | `/vacinas/:petId`        | Listar vacinas de um pet         |
| POST   | `/lembretes`             | Cadastrar lembrete para um pet   |
| GET    | `/lembretes/:petId`      | Listar lembretes de um pet       |

---

## 💻 Como instalar e rodar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/brenofk/SauPets
cd SauPets
```

### 2️⃣ Configurar Backend
```
cd SauPets
npm install
```

### 2.2
Configurar banco de dados
Instale MySQL e crie o banco:
```
CREATE DATABASE saupet;
```

### 2.3
Configure o usuário, senha e host no arquivo .env:
```
DATABASE_URL="mysql://usuario:senha@localhost:3306/saupet"
```
### 2.4
Configure também API_URL no frontend (src/config/config.ts):
```
export const API_URL = "http://SEU_IP_LOCAL:3000";
```

### 2.5 
Rodar migrações Prisma
```
npx prisma migrate dev --name init
```

### 2.6
Rodar backend
```
node server.js
```
### 3️⃣ Configurar Frontend
### 3.0
Instalar dependências
```
npx expo install @expo/vector-icons
```

#### 3.1 
Rodar frontend
```
npm start
```




