import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Cadastro({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState(false); // agora booleano para indicar erro de campos obrigatórios
  const [mensagemErro, setMensagemErro] = useState("");

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/;
    return regex.test(senha);
  };

  const handleCadastro = async () => {
  setErro(false);
  setMensagemErro("");

  if (!nome || !cpf || !email || !telefone || !senha || !confirmarSenha) {
    setErro(true);
    setMensagemErro("Todos os campos são obrigatórios.");
    return;
  }

  if (!validarSenha(senha)) {
    setErro(true);
    setMensagemErro(
      "A senha deve ter ao menos 6 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial."
    );
    return;
  }

  if (senha !== confirmarSenha) {
    setErro(true);
    setMensagemErro("As senhas não coincidem.");
    return;
  }

  try {
  // 👉 Troque o IP abaixo dependendo de como você testa:
  const response = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      cpf,
      email,
      telefone,
      senha,
    }),
  });


    if (response.ok) {
      const data = await response.json();
      alert(`🎉 Usuário cadastrado com sucesso! ID: ${data.id}`);

      // Limpa os campos e redireciona, se quiser
      setNome("");
      setCpf("");
      setEmail("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");
      navigation.navigate("Login");
    } else {
      const errorData = await response.json();
      alert(`❌ Erro: ${errorData.error || "Falha ao cadastrar usuário"}`);
    }
  } catch (error) {
    console.error(error);
    alert("⚠️ Erro de conexão com o servidor.");
  }
};


  // Função para retornar estilo de input
  const estiloInput = (campo: string) => {
    if (!erro) return styles.input;
    if (!campo) return { ...styles.input, borderColor: "red" };
    return styles.input;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

      <TextInput
        style={estiloInput(nome)}
        placeholder="Seu nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={estiloInput(cpf)}
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
        style={estiloInput(email)}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={estiloInput(telefone)}
        placeholder="(00) 00000-0000"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={estiloInput(senha)}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={estiloInput(confirmarSenha)}
        placeholder="Confirme sua senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}

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
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9fdf9" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  erro: { color: "red", marginBottom: 10, textAlign: "center" },
  loginText: { marginTop: 15, textAlign: "center", color: "#333" },
  loginLink: { color: "#4CAF50", fontWeight: "bold" },
});
