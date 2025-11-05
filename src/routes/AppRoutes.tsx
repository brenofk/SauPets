import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../contexts/AuthContext";
import Login from "../screens/Auth/Login";
import Cadastro from "../screens/Auth/Cadastro";
import Dashboard from "../screens/Main/Dashboard";

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Dashboard" component={Dashboard} />
      ) : (
        <>
           
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
  );
}
