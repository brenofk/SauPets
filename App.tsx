import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./src/contexts/AuthContext"; // ajuste o caminho se necessário
import AppRoutes from "./src/routes/AppRoutes"; // crie este arquivo para controlar rotas

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
