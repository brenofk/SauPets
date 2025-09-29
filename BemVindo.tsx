// BemVindo.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BemVindo() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>💚</Text>
          </View>
          <Text style={styles.logoText}>SauPet</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.headerText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cadastrarButton}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.cadastrarText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Corpo */}
      <View style={styles.body}>
        <View style={styles.iconWrapper}>
          <Text style={styles.mainIcon}>💚</Text>
        </View>
        <Text style={styles.title}>SauPet a saúde animal{"\n"}na palma da sua mão</Text>
        <Text style={styles.subtitle}>
          Gerencie a saúde dos seus pets com facilidade. Controle vacinas, receba lembretes e mantenha tudo organizado em um só lugar.
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.startButtonText}>Começar Agora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>

        {/* Benefícios */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureTitle}>Controle de Vacinas</Text>
            <Text style={styles.featureSubtitle}>Mantenha o histórico completo de vacinas dos seus pets sempre atualizado</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureTitle}>Lembretes Automáticos</Text>
            <Text style={styles.featureSubtitle}>Receba notificações para nunca esquecer das próximas vacinas</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🐾</Text>
            <Text style={styles.featureTitle}>Múltiplos Pets</Text>
            <Text style={styles.featureSubtitle}>Gerencie todos os seus cães e gatos em um só aplicativo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8F2', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoIcon: { fontSize: 24, color: '#fff' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginRight: 10, fontSize: 16, color: '#000' },
  cadastrarButton: { backgroundColor: '#4CAF50', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8 },
  cadastrarText: { color: '#fff', fontWeight: 'bold' },

  body: { alignItems: 'center', marginTop: 40 },
  iconWrapper: { backgroundColor: '#4CAF50', padding: 20, borderRadius: 15, marginBottom: 20 },
  mainIcon: { fontSize: 40, color: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 25, paddingHorizontal: 10 },

  actionButtons: { flexDirection: 'row', marginBottom: 30 },
  startButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginRight: 10 },
  startButtonText: { color: '#fff', fontWeight: 'bold' },
  loginButton: { borderColor: '#000', borderWidth: 1, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
  loginButtonText: { color: '#000', fontWeight: 'bold' },

  features: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  featureItem: { alignItems: 'center', flex: 1, paddingHorizontal: 5 },
  featureIcon: { fontSize: 30, backgroundColor: '#E0F0FF', padding: 15, borderRadius: 10, marginBottom: 8 },
  featureTitle: { fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  featureSubtitle: { fontSize: 12, textAlign: 'center', color: '#555' },
});
