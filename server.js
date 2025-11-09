// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url"; // <-- necessário para __dirname

// 🔹 Definir __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Cria a pasta uploads caso não exista
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.params.id}${ext}`);
  },
});
const upload = multer({ storage });

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

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, foto_perfil: usuario.foto_perfil });
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

// Atualizar dados do usuário (incluindo foto_perfil)
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, senha, foto_perfil } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });

    if (!usuarioExistente) return res.status(404).json({ error: "Usuário não encontrado." });

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: nome ?? usuarioExistente.nome,
        email: email ?? usuarioExistente.email,
        telefone: telefone ?? usuarioExistente.telefone,
        senha: senha ?? usuarioExistente.senha,
        foto_perfil: foto_perfil ?? usuarioExistente.foto_perfil,
      },
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Upload de foto de perfil
app.post("/usuarios/:id/upload-profile", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) return res.status(400).json({ error: "Nenhuma foto enviada." });

    const fotoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { foto_perfil: fotoUrl },
    });

    res.json({ fotoUrl });
  } catch (error) {
    console.error("❌ Erro ao enviar foto de perfil:", error);
    res.status(500).json({ error: "Erro ao enviar foto de perfil" });
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
    const { nome, tipo, sexo, peso, foto_url, usuarioId } = req.body;

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
