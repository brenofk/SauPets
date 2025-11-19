import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/AppRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import { API_URL } from '../../config/config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TelaConfiguracao() {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useContext(AuthContext);

  const handleAlterarDados = () => {
    navigation.navigate("TelaAlterarInfoUser");
  };

  const handleExcluirConta = async () => {
    const confirmed =
      Platform.OS === "web"
        ? window.confirm("Tem certeza que deseja excluir sua conta?")
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              "Excluir conta",
              "Tem certeza que deseja excluir sua conta?",
              [
                { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
                { text: "Excluir", style: "destructive", onPress: () => resolve(true) },
              ]
            );
          });

    if (!confirmed) return;

    try {
      if (!user?.id) return;

      // Aqui usamos a URL do config para web e mobile
      const response = await fetch(`${API_URL}/usuarios/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await signOut();
        if (Platform.OS === "web") {
          alert("Conta excluída com sucesso!");
        }
        return;
      } else {
        const data = await response.json();
        const msg = data.error || "Não foi possível excluir a conta.";
        Platform.OS === "web" ? alert(msg) : console.log(msg);
      }
    } catch (error) {
      console.error(error);
      Platform.OS === "web" ? alert("Erro ao excluir a conta.") : console.log("Erro ao excluir a conta.");
    }
  };

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Configurações</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            style={styles.homeButton}
          >
            <Ionicons name="home-outline" size={26} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity style={styles.optionButton} onPress={handleAlterarDados}>
            <Ionicons name="create-outline" size={22} color="#1B5E20" />
            <Text style={styles.optionText}>Alterar dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleExcluirConta}>
            <Ionicons name="trash-outline" size={22} color="#E53935" />
            <Text style={[styles.optionText, { color: "#E53935" }]}>Excluir conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="arrow-back-outline" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#DDF3E0" },
  container: { flexGrow: 1, padding: 20 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#1B5E20" },
  homeButton: { backgroundColor: "#C7E7D4", padding: 10, borderRadius: 10 },
  card: { backgroundColor: "#C7E7D4", borderRadius: 12, padding: 20, marginBottom: 25, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1B5E20", marginBottom: 10 },
  optionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#A5D6A7", gap: 10 },
  optionText: { fontSize: 16, color: "#1B5E20", fontWeight: "500" },
  backButton: { backgroundColor: "#4CAF50", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 10, marginTop: 10 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});
