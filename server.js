import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de cadastro
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, cpf, email, telefone, senha } = req.body;

    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        cpf,
        email,
        telefone,
        senha, // texto puro
      },
    });

    res.json({ id: novoUsuario.id });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findFirst({
      where: { email, senha }, // senha em texto puro
    });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    res.json({ id: usuario.id, nome: usuario.nome });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Outras rotas (pets, vacinas etc.) permanecem iguais...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
