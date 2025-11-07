import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext"; // ajuste o caminho conforme o seu projeto

const TelaCadastroPet = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // pega o usuário logado

  // Campos do Pet
  const [nomePet, setNomePet] = useState("");
  const [tipoAnimal, setTipoAnimal] = useState("");
  const [sexo, setSexo] = useState(""); // opcional
  const [peso, setPeso] = useState(""); // opcional
  const [fotoUrl, setFotoUrl] = useState(""); // opcional

  // Estados de erro apenas para obrigatórios
  const [erroNome, setErroNome] = useState(false);
  const [erroTipo, setErroTipo] = useState(false);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const handleCadastro = async () => {
    const nomeVazio = nomePet.trim() === "";
    const tipoVazio = tipoAnimal.trim() === "";

    setErroNome(nomeVazio);
    setErroTipo(tipoVazio);

    if (nomeVazio || tipoVazio) {
      mostrarAlerta(
        "Campos obrigatórios",
        "Por favor, preencha o nome e o tipo do pet."
      );
      return;
    }

    if (!user) {
      mostrarAlerta("Erro", "Usuário não logado.");
      return;
    }

    // Monta objeto para enviar ao backend
    const novoPet = {
      nome: nomePet,
      tipo: tipoAnimal,
      sexo: sexo || null,
      peso: peso ? parseFloat(peso) : null,
      foto_url: fotoUrl || null,
      usuarioId: user.id, // associa ao usuário logado
    };

    try {
      const response = await fetch("http://192.168.1.4:3000/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPet),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar pet");

      mostrarAlerta("Sucesso", "Pet cadastrado com sucesso!");
      // Resetando campos
      setNomePet("");
      setTipoAnimal("");
      setSexo("");
      setPeso("");
      setFotoUrl("");
      setErroNome(false);
      setErroTipo(false);

      // Volta para a tela anterior (Dashboard)
      navigation.goBack();
    } catch (error) {
      console.error(error);
      mostrarAlerta("Erro", "Não foi possível cadastrar o pet.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Digite o nome do seu pet</Text>
        <TextInput
          placeholder="Ex: Hunter"
          placeholderTextColor="#777"
          style={[styles.input, erroNome && { borderColor: "#E53935", borderWidth: 2 }]}
          value={nomePet}
          onChangeText={setNomePet}
        />

        <Text style={styles.label}>Escolha o tipo de animal</Text>
        <View style={[styles.pickerContainer, erroTipo && { borderColor: "#E53935", borderWidth: 2 }]}>
          <Picker
            selectedValue={tipoAnimal}
            onValueChange={(itemValue) => setTipoAnimal(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Cachorro" value="Cachorro" />
            <Picker.Item label="Gato" value="Gato" />
          </Picker>
        </View>

        <Text style={styles.label}>Sexo (opcional)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Macho" value="M" />
            <Picker.Item label="Fêmea" value="F" />
          </Picker>
        </View>

        <Text style={styles.label}>Peso (kg) (opcional)</Text>
        <TextInput
          placeholder="Ex: 5.2"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />

        <Text style={styles.label}>URL da foto (opcional)</Text>
        <TextInput
          placeholder="Ex: http://..."
          placeholderTextColor="#777"
          style={styles.input}
          value={fotoUrl}
          onChangeText={setFotoUrl}
        />

        <TouchableOpacity
          style={[styles.botao, styles.botaoPrimario]}
          onPress={handleCadastro}
        >
          <Text style={styles.botaoTexto}>Cadastrar pet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, styles.botaoSecundario]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botaoTexto}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TelaCadastroPet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDF3E0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#C7E7D4",
    padding: 25,
    borderRadius: 16,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#1B5E20",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
  },
  botao: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  botaoPrimario: {
    backgroundColor: "#4CAF50",
  },
  botaoSecundario: {
    backgroundColor: "#A5D6A7",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
