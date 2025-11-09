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
import { AuthContext } from "../../contexts/AuthContext";

type Pet = {
  id: string;
  nome: string;
  tipo: string;
  sexo?: string;
  peso?: number;
  created_at: string;
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
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // Modal de Pet
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal de edição
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedTipo, setEditedTipo] = useState("Cachorro");
  const [editedSexo, setEditedSexo] = useState("Macho");
  const [editedPeso, setEditedPeso] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.id) return;

        const petsResponse = await fetch(`http://192.168.1.4:3000/pets/${user.id}`);
        const petsDataRaw = await petsResponse.json();
        const petsData = Array.isArray(petsDataRaw) ? petsDataRaw : [];

        const vacinasResponse = await fetch(`http://192.168.1.4:3000/vacinas/${user.id}`);
        const vacinasDataRaw = await vacinasResponse.json();
        const vacinasData = Array.isArray(vacinasDataRaw) ? vacinasDataRaw : [];

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

        setRecentPets(petsData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoadingStats(false);
        setLoadingPets(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    setMenuVisible(false);

    if (typeof window !== "undefined") {
      const confirmLogout = window.confirm("Deseja realmente sair da sua conta?");
      if (!confirmLogout) return;
    } else {
      let confirmed = false;
      await new Promise<void>((resolve) => {
        Alert.alert(
          "Sair",
          "Deseja realmente sair da sua conta?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve() },
            { text: "Sair", style: "destructive", onPress: () => { confirmed = true; resolve(); } },
          ]
        );
      });
      if (!confirmed) return;
    }

    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  // Abrir modal de edição
  const openEditModal = () => {
    if (!selectedPet) return;
    setEditedNome(selectedPet.nome);
    setEditedTipo(selectedPet.tipo || "Cachorro");
    setEditedSexo(selectedPet.sexo || "Macho");
    setEditedPeso(selectedPet.peso?.toString() || "");
    setEditModalVisible(true);
  };

  // Salvar alterações
  const savePetChanges = async () => {
    if (!selectedPet) return;

    try {
      const response = await fetch(`http://192.168.1.4:3000/pets/${selectedPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editedNome,
          tipo: editedTipo,
          sexo: editedSexo,
          peso: editedPeso ? Number(editedPeso) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar pet");
      }

      const updatedPet = await response.json();

      // Atualiza state local
      setRecentPets((prev) =>
        prev.map((p) => (p.id === selectedPet.id ? updatedPet : p))
      );
      setSelectedPet(updatedPet);
      setEditModalVisible(false);

      // ✅ Alerta de sucesso
      if (typeof window !== "undefined") {
        window.alert("Pet atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "Pet atualizado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
  };

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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
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
      </ScrollView>

      {/* Modal de detalhes do Pet */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>{selectedPet?.nome}</Text>
            <Text>Tipo: {selectedPet?.tipo}</Text>
            <Text>Sexo: {selectedPet?.sexo || "Não informado"}</Text>
            <Text>Peso: {selectedPet?.peso ?? "Não informado"}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={openEditModal}
              >
                <Text style={styles.modalButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E53935" }]}
                onPress={async () => {
                  if (!selectedPet) return;
                  Alert.alert(
                    "Excluir Pet",
                    "Deseja realmente excluir este pet?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await fetch(`http://192.168.1.4:3000/pets/${selectedPet.id}`, {
                              method: "DELETE",
                            });
                            Alert.alert("Sucesso", "Pet excluído!");
                            setRecentPets((prev) =>
                              prev.filter((p) => p.id !== selectedPet.id)
                            );
                            setModalVisible(false);
                          } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir o pet.");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#AAA" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de edição do Pet */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.petModal}>
            <Text style={styles.modalTitle}>Editar Pet</Text>

            <Text>Nome</Text>
            <TextInput
              style={styles.input}
              value={editedNome}
              onChangeText={setEditedNome}
            />

            <Text>Peso</Text>
            <TextInput
              style={styles.input}
              value={editedPeso}
              onChangeText={setEditedPeso}
              keyboardType="numeric"
            />

            <Text>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedTipo}
                onValueChange={(itemValue) => setEditedTipo(itemValue)}
              >
                <Picker.Item label="Cachorro" value="Cachorro" />
                <Picker.Item label="Gato" value="Gato" />
              </Picker>
            </View>

            <Text>Sexo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedSexo}
                onValueChange={(itemValue) => setEditedSexo(itemValue)}
              >
                <Picker.Item label="Macho" value="Macho" />
                <Picker.Item label="Fêmea" value="Fêmea" />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={savePetChanges}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#AAA" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Menu lateral */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        />
        <View style={styles.sideMenu}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("TelaConfiguracao");
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#1B5E20" />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E53935" />
            <Text style={[styles.menuText, { color: "#E53935" }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { backgroundColor: "#DDF3E0", padding: 20, paddingBottom: 40, flexGrow: 1 },
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 25 },
  profileButton: { width: 55, height: 55, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#1B5E20", maxWidth: "60%" },
  menuButton: { backgroundColor: "transparent", padding: 6, borderRadius: 50 },
  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 30 },
  statCard: { width: "47%", backgroundColor: "#C7E7D4", padding: 16, borderRadius: 12, marginBottom: 15, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#2E7D32" },
  statLabel: { fontSize: 14, color: "#555", marginTop: 4, textAlign: "center" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, gap: 10 },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1B5E20", textAlign: "center" },
  noPetsText: { fontSize: 14, color: "#555", textAlign: "center", marginTop: 10 },
  petItem: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  petName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  petInfo: { fontSize: 14, color: "#666", marginTop: 2 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  petModal: { backgroundColor: "#fff", padding: 20, borderRadius: 15, width: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  modalButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 10 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 },
  sideMenu: { position: "absolute", top: 0, right: 0, width: "60%", height: "100%", backgroundColor: "#E8F5E9", padding: 20, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
  menuTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#1B5E20" },
  menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  menuText: { fontSize: 16, marginLeft: 10 },
});
