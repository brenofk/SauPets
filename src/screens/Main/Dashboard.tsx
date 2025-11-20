// src/screens/Main/Dashboard.tsx
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
  Alert,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../contexts/AuthContext";
import { API_URL } from "../../config/config";

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

  // Tipagem adicionada para evitar `never[]`
  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false);

  // ANIMAÇÃO DO MENU LATERAL (opcional)
  const slideAnim = useState(new Animated.Value(-300))[0];

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

  // Estados de modais — tipados corretamente
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedVacina, setSelectedVacina] = useState<Vacina | null>(null);
  const [vacinaModalVisible, setVacinaModalVisible] = useState(false);

  // estados de edição (mantidos caso use depois)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedTipo, setEditedTipo] = useState("Cachorro");
  const [editedSexo, setEditedSexo] = useState("Macho");
  const [editedPeso, setEditedPeso] = useState("");

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
        const petsData: Pet[] = Array.isArray(petsDataRaw) ? petsDataRaw : [];
        setRecentPets(petsData);

        // Vacinas
        const vacinasResponse = await fetch(`${API_URL}/vacinas/${user.id}`);
        const vacinasDataRaw = await vacinasResponse.json();
        const vacinasData: Vacina[] = Array.isArray(vacinasDataRaw) ? vacinasDataRaw : [];
        setVacinas(vacinasData);

        // Estatísticas simples
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
  // Pet handlers (exibir modal, excluir, editar etc)
  // =========================
  const openPetModal = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const openVacinaModal = (v: Vacina) => {
    setSelectedVacina(v);
    setVacinaModalVisible(true);
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
                onPress={() => openPetModal(item)}
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
                <Text>Pet: {item.pet?.nome ?? "—"}</Text>
                <Text>
                  Próxima dose:{" "}
                  {item.data_reforco
                    ? new Date(item.data_reforco).toLocaleDateString("pt-BR")
                    : "—"}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      {/* ============================================ */}
      {/*      MENU LATERAL DESLIZANTE (CORRIGIDO)     */}
      {/* ============================================ */}
      <Modal transparent visible={menuVisible} animationType="none">
        <Pressable style={styles.overlay} onPress={closeMenu} />
        <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
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

      {/* =========================
          MODAL: Detalhes do PET
         ========================= */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Informações do Pet</Text>
            {selectedPet ? (
              <>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Nome: </Text>
                  {selectedPet.nome}
                </Text>

                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Tipo: </Text>
                  {selectedPet.tipo}
                </Text>

                {selectedPet.sexo && (
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Sexo: </Text>
                    {selectedPet.sexo}
                  </Text>
                )}

                {selectedPet.peso !== undefined && selectedPet.peso !== null && (
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Peso: </Text>
                    {selectedPet.peso} kg
                  </Text>
                )}
              </>
            ) : (
              <Text>—</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* =========================
          MODAL: Detalhes da VACINA
         ========================= */}
      <Modal visible={vacinaModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Informações da Vacina</Text>
            {selectedVacina ? (
              <>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Vacina: </Text>
                  {selectedVacina.nome_vacina}
                </Text>

                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Pet: </Text>
                  {selectedVacina.pet?.nome ?? "—"}
                </Text>

                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Aplicação: </Text>
                  {selectedVacina.data_aplicacao
                    ? new Date(selectedVacina.data_aplicacao).toLocaleDateString("pt-BR")
                    : "—"}
                </Text>

                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Próxima dose: </Text>
                  {selectedVacina.data_reforco
                    ? new Date(selectedVacina.data_reforco).toLocaleDateString("pt-BR")
                    : "—"}
                </Text>

                {selectedVacina.veterinario && (
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Veterinário: </Text>
                    {selectedVacina.veterinario}
                  </Text>
                )}
              </>
            ) : (
              <Text>—</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={() => setVacinaModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =========================
// Styles (mantive seu visual)
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

  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#00000088" },

  petModal: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, width: "90%", alignSelf: "center", marginTop: 100 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#1B5E20" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  modalButton: { padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 4, alignItems: "center" },
  modalButtonText: { color: "#FFF", fontWeight: "bold" },

  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 8, marginVertical: 6 },
  pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, marginVertical: 6 },

  // menu lateral
  sideMenu: { position: "absolute", top: 0, bottom: 0, width: 250, backgroundColor: "#FFF", padding: 20, paddingTop: 60, elevation: 20 },
  menuTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#1B5E20" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  menuItemText: { fontSize: 16, marginLeft: 10, color: "#1B5E20" },

  detailText: { fontSize: 16, marginBottom: 8, color: "#333" },
  bold: { fontWeight: "bold", color: "#1B5E20" },
});
