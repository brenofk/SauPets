// TelaCadastroVacinas.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type VacinasScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TelaCadastroVacinas'>;
type Props = { navigation: VacinasScreenNavigationProp };

export default function TelaCadastroVacinas({ navigation }: Props) {
  const [nomePet, setNomePet] = useState('');
  const [vacina, setVacina] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      console.log('Vacina salva', { nomePet, vacina });
      setNomePet('');
      setVacina('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro de Vacinas</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do Pet"
          placeholderTextColor="#777"
          value={nomePet}
          onChangeText={setNomePet}
        />
        <TextInput
          style={styles.input}
          placeholder="Vacina"
          placeholderTextColor="#777"
          value={vacina}
          onChangeText={setVacina}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#DDF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#C7E7D4',
    padding: 25,
    borderRadius: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
