import React, { useState } from "react";
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

const TelaCadastroPet = () => {
  const [nomePet, setNomePet] = useState("");
  const [tipoAnimal, setTipoAnimal] = useState("");
  const [erroNome, setErroNome] = useState(false);
  const [erroTipo, setErroTipo] = useState(false);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const handleCadastro = () => {
    const nomeVazio = nomePet.trim() === "";
    const tipoVazio = tipoAnimal.trim() === "";

    setErroNome(nomeVazio);
    setErroTipo(tipoVazio);

    if (nomeVazio || tipoVazio) {
      mostrarAlerta("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    // Se passou na validação
    mostrarAlerta("Sucesso", "Pet cadastrado com sucesso!");
    setNomePet("");
    setTipoAnimal("");
    setErroNome(false);
    setErroTipo(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Digite o nome do seu pet</Text>
        <TextInput
          placeholder="hunter"
          placeholderTextColor="#777"
          style={[
            styles.input,
            erroNome && { borderColor: "#E53935", borderWidth: 2 },
          ]}
          value={nomePet}
          onChangeText={setNomePet}
        />

        <Text style={styles.label}>Escolha o tipo de animal</Text>
        <View
          style={[
            styles.pickerContainer,
            erroTipo && { borderColor: "#E53935", borderWidth: 2 },
          ]}
        >
          <Picker
            selectedValue={tipoAnimal}
            onValueChange={(itemValue) => setTipoAnimal(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="clique aqui" value="" />
            <Picker.Item label="Cachorro" value="Cachorro" />
            <Picker.Item label="Gato" value="Gato" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.botao, styles.botaoPrimario]}
          onPress={handleCadastro}
        >
          <Text style={styles.botaoTexto}>Cadastrar pet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoSecundario]}>
          <Text style={styles.botaoTexto}>Início</Text>
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
