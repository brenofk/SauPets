import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";

// Telas
import Login from "../screens/Auth/Login";
import Cadastro from "../screens/Auth/Cadastro";
import Dashboard from "../screens/Main/Dashboard";
import TelaConfiguracao from "../screens/Main/TelaConfiguracao";
import TelaAlterarInfoUser from "../screens/Main/TelaAlterarInfoUser";
import TelaCadastroPet from "../screens/Pets/TelaCadastroPet";
import TelaCadastroVacinas from "../screens/Pets/TelaCadastroVacinas";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
  TelaConfiguracao: undefined;
  TelaAlterarInfoUser: undefined;
  TelaCadastroPet: undefined;
  TelaCadastroVacinas: undefined;
  InfoPet: { petId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Todas as telas estão registradas */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="TelaConfiguracao" component={TelaConfiguracao} />
      <Stack.Screen name="TelaAlterarInfoUser" component={TelaAlterarInfoUser} />
      <Stack.Screen name="TelaCadastroPet" component={TelaCadastroPet} />
      <Stack.Screen name="TelaCadastroVacinas" component={TelaCadastroVacinas} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDF3E0",
  },
});
