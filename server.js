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

    // Verificando os pets para o usuário
    const pets = await prisma.pet.findMany({
      where: { usuario_id: userId }, // Relacionando pets ao usuário com o campo usuario_id
      orderBy: { id: "desc" }, // Utilizando id para ordenar os pets (já que não tem 'created_at')
    });

    // Garantindo que retorne um array, mesmo se estiver vazio
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

    // Encontrando os pets do usuário para depois pegar as vacinas
    const pets = await prisma.pet.findMany({
      where: { usuario_id: userId }, // Relacionando pets ao usuário
    });

    if (pets.length === 0) {
      return res.json([]); // Retorna um array vazio se o usuário não tiver pets
    }

    // Pega as vacinas relacionadas aos pets do usuário
    const vacinas = await prisma.vacina.findMany({
      where: {
        pet_id: { in: pets.map(pet => pet.id) }, // Relacionando vacinas aos pets
      },
      orderBy: { proxima_dose: "asc" }, // Ordenando por proxima_dose
    });

    // Garantindo que retorne um array de vacinas
    res.json(vacinas);
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
