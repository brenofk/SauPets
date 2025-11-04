// BemVindo.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BemVindo() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image source={require('../../assets/gato.png')} style={styles.icon} />
        <Image source={require('../../assets/cachorro-sentado.png')} style={styles.icon} />
      </View>

      {/* Corpo */}
      <View style={styles.body}>
        <View style={styles.iconWrapper}>
          <Text style={styles.mainIcon}>💚</Text>
        </View>
        <Text style={styles.title}>SauPet a saúde animal{"\n"}na palma da sua mão</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.startButtonText}>Começar Agora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#DDF3E0', // verde claro em toda a tela
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
  },
  iconWrapper: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  mainIcon: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginRight: 10,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginButton: {
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  featureIcon: {
    fontSize: 30,
    backgroundColor: '#E0F0FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
  },
});
