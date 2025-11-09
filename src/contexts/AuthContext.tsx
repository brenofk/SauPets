import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Adicionando telefone e cpf
type User = {
  id: string;
  name: string;
  email: string;
  telefone?: string;
  cpf?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [loading, setLoading] = useState(true);

  // 🔹 Função de login
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("http://192.168.1.4:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();
      console.log("🔍 Resposta do backend:", data);

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

      setUser(userData);
      await AsyncStorage.setItem("@MyApp:user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // 🔹 Função de logout
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@MyApp:user");
  };

  // 🔹 Função para atualizar dados do usuário
  const updateUser = async (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    await AsyncStorage.setItem("@MyApp:user", JSON.stringify(updatedUser));
  };

  // 🔹 Carrega o usuário do AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@MyApp:user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
