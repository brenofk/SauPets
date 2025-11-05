import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos de dados do usuário
type User = {
  id: string;
  name: string;
  email: string;
  foto_perfil?: string | null;
};

// Tipagem do contexto de autenticação
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Criação do contexto de autenticação
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Tipo para as propriedades do AuthProvider
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("http://192.168.1.4:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no login");
      }

      // Cria o objeto do usuário
      const userData: User = {
        id: String(data.usuario.id),
        name: data.usuario.nome,
        email: data.usuario.email,
        foto_perfil: data.usuario.foto_perfil || null,
      };

      const token = data.token;

      // Atualiza o estado global e o AsyncStorage
      setUser(userData);
      await AsyncStorage.setItem("@MyApp:user", JSON.stringify(userData));
      await AsyncStorage.setItem("@MyApp:token", token);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(["@MyApp:user", "@MyApp:token"]);
  };

  // Carrega o usuário salvo no AsyncStorage quando o app inicia
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

// Hook customizado para usar o AuthContext em outros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
