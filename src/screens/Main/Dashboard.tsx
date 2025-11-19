import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from '../../config/config';

type Pet = {
  id: string;
  nome: string;
  tipo: string;
  sexo?: string;
  peso?: number;
  created_at: string;
};

type Vacina = {
  id: number;
  pet_id: number;
  nome_vacina: string;
  data_aplicacao: string | null;
  data_reforco: string | null;
  veterinario?: string | null;
  pet?: { nome: string };
};

type Stats = {
  totalPets: number;
  totalVaccines: number;
  upcomingVaccines: number;
  overdueVaccines: number;
};

type Props = {
  navigation: any;
};

export default function Dashboard({ navigation }: Props) {
  const { user, signOut } = useContext(AuthContext);

  const [stats, setStats] = useState<Stats>({
    totalPets: 0,
    totalVaccines: 0,
    upcomingVaccines: 0,
    overdueVaccines: 0,
  });
  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedTipo, setEditedTipo] = useState("Cachorro");
  const [editedSexo, setEditedSexo] = useState("Macho");
  const [editedPeso, setEditedPeso] = useState("");

  const [selectedVacina, setSelectedVacina] = useState<Vacina | null>(null);
  const [vacinaModalVisible, setVacinaModalVisible] = useState(false);

  const [editedNomeVacina, setEditedNomeVacina] = useState("");
  const [editedDataAplicacao, setEditedDataAplicacao] = useState("");
  const [editedDataReforco, setEditedDataReforco] = useState("");
  const [editedVeterinario, setEditedVeterinario] = useState("");

  // =========================
  // Fetch Dashboard Data
  // =========================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.id) return;

        // Pets
        const petsResponse = await fetch(`${API_URL}/pets/${user.id}`);
        const petsDataRaw = await petsResponse.json();
        const petsData = Array.isArray(petsDataRaw) ? petsDataRaw : [];
        setRecentPets(petsData);

        // Vacinas
        const vacinasResponse = await fetch(`${API_URL}/vacinas/${user.id}`);
        const vacinasDataRaw = await vacinasResponse.json();
        const vacinasData = Array.isArray(vacinasDataRaw) ? vacinasDataRaw : [];
        setVacinas(vacinasData);

        // Estatísticas
        const today = new Date();
        const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        let upcoming = 0;
        let overdue = 0;

        vacinasData.forEach((v: any) => {
          if (v.data_reforco) {
            const nextDose = new Date(v.data_reforco);
            if (nextDose < today) overdue++;
            else if (nextDose < in30Days) upcoming++;
          }
        });

        setStats({
          totalPets: petsData.length,
          totalVaccines: vacinasData.length,
          upcomingVaccines: upcoming,
          overdueVaccines: overdue,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoadingStats(false);
        setLoadingPets(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  // =========================
  // Pet - Edição
  // =========================
  const openEditPetModal = () => {
    if (!selectedPet) return;
    setEditedNome(selectedPet.nome);
    setEditedTipo(selectedPet.tipo || "Cachorro");
    setEditedSexo(selectedPet.sexo || "Macho");
    setEditedPeso(selectedPet.peso?.toString() || "");
    setEditModalVisible(true);
  };

  const savePetChanges = async () => {
    if (!selectedPet) return;

    try {
      const res = await fetch(`${API_URL}/pets/${selectedPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editedNome,
          tipo: editedTipo,
          sexo: editedSexo,
          peso: editedPeso ? Number(editedPeso) : null,
        }),
      });
      const updatedPet = await res.json();
      setRecentPets(prev => prev.map(p => p.id === selectedPet.id ? updatedPet : p));
      setSelectedPet(updatedPet);
      setEditModalVisible(false);
      Alert.alert("Sucesso", "Pet atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
  };

  const deletePet = async () => {
    if (!selectedPet) return;
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert("Excluir Pet", "Deseja realmente excluir este pet?", [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Excluir", style: "destructive", onPress: () => resolve(true) },
      ]);
    });
    if (!confirm) return;

    try {
      await fetch(`${API_URL}/pets/${selectedPet.id}`, { method: "DELETE" });
      setRecentPets(prev => prev.filter(p => p.id !== selectedPet.id));
      setModalVisible(false);
      Alert.alert("Sucesso", "Pet excluído com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível excluir o pet.");
    }
  };

  // =========================
  // Vacina - Edição
  // =========================
  const openVacinaModal = (v: Vacina) => {
    setSelectedVacina(v);
    setEditedNomeVacina(v.nome_vacina);
    setEditedDataAplicacao(v.data_aplicacao?.split("T")[0] || "");
    setEditedDataReforco(v.data_reforco?.split("T")[0] || "");
    setEditedVeterinario(v.veterinario || "");
    setVacinaModalVisible(true);
  };

  const saveVacinaChanges = async () => {
    if (!selectedVacina) return;

    try {
      const res = await fetch(`${API_URL}/vacinas/${selectedVacina.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_vacina: editedNomeVacina,
          data_aplicacao: editedDataAplicacao,
          data_reforco: editedDataReforco,
          veterinario: editedVeterinario,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar vacina");

      const updated = await res.json();

      setVacinas((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );
      setVacinaModalVisible(false);

      Alert.alert("Sucesso", "Vacina atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível atualizar a vacina.");
    }
  };

  const deleteVacina = async () => {
    if (!selectedVacina) return;

    try {
      const response = await fetch(`${API_URL}/vacinas/${selectedVacina.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Vacina excluída com sucesso!");
        setVacinas((prevVacinas) => prevVacinas.filter((v) => v.id !== selectedVacina.id));
        setSelectedVacina(null);
        setModalVisible(false);
      } else {
        Alert.alert("Erro", "Falha ao excluir a vacina. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao excluir vacina:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar excluir a vacina.");
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <View style={{ flex: 1, backgroundColor: "#DDF3E0" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <View style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={50} color="#4CAF50" />
          </View>
          <Text style={styles.headerText}>Olá, {user?.name || user?.email || "Usuário"}</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu-outline" size={30} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          {loadingStats ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalPets}</Text>
                <Text style={styles.statLabel}>Meus Pets</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalVaccines}</Text>
                <Text style={styles.statLabel}>Vacinas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.upcomingVaccines}</Text>
                <Text style={styles.statLabel}>Próximas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.overdueVaccines}</Text>
                <Text style={styles.statLabel}>Atrasadas</Text>
              </View>
            </>
          )}
        </View>

        {/* Ações rápidas */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => navigation.navigate("TelaCadastroPet")}
          >
            <Text style={styles.actionText}>+ Adicionar Pet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#A5D6A7" }]}
            onPress={() => navigation.navigate("TelaCadastroVacinas")}
          >
            <Text style={styles.actionText}>+ Adicionar Vacina</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Pets */}
        <Text style={styles.sectionTitle}>Pets Recentes</Text>
        {loadingPets ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : recentPets.length === 0 ? (
          <Text style={styles.noPetsText}>Nenhum pet encontrado.</Text>
        ) : (
          <FlatList
            data={recentPets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.petItem}
                onPress={() => {
                  setSelectedPet(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.petName}>{item.nome}</Text>
                <Text style={styles.petInfo}>{item.tipo}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Lista de Vacinas */}
        <Text style={styles.sectionTitle}>Vacinas Recentes</Text>
        {vacinas.length === 0 ? (
          <Text style={styles.noPetsText}>Nenhuma vacina encontrada.</Text>
        ) : (
          <FlatList
            data={vacinas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.petItem}
                onPress={() => openVacinaModal(item)}
              >
                <Text style={styles.petName}>{item.nome_vacina}</Text>
                <Text>Pet: {item.pet?.nome}</Text>
                <Text>
                  Próxima dose:{" "}
                  {item.data_reforco ? new Date(item.data_reforco).toLocaleDateString("pt-BR") : "—"}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      {/* Modais e menu permanecem iguais */}
      {/* ... seu código de modais não precisa mudar, pois as funções já usam API_URL */}
    </View>
  );
}

// =========================
// Styles
// =========================
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 80 },
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  profileButton: {},
  headerText: { fontSize: 22, fontWeight: "bold", color: "#1B5E20" },
  menuButton: {},
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap" },
  statCard: { backgroundColor: "#FFF", borderRadius: 8, padding: 16, width: "48%", marginBottom: 8, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1B5E20" },
  statLabel: { fontSize: 14, color: "#4CAF50" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  actionButton: { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  actionText: { color: "#FFF", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8, color: "#1B5E20" },
  petItem: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 8 },
  petName: { fontSize: 16, fontWeight: "bold", color: "#1B5E20" },
  petInfo: { fontSize: 14, color: "#555" },
  noPetsText: { color: "#555", fontStyle: "italic", marginBottom: 8 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000099" },
  petModal: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, width: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#1B5E20" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  modalButton: { padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 4, alignItems: "center" },
  modalButtonText: { color: "#FFF", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 8, marginVertical: 6 },
  pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, marginVertical: 6 },
  menuModal: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, width: "80%" },
  menuTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#1B5E20" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  menuItemText: { fontSize: 16, marginLeft: 10, color: "#1B5E20" },
});
