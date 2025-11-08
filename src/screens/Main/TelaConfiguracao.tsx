import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/AppRoutes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TelaConfiguracao() {
  const navigation = useNavigation<NavigationProp>();

  const handleAlterarDados = () => {
    Alert.alert("Em breve", "A funcionalidade de alterar dados ainda será implementada.");
  };

  const handleExcluirConta = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Configurações</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            style={styles.homeButton}
          >
            <Ionicons name="home-outline" size={26} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        {/* Seções */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity style={styles.optionButton} onPress={handleAlterarDados}>
            <Ionicons name="create-outline" size={22} color="#1B5E20" />
            <Text style={styles.optionText}>Alterar dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleExcluirConta}>
            <Ionicons name="trash-outline" size={22} color="#E53935" />
            <Text style={[styles.optionText, { color: "#E53935" }]}>
              Excluir conta
            </Text>
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
  background: {
    flex: 1,
    backgroundColor: "#DDF3E0", // ✅ mesma cor do Dashboard
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20", // ✅ mesmo tom de verde
  },
  homeButton: {
    backgroundColor: "#C7E7D4",
    padding: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#C7E7D4", // ✅ mesma cor dos cards do Dashboard
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#A5D6A7",
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "500",
  },
  backButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
