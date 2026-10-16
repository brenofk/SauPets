import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/config";

type User = {
  id: string;
  name: string;
  email: string;
  telefone?: string;
  cpf?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();
      console.log("Resposta do backend:", data);

      if (!response.ok) {
        throw new Error(data.error || "Falha no login");
      }

      const userData: User = {
        id: String(data.id),
        name: data.nome,
        email: data.email || "",
        telefone: data.telefone || undefined,
        cpf: data.cpf || undefined,
      };

      const userToken = data.token; 

      setUser(userData);
      setToken(userToken);
      
      await AsyncStorage.setItem("@MyApp:user", JSON.stringify(userData));
      if (userToken) {
        await AsyncStorage.setItem("@MyApp:token", userToken);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("@MyApp:user");
    await AsyncStorage.removeItem("@MyApp:token");
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    await AsyncStorage.setItem("@MyApp:user", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@MyApp:user");
        const storedToken = await AsyncStorage.getItem("@MyApp:token");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do armazenamento:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};