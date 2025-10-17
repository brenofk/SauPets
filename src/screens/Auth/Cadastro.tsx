import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Cadastro({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/;
    return regex.test(senha);
  };

  const handleCadastro = () => {
    setErro("");

    if (!nome || !cpf || !email || !telefone || !senha || !confirmarSenha) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro("A senha deve ter ao menos 6 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // ✅ Aqui seria a linha para enviar os dados para o banco
    // Exemplo: api.post("/register", { nome, cpf, email, telefone, senha });

    alert("Cadastro realizado com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="(00) 00000-0000"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Já tem uma conta?{" "}
        <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          Entrar
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fdf9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loginText: {
    marginTop: 15,
    textAlign: "center",
    color: "#333",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
