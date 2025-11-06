import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  email: string;
  foto_perfil?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        email: data.email || "", // se o backend não retornar email, evita erro
        foto_perfil: data.foto_perfil || null,
};

      const token = data.token;

      setUser(userData);
      await AsyncStorage.setItem("@MyApp:user", JSON.stringify(userData));
      await AsyncStorage.setItem("@MyApp:token", token);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(["@MyApp:user", "@MyApp:token"]);
  };

  // Carrega o usuário do AsyncStorage e valida no backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@MyApp:user");
        const token = await AsyncStorage.getItem("@MyApp:token");

        if (storedUser && token) {
          // Faz uma requisição para verificar se o usuário ainda existe
          const parsedUser: User = JSON.parse(storedUser);
          const response = await fetch(`http://192.168.1.4:3000/usuarios/${parsedUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            // Usuário não existe mais -> força logout
            await signOut();
          } else {
            setUser(parsedUser); // mantém o login
          }
        }
      } catch (error) {
        console.error("Erro ao validar usuário:", error);
        await signOut(); // se houver erro, limpa login
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
