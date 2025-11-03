import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";       // <--- ✅ importa o dotenv
import { PrismaClient } from "@prisma/client";

dotenv.config();                   // <--- ✅ carrega as variáveis do .env

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🧠 Rota de cadastro de usuário (com senha segura)
app.post("/usuarios", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;

  try {
    const pepper = process.env.PASSWORD_PEPPER || "";
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

    const senhaComPepper = senha + pepper;
    const senhaHash = await bcrypt.hash(senhaComPepper, saltRounds);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha: senhaHash },
    });

    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

// ✅ Teste rápido
app.get("/", (req, res) => {
  res.send("API do SauPets funcionando 🐾");
});

app.listen(3000, () =>
  console.log("🚀 Servidor rodando em http://localhost:3000")
);
