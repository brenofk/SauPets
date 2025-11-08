import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext"; // Ajuste o caminho conforme necessário
import Login from "../screens/Auth/Login";
import Cadastro from "../screens/Auth/Cadastro";
import Dashboard from "../screens/Main/Dashboard";
import TelaCadastroPet from "../screens/Pets/TelaCadastroPet";
import TelaCadastroVacinas from "../screens/Pets/TelaCadastroVacinas";

// Tipos de rotas
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
  TelaCadastroPet: undefined;
  TelaCadastroVacinas: undefined;
  InfoPet: { petId: string }; // Parametro necessário para abrir a tela de detalhes
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? "Dashboard" : "Login"}
    >
      {user ? (
        // Usuário logado
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="TelaCadastroPet" component={TelaCadastroPet} />
          <Stack.Screen name="TelaCadastroVacinas" component={TelaCadastroVacinas} />
         
        </>
      ) : (
        // Usuário deslogado
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
