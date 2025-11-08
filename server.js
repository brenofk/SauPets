// Para rodar no terminal: node server.js

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// =======================
// Usuários
// =======================

// ✅ Criar novo usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, cpf, email, telefone, senha } = req.body;

    console.log("📩 Dados recebidos para cadastro:", req.body);

    const usuarioExistente = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });

    if (usuarioExistente) {
      console.log("⚠️ Usuário já existe:", usuarioExistente);
      return res.status(400).json({ error: "Usuário já existe." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha },
    });

    console.log("✅ Novo usuário criado:", novoUsuario);
    res.json({ id: novoUsuario.id });
  } catch (error) {
    console.error("❌ Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log("🔑 Tentativa de login:", email);

    const usuario = await prisma.usuario.findFirst({
      where: { email, senha },
    });

    if (!usuario) {
      console.log("❌ Login falhou para:", email);
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    console.log("✅ Login bem-sucedido:", usuario.id);
    res.json({ id: usuario.id, nome: usuario.nome });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// ✅ Buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Buscando usuário ID:", id);

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) }, // Altere para "where: { id }" se o ID for String
    });

    if (!usuario) {
      console.log("⚠️ Usuário não encontrado:", id);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    console.log("✅ Usuário encontrado:", usuario);
    res.json(usuario);
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// ✅ Atualizar dados do usuário
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;

    console.log("🟡 Requisição para atualizar usuário ID:", id);
    console.log("📦 Dados recebidos:", req.body);

    // Verifica se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: Number(id) }, // Altere para "where: { id }" se o ID for String
    });

    console.log("🟢 Usuário encontrado:", usuarioExistente);

    if (!usuarioExistente) {
      console.log("❌ Usuário não encontrado no banco:", id);
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Atualiza os dados
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: nome ?? usuarioExistente.nome,
        email: email ?? usuarioExistente.email,
        telefone: telefone ?? usuarioExistente.telefone,
        senha: senha ?? usuarioExistente.senha,
      },
    });

    console.log("✅ Usuário atualizado com sucesso:", usuarioAtualizado);
    res.json(usuarioAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// =======================
// Pets
// =======================

app.post("/pets", async (req, res) => {
  try {
    const { nome, tipo, sexo, peso, foto_url, usuarioId } = req.body;
    console.log("🐶 Cadastrando pet:", req.body);

    const novoPet = await prisma.pet.create({
      data: {
        nome,
        tipo,
        sexo: sexo || null,
        peso: peso !== undefined && peso !== "" ? Number(peso) : null,
        foto_url: foto_url || null,
        usuario_id: Number(usuarioId),
      },
    });

    console.log("✅ Pet cadastrado:", novoPet);
    res.json(novoPet);
  } catch (error) {
    console.error("❌ Erro ao cadastrar pet:", error);
    res.status(500).json({ error: "Erro ao cadastrar pet" });
  }
});

app.get("/pets/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log("🔍 Buscando pets do usuário:", usuarioId);

    const pets = await prisma.pet.findMany({
      where: { usuario_id: Number(usuarioId) },
    });

    console.log("✅ Pets encontrados:", pets.length);
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
    console.log("💉 Cadastrando vacina:", req.body);

    const novaVacina = await prisma.vacina.create({
      data: {
        pet_id: Number(pet_id),
        nome_vacina,
        data_aplicacao: data_aplicacao ? new Date(data_aplicacao) : null,
        data_reforco: data_reforco ? new Date(data_reforco) : null,
        veterinario: veterinario || null,
      },
    });

    console.log("✅ Vacina cadastrada:", novaVacina);
    res.json(novaVacina);
  } catch (error) {
    console.error("❌ Erro ao cadastrar vacina:", error);
    res.status(500).json({ error: "Erro ao cadastrar vacina" });
  }
});

app.get("/vacinas/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log("🔍 Buscando vacinas do usuário:", usuarioId);

    const vacinas = await prisma.vacina.findMany({
      where: {
        pet: {
          usuario_id: Number(usuarioId),
        },
      },
      include: {
        pet: { select: { nome: true } },
      },
    });

    console.log("✅ Vacinas encontradas:", vacinas.length);
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
