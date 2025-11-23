// src/screens/Main/Dashboard.tsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
  Animated,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../contexts/AuthContext";
import { API_URL } from "../../config/config";
import { useFocusEffect } from "@react-navigation/native";

type Pet = {
  id: string;
  nome: string;
  tipo: string;
  sexo?: string;
  peso?: number | null;
  created_at?: string;
};

type Vacina = {
  id: number;
  pet_id: number;
  nome_vacina: string;
  data_aplicacao?: string | null;
  data_reforco?: string | null;
  veterinario?: string | null;
  pet?: { nome: string } | null;
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
  const slideAnim = useState(new Animated.Value(-300))[0];

  // =========================
  // Modal de confirmação e sucesso
  // =========================
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<"pet" | "vacina" | null>(null);
  const [confirmItem, setConfirmItem] = useState<Pet | Vacina | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // Modais de edição
  // =========================
  const [editPetModalVisible, setEditPetModalVisible] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedTipo, setEditedTipo] = useState("Cachorro");
  const [editedSexo, setEditedSexo] = useState("Macho");
  const [editedPeso, setEditedPeso] = useState("");

  const [editVacinaModalVisible, setEditVacinaModalVisible] = useState(false);
  const [editedNomeVacina, setEditedNomeVacina] = useState("");
  const [editedDataAplicacao, setEditedDataAplicacao] = useState("");
  const [editedDataReforco, setEditedDataReforco] = useState("");
  const [editedVeterinario, setEditedVeterinario] = useState("");

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<Vacina | null>(null);

  // =========================
  // Menu lateral
  // =========================
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  // =========================
  // Fetch Dashboard
  // =========================
  const fetchDashboardData = useCallback(async () => {
    try {
      if (!user?.id) return;
      setLoadingPets(true);
      setLoadingStats(true);

      // Pets
      const petsResponse = await fetch(`${API_URL}/pets/${user.id}`);
      const petsDataRaw = await petsResponse.json();
      const petsData: Pet[] = Array.isArray(petsDataRaw) ? petsDataRaw : [];
      setRecentPets(petsData);

      // Vacinas
      const vacinasResponse = await fetch(`${API_URL}/vacinas/${user.id}`);
      const vacinasDataRaw = await vacinasResponse.json();
      const vacinasData: Vacina[] = Array.isArray(vacinasDataRaw) ? vacinasDataRaw : [];
      setVacinas(vacinasData);

      // Estatísticas
      const today = new Date();
      const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      let upcoming = 0;
      let overdue = 0;
      vacinasData.forEach((v) => {
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
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

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
  // Editar Pet
  // =========================
  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setEditedNome(pet.nome ?? "");
    setEditedTipo(pet.tipo ?? "Cachorro");
    setEditedSexo(pet.sexo ?? "Macho");
    setEditedPeso(pet.peso !== undefined && pet.peso !== null ? String(pet.peso) : "");
    setEditPetModalVisible(true);
  };

  const saveEditedPet = async () => {
    if (!selectedPet) return;
    try {
      const payload = {
        nome: editedNome,
        tipo: editedTipo,
        sexo: editedSexo,
        peso: editedPeso !== "" ? Number(editedPeso) : null,
      };
      const res = await fetch(`${API_URL}/pets/${selectedPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao atualizar pet");
      setEditPetModalVisible(false);
      setSelectedPet(null);
      await fetchDashboardData();
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
  };

  // =========================
  // Editar Vacina
  // =========================
  const handleEditVacina = (v: Vacina) => {
    setSelectedVacina(v);
    setEditedNomeVacina(v.nome_vacina ?? "");
    setEditedDataAplicacao(v.data_aplicacao ?? "");
    setEditedDataReforco(v.data_reforco ?? "");
    setEditedVeterinario(v.veterinario ?? "");
    setEditVacinaModalVisible(true);
  };

  const saveEditedVacina = async () => {
    if (!selectedVacina) return;
    try {
      const payload = {
        nome_vacina: editedNomeVacina,
        data_aplicacao: editedDataAplicacao || null,
        data_reforco: editedDataReforco || null,
        veterinario: editedVeterinario || null,
      };
      const res = await fetch(`${API_URL}/vacinas/${selectedVacina.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao atualizar vacina");
      setEditVacinaModalVisible(false);
      setSelectedVacina(null);
      await fetchDashboardData();
    } catch (error) {
      console.error("Erro ao salvar vacina:", error);
      Alert.alert("Erro", "Não foi possível atualizar a vacina.");
    }
  };

  // =========================
  // Exclusão com modal de confirmação
  // =========================
  const requestDelete = (type: "pet" | "vacina", item: Pet | Vacina) => {
    setConfirmType(type);
    setConfirmItem(item);
    setConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!confirmItem || !confirmType) return;
    try {
      const endpoint = confirmType === "pet" ? "pets" : "vacinas";
      const id = confirmItem.id;
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      setSuccessMessage(
        confirmType === "pet"
          ? `Pet "${(confirmItem as Pet).nome}" excluído com sucesso!`
          : `Vacina "${(confirmItem as Vacina).nome_vacina}" excluída com sucesso!`
      );
      setConfirmModalVisible(false);
      setConfirmItem(null);
      setConfirmType(null);
      await fetchDashboardData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  };

  const cancelDelete = () => {
    setConfirmModalVisible(false);
    setConfirmItem(null);
    setConfirmType(null);
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
          <Text style={styles.headerText}>
            Olá, {user?.name || user?.email || "Usuário"}
          </Text>
          <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
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

        {/* Mensagem de sucesso */}
        {successMessage ? (
          <View style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: "#FFF", fontWeight: "bold", textAlign: "center" }}>
              {successMessage}
            </Text>
          </View>
        ) : null}

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
              <View style={styles.petItemRow}>
                <TouchableOpacity
                  style={styles.petItemInner}
                  onPress={() => handleEditPet(item)}
                >
                  <Text style={styles.petName}>{item.nome}</Text>
                  <Text style={styles.petInfo}>{item.tipo}</Text>
                </TouchableOpacity>
                <View style={styles.itemButtons}>
                  <TouchableOpacity
                    onPress={() => handleEditPet(item)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#1B5E20" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => requestDelete("pet", item)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#B00020" />
                  </TouchableOpacity>
                </View>
              </View>
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
              <View style={styles.petItemRow}>
                <TouchableOpacity
                  style={styles.petItemInner}
                  onPress={() => handleEditVacina(item)}
                >
                  <Text style={styles.petName}>{item.nome_vacina}</Text>
                  <Text>Pet: {item.pet?.nome ?? "—"}</Text>
                  <Text>
                    Próxima dose:{" "}
                    {item.data_reforco
                      ? new Date(item.data_reforco).toLocaleDateString("pt-BR")
                      : "—"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.itemButtons}>
                  <TouchableOpacity
                    onPress={() => handleEditVacina(item)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#1B5E20" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => requestDelete("vacina", item)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#B00020" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* ============================================ */}
      {/* Modal de confirmação */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Confirmação</Text>
            <Text style={{ fontSize: 16, marginVertical: 12 }}>
              {confirmType === "pet"
                ? `Deseja excluir o pet "${(confirmItem as Pet)?.nome}"?`
                : `Deseja excluir a vacina "${(confirmItem as Vacina)?.nome_vacina}"?`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#B00020" }]}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================ */}
      {/* Menu lateral */}
      <Modal transparent visible={menuVisible} animationType="none">
        <Pressable style={styles.overlay} onPress={closeMenu} />
        <Animated.View
          style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
        >
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              navigation.navigate("TelaConfiguracao");
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#1B5E20" />
            <Text style={styles.menuItemText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              closeMenu();
              await signOut();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            }}
          >
            <Ionicons name="log-out-outline" size={22} color="#1B5E20" />
            <Text style={styles.menuItemText}>Sair</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* ============================================ */}
      {/* Modal de edição Pet */}
      <Modal visible={editPetModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Editar Pet</Text>

            <TextInput
              placeholder="Nome"
              value={editedNome}
              onChangeText={setEditedNome}
              style={styles.input}
            />

            <Picker
              selectedValue={editedTipo}
              onValueChange={(v) => setEditedTipo(v)}
              style={styles.picker}
            >
              <Picker.Item label="Cachorro" value="Cachorro" />
              <Picker.Item label="Gato" value="Gato" />
            </Picker>

            <Picker
              selectedValue={editedSexo}
              onValueChange={(v) => setEditedSexo(v)}
              style={styles.picker}
            >
              <Picker.Item label="Macho" value="Macho" />
              <Picker.Item label="Fêmea" value="Fêmea" />
            </Picker>

            <TextInput
              placeholder="Peso (kg)"
              keyboardType="numeric"
              value={editedPeso}
              onChangeText={setEditedPeso}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#B00020" }]}
                onPress={() => setEditPetModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={saveEditedPet}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================ */}
      {/* Modal de edição Vacina */}
      <Modal visible={editVacinaModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Editar Vacina</Text>

            <TextInput
              placeholder="Nome da Vacina"
              value={editedNomeVacina}
              onChangeText={setEditedNomeVacina}
              style={styles.input}
            />

            <TextInput
              placeholder="Data Aplicação"
              value={editedDataAplicacao}
              onChangeText={setEditedDataAplicacao}
              style={styles.input}
            />

            <TextInput
              placeholder="Data Reforço"
              value={editedDataReforco}
              onChangeText={setEditedDataReforco}
              style={styles.input}
            />

            <TextInput
              placeholder="Veterinário"
              value={editedVeterinario}
              onChangeText={setEditedVeterinario}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#B00020" }]}
                onPress={() => setEditVacinaModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={saveEditedVacina}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 12, flex: 1 },
  profileButton: {},
  menuButton: {},
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 14 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  actionButton: { flex: 1, padding: 10, borderRadius: 8, marginHorizontal: 4 },
  actionText: { textAlign: "center", color: "#FFF", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  petItemRow: { flexDirection: "row", backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginVertical: 4, alignItems: "center" },
  petItemInner: { flex: 1 },
  petName: { fontWeight: "bold", fontSize: 16 },
  petInfo: { color: "#555" },
  itemButtons: { flexDirection: "row" },
  iconButton: { marginLeft: 8 },
  noPetsText: { textAlign: "center", color: "#555", marginVertical: 12 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  petModal: { backgroundColor: "#FFF", padding: 16, borderRadius: 8, width: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  modalButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  modalButtonText: { color: "#FFF", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 6, padding: 8, marginBottom: 8 },
  picker: { borderWidth: 1, borderColor: "#CCC", borderRadius: 6, marginBottom: 8 },
  sideMenu: { position: "absolute", top: 0, bottom: 0, left: 0, width: 300, backgroundColor: "#E8F5E9", padding: 16 },
  menuTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  menuItemText: { fontSize: 16, marginLeft: 12 },
});
