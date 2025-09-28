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
      <Text style={styles.title}>Cadastro de Vacinas</Text>

      <TextInput style={styles.input} placeholder="Nome do Pet" value={nomePet} onChangeText={setNomePet} />
      <TextInput style={styles.input} placeholder="Vacina" value={vacina} onChangeText={setVacina} />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSalvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 12 },
  primaryButton: { backgroundColor: '#0ea5a4', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: '600' },
});
