import React, { useState } from "react";
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

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  // Carregando fontes dos ícones Feather
  const [fontsLoaded] = useFonts({
    Feather: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  const handleLogin = () => {
    let valid = true;

    setEmailError("");
    setSenhaError("");

    if (email.trim() === "") {
      setEmailError("O email é obrigatório");
      valid = false;
    }

    if (senha.trim() === "") {
      setSenhaError("A senha é obrigatória");
      valid = false;
    }

    if (!valid) return;

    // Aqui você faria a verificação se o email está cadastrado no sistema
    navigation.navigate("TelaPrincipal" as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoContainer}>
        <Feather name="heart" size={50} color="#2ecc71" />
        <Text style={styles.appName}>SauPet</Text>
        <Text style={styles.subtitle}>Cuidado veterinário na palma da sua mão</Text>
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
              color="#2ecc71"
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        </View>
        {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}

        <TouchableOpacity>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Não tem uma conta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Cadastro" as never)}
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fdf9", justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  appName: { fontSize: 26, fontWeight: "bold", color: "#333", marginTop: 10 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 4, textAlign: "center", color: "#222" },
  description: { fontSize: 14, color: "#777", marginBottom: 16, textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#333" },
  forgotText: { color: "#2ecc71", fontSize: 13, textAlign: "right", marginBottom: 16 },
  button: { backgroundColor: "#2ecc71", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  registerText: { fontSize: 14, textAlign: "center", color: "#555" },
  registerLink: { color: "#2ecc71", fontWeight: "600" },
  errorText: { color: "red", fontSize: 12, marginBottom: 8, marginLeft: 4 },
});
