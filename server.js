import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

/* =======================================================
   ⚙️ CONFIGURAÇÕES BÁSICAS
   ======================================================= */
app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.1.4:8081"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// 📂 Servir arquivos de imagem de forma pública
app.use("/uploads", express.static("uploads"));

/* =======================================================
   💾 CONFIGURAÇÃO DO MULTER (upload de fotos)
   ======================================================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/perfis";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =======================================================
   🟢 ROTA DE CADASTRO DE USUÁRIO
   ======================================================= */
app.post("/usuarios", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;

  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha },
    });

    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    });
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

/* =======================================================
   🔵 ROTA DE LOGIN (agora inclui foto_perfil)
   ======================================================= */
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil || null, // agora envia a imagem também
      },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/* =======================================================
   🖼️ ROTA DE UPLOAD DE FOTO DE PERFIL
   ======================================================= */
app.post("/upload-profile/:userId", upload.single("foto"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const fotoUrl = `http://192.168.1.4:3000/uploads/perfis/${req.file.filename}`;

    await prisma.usuario.update({
      where: { id: Number(userId) },
      data: { foto_perfil: fotoUrl },
    });

    return res.json({ success: true, fotoUrl });
  } catch (error) {
    console.error("❌ Erro ao atualizar foto:", error);
    res.status(500).json({ error: "Erro ao atualizar foto." });
  }
});

/* =======================================================
   🧩 ROTA DE TESTE
   ======================================================= */
app.get("/", (req, res) => {
  res.send("API do SauPets funcionando 🐾");
});

/* =======================================================
   🚀 INICIA O SERVIDOR
   ======================================================= */
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
