import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import { API_URL } from '../../config/config';

export default function Cadastro({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [loading, setLoading] = useState(false);

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$\%^&+=!]).{6,}$/;
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
        "A palavra-passe deve ter ao menos 6 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro(true);
      setMensagemErro("As palavras-passe não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cpf, email, telefone, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`🎉 Utilizador registado com sucesso! ID: ${data.id}`);
        setNome("");
        setCpf("");
        setEmail("");
        setTelefone("");
        setSenha("");
        setConfirmarSenha("");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        alert(`❌ Erro: ${errorData.error || "Falha ao registar utilizador"}`);
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Erro de ligação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const estiloInput = (campo: string) => {
    if (!erro) return styles.input;
    if (!campo) return { ...styles.input, borderColor: "red" };
    return styles.input;
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#f9fdf9" }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os seus dados para começar</Text>

          <TextInput
            style={estiloInput(nome)}
            placeholder="O seu nome completo"
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
            autoCapitalize="none"
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
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TextInput
            style={estiloInput(confirmarSenha)}
            placeholder="Confirme a sua palavra-passe"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Já tem uma conta?{" "}
            <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
              Entrar
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: { padding: 20 },
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