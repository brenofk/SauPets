// Para rodar no terminal, node server.js

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

// ✅ Nova rota: Buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Rota para cadastrar um pet
app.post("/pets", async (req, res) => {
  try {
    const { nome, tipo, usuarioId } = req.body;

    const novoPet = await prisma.pet.create({
      data: {
        nome,
        tipo,
        usuario_id: Number(usuarioId), // ✅ campo correto no schema
      },
    });

    res.json(novoPet);
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({ error: "Erro ao cadastrar pet" });
  }
});

// Rota para listar pets de um usuário
app.get("/pets/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const pets = await prisma.pet.findMany({
      where: { usuario_id: Number(usuarioId) }, // ✅ campo correto no schema
    });

    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

// ✅ Rota para listar vacinas de todos os pets de um usuário
app.get("/vacinas/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Busca todas as vacinas relacionadas aos pets do usuário
    const vacinas = await prisma.vacina.findMany({
      where: {
        pet: {
          usuario_id: Number(usuarioId), // usa o relacionamento
        },
      },
      include: {
        pet: {
          select: { nome: true },
        },
      },
    });

    res.json(vacinas);
  } catch (error) {
    console.error("Erro ao buscar vacinas:", error);
    res.status(500).json({ error: "Erro ao buscar vacinas" });
  }
});

