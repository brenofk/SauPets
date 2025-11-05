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
      where: { usuario_id: userId }, // ajuste para seu campo real
      orderBy: { id: "desc" }, // não existe created_at na sua tabela, use id
    });

    // Garantir que sempre retorne um array
    res.json(Array.isArray(pets) ? pets : []);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

// Rota para listar vacinas de um usuário
app.get("/vacinas/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const vacinas = await prisma.vacina.findMany({
      where: { usuario_id: userId }, // ajuste para seu campo real
      orderBy: { proxima_dose: "asc" },
    });

    // Garantir que sempre retorne um array
    res.json(Array.isArray(vacinas) ? vacinas : []);
  } catch (error) {
    console.error("Erro ao buscar vacinas:", error);
    res.status(500).json({ error: "Erro ao buscar vacinas" });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
