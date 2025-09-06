import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";  // Ajuste o caminho caso necessário

type BemVindoNavigationProp = NativeStackNavigationProp<RootStackParamList, "BemVindo">;

export default function BemVindo() {
  const navigation = useNavigation<BemVindoNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Ícones e título */}
        <Text style={styles.title}>🐶 Seja bem vindo 🐱</Text>

        {/* Texto e botões */}
        <Text style={styles.text}>
          Ainda não possui cadastro?{"\n"}
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.link}><Text style={{fontWeight: "bold", fontStyle: "italic"}}>Clique aqui</Text></Text>
          </TouchableOpacity>
        </Text>

        <Text style={styles.text}>
          Já possui conta?{"\n"}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}><Text style={{fontWeight: "bold", fontStyle: "italic"}}>Faça login</Text></Text>
          </TouchableOpacity>
        </Text>

        {/* Ícones inferiores */}
        <View style={styles.footerIcons}>
          <Text style={styles.icon}>🐱</Text>
          <Text style={styles.icon}>🐶</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7e1f2",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f4f7fa",
    width: 300,
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#000",
    textDecorationLine: "underline",
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 24,
  },
});
