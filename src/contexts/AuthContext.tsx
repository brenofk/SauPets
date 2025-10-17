import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1️⃣ Definição do tipo do usuário
type User = {
  id: string;
  name: string;
  email: string;
};

// 2️⃣ Definição do tipo do contexto
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

// 3️⃣ Criação do contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
});

// 4️⃣ Provider
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    // Simulação de login
    const fakeUser: User = { id: "1", name: "Breno", email };
    setUser(fakeUser);
    await AsyncStorage.setItem("@MyApp:user", JSON.stringify(fakeUser));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@MyApp:user");
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("@MyApp:user");
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
