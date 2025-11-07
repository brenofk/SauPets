import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext"; // Ajuste o caminho conforme necessário
import Login from "../screens/Auth/Login";
import Cadastro from "../screens/Auth/Cadastro";
import Dashboard from "../screens/Main/Dashboard";
import TelaCadastroPet from "../screens/Pets/TelaCadastroPet"; // Importe sua tela de cadastro de pet
import TelaCadastroVacinas from "../screens/Pets/TelaCadastroVacinas"; // Importe sua tela de cadastro de vacinas

// Tipos de rotas
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
  TelaCadastroPet: undefined;
  TelaCadastroVacinas: undefined;
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
