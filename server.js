// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// Usuários
// =======================

// Criar novo usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, cpf, email, telefone, senha } = req.body;

    const usuarioExistente = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha },
    });

    res.json({ id: novoUsuario.id });
  } catch (error) {
    console.error("❌ Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findFirst({ where: { email, senha } });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Atualizar dados do usuário
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });

    if (!usuarioExistente) return res.status(404).json({ error: "Usuário não encontrado." });

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: nome ?? usuarioExistente.nome,
        email: email ?? usuarioExistente.email,
        telefone: telefone ?? usuarioExistente.telefone,
        senha: senha ?? usuarioExistente.senha,
      },
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuarioExistente) return res.status(404).json({ error: "Usuário não encontrado" });

    await prisma.usuario.delete({ where: { id: Number(id) } });

    res.json({ message: "Usuário e todos os dados relacionados deletados com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// =======================
// Pets
// =======================
app.post("/pets", async (req, res) => {
  try {
    const { nome, tipo, sexo, peso, usuarioId } = req.body;

    const novoPet = await prisma.pet.create({
      data: {
        nome,
        tipo,
        sexo: sexo || null,
        peso: peso !== undefined && peso !== "" ? Number(peso) : null,
        usuario_id: Number(usuarioId),
      },
    });

    res.json(novoPet);
  } catch (error) {
    console.error("❌ Erro ao cadastrar pet:", error);
    res.status(500).json({ error: "Erro ao cadastrar pet" });
  }
});

app.get("/pets/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const pets = await prisma.pet.findMany({
      where: { usuario_id: Number(usuarioId) },
    });

    res.json(pets);
  } catch (error) {
    console.error("❌ Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

// =======================
// Vacinas
// =======================
app.post("/vacinas", async (req, res) => {
  try {
    const { pet_id, nome_vacina, data_aplicacao, data_reforco, veterinario } = req.body;

    const novaVacina = await prisma.vacina.create({
      data: {
        pet_id: Number(pet_id),
        nome_vacina,
        data_aplicacao: data_aplicacao ? new Date(data_aplicacao) : null,
        data_reforco: data_reforco ? new Date(data_reforco) : null,
        veterinario: veterinario || null,
      },
    });

    res.json(novaVacina);
  } catch (error) {
    console.error("❌ Erro ao cadastrar vacina:", error);
    res.status(500).json({ error: "Erro ao cadastrar vacina" });
  }
});

app.get("/vacinas/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const vacinas = await prisma.vacina.findMany({
      where: { pet: { usuario_id: Number(usuarioId) } },
      include: { pet: { select: { nome: true } } },
    });

    res.json(vacinas);
  } catch (error) {
    console.error("❌ Erro ao buscar vacinas:", error);
    res.status(500).json({ error: "Erro ao buscar vacinas" });
  }
});

// =======================
// Inicialização do servidor
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
