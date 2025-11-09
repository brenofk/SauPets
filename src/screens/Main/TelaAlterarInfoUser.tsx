import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  // Carrega os dados do usuário
  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:3000/usuarios/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNome(data.nome || "");
        setEmail(data.email || "");
        setTelefone(data.telefone || "");
        setSenha(data.senha || "");
        setFoto(data.foto_perfil || null);
      })
      .catch(() => Alert.alert("Erro", "Não foi possível carregar seus dados."));
  }, [user]);

  // Seleciona foto do usuário
  const selecionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <- Correto, apesar do aviso de depreciação
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedUri = result.assets[0].uri;

      // Upload para o servidor
      try {
        const formData = new FormData();
        formData.append("foto", {
          uri:
            Platform.OS === "web" ? selectedUri : selectedUri,
          name: `profile_${user?.id || "unknown"}.jpg`,
          type: "image/jpeg",
        } as any);

        const resp = await fetch(
          `http://localhost:3000/usuarios/${user?.id}/upload-profile`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await resp.json();

        if (resp.ok && data.fotoUrl) {
          setFoto(data.fotoUrl);
          updateUser({ ...user, foto_perfil: data.fotoUrl });
          Alert.alert("Sucesso", "Foto de perfil atualizada!");
        } else {
          Alert.alert("Erro", data.error || "Falha ao enviar a foto.");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível enviar a foto ao servidor.");
      }
    }
  };

  // Atualiza as informações do usuário
  const handleSalvar = async () => {
    if (!nome || !email || !telefone || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
          foto_perfil: foto,
        }),
      });

      if (response.ok) {
        await updateUser({
          name: nome,
          email,
          foto_perfil: foto || undefined,
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

      {foto && <Image source={{ uri: foto }} style={styles.fotoPerfil} />}

      <TouchableOpacity style={styles.botaoFoto} onPress={selecionarFoto}>
        <Text style={styles.textoBotaoFoto}>Carregar Foto</Text>
      </TouchableOpacity>

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
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#aaa"
        secureTextEntry
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
  fotoPerfil: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  botaoFoto: {
    width: "90%",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  textoBotaoFoto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
