// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota para listar pets de um usuário
app.get("/pets/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const pets = await prisma.pet.findMany({
      where: { usuario_id: userId },
      orderBy: { id: "desc" },
    });
    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

// Rota para listar vacinas de um usuário
app.get("/vacinas/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const pets = await prisma.pet.findMany({ where: { usuario_id: userId } });

    if (pets.length === 0) return res.json([]);

    const vacinas = await prisma.vacina.findMany({
      where: { pet_id: { in: pets.map((pet) => pet.id) } },
      orderBy: { proxima_dose: "asc" },
    });

    res.json(vacinas);
  } catch (error) {
    console.error("Erro ao buscar vacinas:", error);
    res.status(500).json({ error: "Erro ao buscar vacinas" });
  }
});

// Rota para cadastrar usuário
app.post("/usuarios", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;

  if (!nome || !cpf || !email || !telefone || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha },
    });
    res.status(201).json(novoUsuario);
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);

    if (err.code === "P2002") {
      // Chave única violada (cpf ou email)
      return res.status(400).json({ error: "CPF ou email já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
