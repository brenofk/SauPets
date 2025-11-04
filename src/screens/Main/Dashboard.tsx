import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext"; // ✅ importa o contexto

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
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
  const { user, signOut } = useContext(AuthContext); // ✅ pega usuário logado e função de logout

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
  const [profileImage, setProfileImage] = useState(require("../../assets/perfil.jpg"));

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      if (!user?.id) return;

      // Busca pets do usuário logado
      const petsResponse = await fetch(`http://192.168.1.4:3000/pets/${user.id}`);
      const petsData = await petsResponse.json();

      // Busca vacinas do usuário logado
      const vacinasResponse = await fetch(`http://192.168.1.4:3000/vacinas/${user.id}`);
      const vacinasData = await vacinasResponse.json();

      // Contagem de vacinas próximas e atrasadas
      const today = new Date();
      const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      let upcoming = 0;
      let overdue = 0;

      vacinasData.forEach((v: any) => {
        const nextDose = new Date(v.proxima_dose);
        if (nextDose < today) overdue++;
        else if (nextDose < in30Days) upcoming++;
      });

      // Atualiza estado com dados reais
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


  // 📸 Selecionar nova foto
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão necessária para acessar fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  // 🚪 Logout com confirmação
  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#DDF3E0" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.profileButton}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>

          {/* ✅ Nome real do usuário */}
          <Text style={styles.headerText}>
            Olá, {user?.name || user?.email || "Usuário"}
          </Text>

          {/* Menu lateral */}
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.petItem}
                onPress={() => console.log("Abrir detalhes do pet:", item.id)}
              >
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petInfo}>
                  {item.species} — {item.breed}
                </Text>
                <Text style={styles.petDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

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
              navigation.navigate("Configuracao");
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#1B5E20" />
            <Text style={styles.menuText}>Configuração</Text>
          </TouchableOpacity>

          {/* ✅ Botão de Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E53935" />
            <Text style={[styles.menuText, { color: "#E53935" }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DDF3E0",
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  profileButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
    maxWidth: "60%",
  },
  menuButton: {
    backgroundColor: "transparent",
    padding: 6,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#C7E7D4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1B5E20",
    textAlign: "center",
  },
  noPetsText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  petItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  petInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  petDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "60%",
    height: "100%",
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#1B5E20",
  },
});
