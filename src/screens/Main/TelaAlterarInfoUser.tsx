import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function TelaAlterarInfoUser() {
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senha, setSenha] = useState("");

  async function handleSalvar() {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar usuário");

      Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar suas informações.");
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Informações</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
      />
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Nova senha"
        secureTextEntry
      />

      <Button title="Salvar alterações" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
