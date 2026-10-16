import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/AppRoutes";
import { API_URL } from '../../config/config';
import { cores } from '../../estilos/cores';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [fontsLoaded] = useFonts({
    Feather: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={cores.verdePrincipal} />
      </View>
    );
  }

  const handleLogin = async () => {
    let valid = true;
    setEmailError("");
    setSenhaError("");
    setLoginError("");

    if (email.trim() === "") {
      setEmailError("O email é obrigatório");
      valid = false;
    }

    if (senha.trim() === "") {
      setSenhaError("A senha é obrigatória");
      valid = false;
    }

    if (!valid) return;

    try {
      setLoading(true);
      await signIn(email, senha);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setLoginError(error.message || "Falha de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoContainer}>
        <Feather name="heart" size={50} color={cores.verdePrincipal} />
        <Text style={styles.appName}>SauPet</Text>
        <Text style={styles.subtitle}>
          Cuidado veterinário na palma da sua mão
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.description}>
          Acesse sua conta para cuidar dos seus pets
        </Text>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={cores.verdePrincipal}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        </View>
        {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}

        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

        <TouchableOpacity>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={cores.branco} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Não tem uma conta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Cadastro")}
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoPrincipal,
    justifyContent: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  appName: { fontSize: 26, fontWeight: "bold", color: cores.textoBase, marginTop: 10 },
  subtitle: { fontSize: 14, color: cores.textoSecundario, textAlign: "center" },
  card: {
    backgroundColor: cores.branco,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
    color: cores.textoBase,
  },
  description: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, color: cores.textoBase },
  forgotText: {
    color: cores.verdePrincipal,
    fontSize: 13,
    textAlign: "right",
    marginBottom: 16,
  },
  button: {
    backgroundColor: cores.verdePrincipal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: cores.branco, fontSize: 16, fontWeight: "600" },
  registerText: { fontSize: 14, textAlign: "center", color: cores.textoSecundario },
  registerLink: { color: cores.verdePrincipal, fontWeight: "600" },
  errorText: {
    color: cores.erro,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
    textAlign: "center",
  },
});