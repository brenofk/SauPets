import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types"; // certifique-se de que o arquivo existe

// 👇 Definindo o tipo corretamente
type CadastroNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

export default function Cadastro() {
  // 👇 Usando o tipo correto no useNavigation
  const navigation = useNavigation<CadastroNavigationProp>();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [numero, setNumero] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleCadastrar = () => {
    if (
      !nome.trim() ||
      !sobrenome.trim() ||
      !numero.trim() ||
      !cpf.trim() ||
      !email.trim() ||
      !senha.trim() ||
      !confirmaSenha.trim()
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    // Aqui você pode colocar a lógica de cadastro, por exemplo, chamar API

    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    navigation.navigate("BemVindo"); // Volta para a tela de boas-vindas
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Digite o seu nome</Text>
        <TextInput
          style={styles.input}
          placeholder="seu nome..."
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Digite o seu sobrenome</Text>
        <TextInput
          style={styles.input}
          placeholder="Sobrenome..."
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Text style={styles.label}>Digite o seu numero</Text>
        <TextInput
          style={styles.input}
          placeholder="DD 00012-3345"
          value={numero}
          onChangeText={setNumero}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Digite o seu cpf</Text>
        <TextInput
          style={styles.input}
          placeholder="012.345.666-78"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Digite o seu email</Text>
        <TextInput
          style={styles.input}
          placeholder="@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Digite sua senha</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("BemVindo")}>
          <Text style={styles.link}>já possui conta? entre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dce6f0",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f4f7fa",
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 15,
    fontStyle: "italic",
    color: "#999",
  },
  button: {
    backgroundColor: "#0039d1",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#000",
  },
});
