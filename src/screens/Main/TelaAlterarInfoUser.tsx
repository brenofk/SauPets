import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes/AppRoutes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function TelaAlterarInfoUser() {
  const navigation = useNavigation<NavigationProps>();
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  // Carrega os dados do usuário
  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://192.168.1.4:3000/usuarios/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNome(data.nome || "");
        setEmail(data.email || "");
        setSenha(data.senha || "");
        setTelefone(data.telefone || "");
        setCpf(data.cpf || "");
      })
      .catch(() => Alert.alert("Erro", "Não foi possível carregar seus dados."));
  }, [user]);

  // Atualiza as informações do usuário
  const handleSalvar = async () => {
    if (!nome || !email || !senha || !telefone || !cpf) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.4:3000/usuarios/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          telefone,
          cpf,
        }),
      });

      if (response.ok) {
        await updateUser({
          name: nome,
          email,
          telefone,
          cpf,
        });
        Alert.alert("Sucesso", "Informações atualizadas!");
        navigation.navigate("TelaConfiguracao");
      } else {
        Alert.alert("Erro", "Não foi possível atualizar as informações.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Alterar Informações</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.navigate("TelaConfiguracao")}
      >
        <Text style={styles.textoVoltar}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  botaoSalvar: {
    width: "90%",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  botaoVoltar: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  textoVoltar: { color: "#4CAF50", fontSize: 16, fontWeight: "bold" },
});
