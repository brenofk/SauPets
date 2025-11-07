import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";

type VacinasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TelaCadastroVacinas"
>;

type Props = {
  navigation: VacinasScreenNavigationProp;
};

export default function TelaCadastroVacinas({ navigation }: Props) {
  const [nomePet, setNomePet] = useState("");
  const [vacina, setVacina] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dataReforco, setDataReforco] = useState("");
  const [veterinario, setVeterinario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      // Simula envio
      await new Promise((res) => setTimeout(res, 1000));
      console.log("Vacina salva", {
        nomePet,
        vacina,
        dataAplicacao,
        dataReforco,
        veterinario,
      });

      // Resetando campos
      setNomePet("");
      setVacina("");
      setDataAplicacao("");
      setDataReforco("");
      setVeterinario("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput
          placeholder="Ex: Hunter"
          placeholderTextColor="#777"
          style={styles.input}
          value={nomePet}
          onChangeText={setNomePet}
        />

        <Text style={styles.label}>Nome da Vacina</Text>
        <TextInput
          placeholder="Ex: Antirrábica"
          placeholderTextColor="#777"
          style={styles.input}
          value={vacina}
          onChangeText={setVacina}
        />

        <Text style={styles.label}>Data de Aplicação</Text>
        <TextInput
          placeholder="Ex: 2025-11-07"
          placeholderTextColor="#777"
          style={styles.input}
          value={dataAplicacao}
          onChangeText={setDataAplicacao}
        />

        <Text style={styles.label}>Data de Reforço (opcional)</Text>
        <TextInput
          placeholder="Ex: 2026-11-07"
          placeholderTextColor="#777"
          style={styles.input}
          value={dataReforco}
          onChangeText={setDataReforco}
        />

        <Text style={styles.label}>Veterinário (opcional)</Text>
        <TextInput
          placeholder="Ex: Dr. Carlos"
          placeholderTextColor="#777"
          style={styles.input}
          value={veterinario}
          onChangeText={setVeterinario}
        />

        <TouchableOpacity
          style={[styles.botao, styles.botaoPrimario]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar Vacina</Text>
          )}
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
}

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
