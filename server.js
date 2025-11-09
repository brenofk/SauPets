// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// =======================
// Função auxiliar para datas
// =======================
function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

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

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
    });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
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
    const { nome, email, telefone, senha, cpf } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuarioExistente) return res.status(404).json({ error: "Usuário não encontrado." });

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: nome ?? usuarioExistente.nome,
        email: email ?? usuarioExistente.email,
        telefone: telefone ?? usuarioExistente.telefone,
        senha: senha ?? usuarioExistente.senha,
        cpf: cpf ?? usuarioExistente.cpf,
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
    res.json({ message: "Usuário deletado com sucesso" });
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
    const pets = await prisma.pet.findMany({
      where: { usuario_id: Number(req.params.usuarioId) },
    });
    res.json(pets);
  } catch (error) {
    console.error("❌ Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

// Atualizar pet
app.put("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo, sexo, peso } = req.body;

    const petAtualizado = await prisma.pet.update({
      where: { id: Number(id) },
      data: {
        nome,
        tipo,
        sexo,
        peso: peso !== undefined ? Number(peso) : null,
      },
    });

    res.json(petAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar pet:", error);
    res.status(500).json({ error: "Erro ao atualizar pet" });
  }
});

// Deletar pet
app.delete("/pets/:id", async (req, res) => {
  try {
    await prisma.pet.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Pet excluído com sucesso." });
  } catch (error) {
    console.error("❌ Erro ao deletar pet:", error);
    res.status(500).json({ error: "Erro ao deletar pet." });
  }
});

// =======================
// Vacinas (CRUD completo)
// =======================

// Criar vacina
app.post("/vacinas", async (req, res) => {
  try {
    const { pet_id, nome_vacina, data_aplicacao, data_reforco, veterinario } = req.body;

    const novaVacina = await prisma.vacina.create({
      data: {
        pet_id: Number(pet_id),
        nome_vacina,
        data_aplicacao: parseDate(data_aplicacao),
        data_reforco: parseDate(data_reforco),
        veterinario: veterinario || null,
      },
    });

    res.json(novaVacina);
  } catch (error) {
    console.error("❌ Erro ao cadastrar vacina:", error);
    res.status(500).json({ error: "Erro ao cadastrar vacina" });
  }
});

// Listar vacinas de um usuário
app.get("/vacinas/:usuarioId", async (req, res) => {
  try {
    const vacinas = await prisma.vacina.findMany({
      where: { pet: { usuario_id: Number(req.params.usuarioId) } },
      include: { pet: { select: { nome: true } } },
    });
    res.json(vacinas);
  } catch (error) {
    console.error("❌ Erro ao buscar vacinas:", error);
    res.status(500).json({ error: "Erro ao buscar vacinas" });
  }
});

// Atualizar vacina
app.put("/vacinas/:id", async (req, res) => {
  try {
    const { nome_vacina, data_aplicacao, data_reforco, veterinario } = req.body;

    const vacinaAtualizada = await prisma.vacina.update({
      where: { id: Number(req.params.id) },
      data: {
        nome_vacina,
        data_aplicacao: parseDate(data_aplicacao),
        data_reforco: parseDate(data_reforco),
        veterinario: veterinario || null,
      },
    });

    res.json(vacinaAtualizada);
  } catch (error) {
    console.error("❌ Erro ao atualizar vacina:", error);
    res.status(500).json({ error: "Erro ao atualizar vacina" });
  }
});

// Deletar vacina
app.delete("/vacinas/:id", async (req, res) => {
  try {
    await prisma.vacina.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Vacina excluída com sucesso." });
  } catch (error) {
    console.error("❌ Erro ao deletar vacina:", error);
    res.status(500).json({ error: "Erro ao deletar vacina." });
  }
});

// =======================
// Inicialização do servidor
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
