import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./Login";
import TelaPrincipal from "./TelaPrincipal";
import TelaConfiguracao from "./TelaConfiguracao";
import TelaCadastroPet from "./TelaCadastroPet";
import TelaCadastroVacinas from "./TelaCadastroVacinas";
import Dashboard from "./Dashboard";

import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
<<<<<<< HEAD
        <Stack.Screen name="BemVindo" component={BemVindo} options={{ headerShown: false }} />
=======
        <Stack.Screen
          name="BemVindo"
          component={BemVindo}
          options={{ headerShown: false }}
        />
>>>>>>> a24cf1df1d6f03a4862a01d56b7f79be30d5d612
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
        <Stack.Screen name="TelaConfiguracao" component={TelaConfiguracao} />
        <Stack.Screen name="TelaCadastroPet" component={TelaCadastroPet} />
        <Stack.Screen name="TelaCadastroVacinas" component={TelaCadastroVacinas} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
