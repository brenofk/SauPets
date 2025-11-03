import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config(); // ✅ Carrega variáveis do .env

const app = express();
const prisma = new PrismaClient();

/* =======================================================
   ⚙️ MIDDLEWARES
   ======================================================= */
app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.1.4:8081"], // web e rede local
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =======================================================
   🟢 ROTA DE CADASTRO DE USUÁRIO
   ======================================================= */
app.post("/usuarios", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;

  try {
    const pepper = process.env.PASSWORD_PEPPER || "";
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const senhaComPepper = senha + pepper;
    const senhaHash = await bcrypt.hash(senhaComPepper, saltRounds);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, cpf, email, telefone, senha: senhaHash },
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
   🔵 ROTA DE LOGIN DE USUÁRIO
   ======================================================= */
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const pepper = process.env.PASSWORD_PEPPER || "";
    const senhaComPepper = senha + pepper;
    const senhaCorreta = await bcrypt.compare(senhaComPepper, usuario.senha);

    if (!senhaCorreta) {
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
