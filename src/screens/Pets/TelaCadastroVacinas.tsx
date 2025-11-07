import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import { AuthContext } from "../../contexts/AuthContext";

type VacinasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TelaCadastroVacinas"
>;

type Props = {
  navigation: VacinasScreenNavigationProp;
};

export default function TelaCadastroVacinas({ navigation }: Props) {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<{ id: number; nome: string }[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>(""); // ✅ string vazia
  const [vacina, setVacina] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dataReforco, setDataReforco] = useState("");
  const [veterinario, setVeterinario] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregandoPets, setCarregandoPets] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://192.168.1.4:3000/pets/${user.id}`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        Alert.alert("Erro", "Não foi possível carregar os pets.");
      } finally {
        setCarregandoPets(false);
      }
    };

    fetchPets();
  }, [user]);

  const handleSalvar = async () => {
    if (!selectedPetId) {
      Alert.alert("Atenção", "Selecione um pet antes de salvar a vacina.");
      return;
    }

    if (!vacina.trim()) {
      Alert.alert("Atenção", "Digite o nome da vacina.");
      return;
    }

    setLoading(true);
    try {
      const novaVacina = {
        pet_id: Number(selectedPetId),
        nome_vacina: vacina,
        data_aplicacao: dataAplicacao || null,
        data_reforco: dataReforco || null,
        veterinario: veterinario || null,
      };

      const response = await fetch("http://192.168.1.4:3000/vacinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaVacina),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar vacina");

      Alert.alert("Sucesso", "Vacina cadastrada com sucesso!");
      // Resetando campos
      setSelectedPetId("");
      setVacina("");
      setDataAplicacao("");
      setDataReforco("");
      setVeterinario("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar a vacina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {carregandoPets ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <>
            <Text style={styles.label}>Selecione o Pet</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPetId}
                onValueChange={(itemValue) => setSelectedPetId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione..." value="" /> {/* ✅ string vazia */}
                {pets.map((pet) => (
                  <Picker.Item
                    key={pet.id}
                    label={pet.nome}
                    value={pet.id.toString()}
                  />
                ))}
              </Picker>
            </View>

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
          </>
        )}
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
