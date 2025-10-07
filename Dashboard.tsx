import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
<<<<<<< HEAD
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
=======
} from "react-native";
>>>>>>> a24cf1df1d6f03a4862a01d56b7f79be30d5d612

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
  const [stats, setStats] = useState<Stats>({
    totalPets: 0,
    totalVaccines: 0,
    upcomingVaccines: 0,
    overdueVaccines: 0,
  });

  const [recentPets, setRecentPets] = useState<Pet[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);

  // Estado para a foto do perfil
  const [profileImage, setProfileImage] = useState(require("./assets/perfil.png"));

  useEffect(() => {
    const mockVaccines = [
      { next_dose_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { next_dose_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
      { next_dose_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    const mockPets = [
      { id: "1", name: "Rex", species: "Cachorro", breed: "Labrador", created_at: new Date().toISOString() },
      { id: "2", name: "Mimi", species: "Gato", breed: "Persa", created_at: new Date().toISOString() },
      { id: "3", name: "Lulu", species: "Coelho", breed: "Anão", created_at: new Date().toISOString() },
    ];

    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    let upcoming = 0;
    let overdue = 0;
    mockVaccines.forEach((vaccine) => {
      const nextDose = new Date(vaccine.next_dose_date);
      if (nextDose < today) overdue++;
      else if (nextDose < in30Days) upcoming++;
    });

    setStats({
      totalPets: mockPets.length,
      totalVaccines: mockVaccines.length,
      upcomingVaccines: upcoming,
      overdueVaccines: overdue,
    });

    setTimeout(() => {
      setRecentPets(mockPets);
      setLoadingStats(false);
      setLoadingPets(false);
    }, 1000);
  }, []);

<<<<<<< HEAD
  // Função para selecionar nova foto
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

    // ✅ Correção TypeScript: checa se o usuário não cancelou
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho com imagem de perfil */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileButton}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Olá, João Silva! 👋</Text>
      </View>
=======
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Olá, João Silva! 👋</Text>
>>>>>>> a24cf1df1d6f03a4862a01d56b7f79be30d5d612

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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DDF3E0",
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
<<<<<<< HEAD
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    gap: 10,
  },
  profileButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginRight: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
=======
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
>>>>>>> a24cf1df1d6f03a4862a01d56b7f79be30d5d612
    color: "#1B5E20",
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
});
