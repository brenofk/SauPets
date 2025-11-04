import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.1.4:8081"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =======================================================
   🟢 ROTA DE CADASTRO DE USUÁRIO (sem criptografia)
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
   🔵 ROTA DE LOGIN (sem criptografia)
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
      },
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
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
