import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
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
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [vacina, setVacina] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dataReforco, setDataReforco] = useState("");
  const [veterinario, setVeterinario] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregandoPets, setCarregandoPets] = useState(true);
  const [erros, setErros] = useState<{ pet?: string; vacina?: string; data?: string }>({});

  // Buscar pets do usuário logado
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://192.168.1.4:3000/pets/${user.id}`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        window.alert("❌ Não foi possível carregar os pets.");
      } finally {
        setCarregandoPets(false);
      }
    };

    fetchPets();
  }, [user]);

  // Função para salvar vacina
  const handleSalvar = async () => {
    const novosErros: { pet?: string; vacina?: string; data?: string } = {};

    if (!selectedPetId) novosErros.pet = "Selecione um pet.";
    if (!vacina.trim()) novosErros.vacina = "Informe o nome da vacina.";
    if (!dataAplicacao.trim()) novosErros.data = "Informe a data de aplicação.";

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const novaVacina = {
        pet_id: Number(selectedPetId),
        nome_vacina: vacina.trim(),
        data_aplicacao: dataAplicacao || null,
        data_reforco: dataReforco || null,
        veterinario: veterinario || null,
      };

      console.log("📦 Enviando vacina:", novaVacina);

      const response = await fetch("http://192.168.1.4:3000/vacinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaVacina),
      });

      const data = await response.json();
      console.log("📥 Resposta do servidor:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar vacina");
      }

      const petNome =
        pets.find((p) => p.id === Number(selectedPetId))?.nome || "Pet";

      // ✅ Exibe mensagem de sucesso no navegador
      window.alert(`✅ Vacina cadastrada com sucesso para ${petNome}!`);

      // Resetar campos
      setSelectedPetId("");
      setVacina("");
      setDataAplicacao("");
      setDataReforco("");
      setVeterinario("");
      setErros({});
    } catch (error) {
      console.error("❌ Erro ao salvar vacina:", error);
      window.alert("⚠️ Não foi possível cadastrar a vacina. Verifique a conexão com o servidor.");
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
                <Picker.Item label="Selecione..." value="" />
                {pets.map((pet) => (
                  <Picker.Item
                    key={pet.id}
                    label={pet.nome}
                    value={pet.id.toString()}
                  />
                ))}
              </Picker>
            </View>
            {erros.pet && <Text style={styles.erroTexto}>{erros.pet}</Text>}

            <Text style={styles.label}>Nome da Vacina</Text>
            <TextInput
              placeholder="Ex: Antirrábica"
              placeholderTextColor="#777"
              style={styles.input}
              value={vacina}
              onChangeText={setVacina}
            />
            {erros.vacina && <Text style={styles.erroTexto}>{erros.vacina}</Text>}

            <Text style={styles.label}>Data de Aplicação</Text>
            <TextInput
              placeholder="Ex: 2025-11-07"
              placeholderTextColor="#777"
              style={styles.input}
              value={dataAplicacao}
              onChangeText={setDataAplicacao}
            />
            {erros.data && <Text style={styles.erroTexto}>{erros.data}</Text>}

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

// =====================
// 🎨 Estilos
// =====================
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
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
  },
  erroTexto: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
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
