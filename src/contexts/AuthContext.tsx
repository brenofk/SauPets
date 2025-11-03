import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1️⃣ Tipo do usuário (de acordo com o backend)
type User = {
  id: string;
  name: string;
  email: string;
};

// 2️⃣ Tipo do contexto
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// 3️⃣ Criação do contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// 4️⃣ Provider (gerencia o estado global de autenticação)
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Função de login (chama o backend)
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no login");
      }

      // ✅ Cria o objeto do usuário com base na resposta da API
      const userData: User = {
        id: String(data.usuario.id),
        name: data.usuario.nome,
        email: data.usuario.email,
      };

      // Salva no estado global e no AsyncStorage
      setUser(userData);
      await AsyncStorage.setItem("@MyApp:user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // 🚪 Função de logout
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@MyApp:user");
  };

  // 🔄 Carrega o usuário salvo no AsyncStorage ao iniciar o app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@MyApp:user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
