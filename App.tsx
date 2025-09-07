import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./Login";
import TelaPrincipal from "./TelaPrincipal";
import TelaConfiguracao from "./TelaConfiguracao";

import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaConfiguracao">
        <Stack.Screen name="BemVindo" component={BemVindo} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} /> 
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
       <Stack.Screen name="TelaConfiguracao" component={TelaConfiguracao} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
