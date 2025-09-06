import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types"; // Ajuste o caminho se necessário

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha email e senha.");
      return;
    }

    // Simula login bem-sucedido com alerta e navegação
    Alert.alert("Sucesso", "Login realizado!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("TelaPrincipal"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Digite o seu email</Text>
        <TextInput
          style={styles.input}
          placeholder="@gmail.com"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Digite sua senha</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.link}>Não possui conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7e1f2",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f4f7fa",
    width: 300,
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    color: "#000",
    marginBottom: 6,
    fontWeight: "normal",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    fontStyle: "italic",
    color: "#333",
    fontSize: 16,
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
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#000",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
