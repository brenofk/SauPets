import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FaCat, FaPaw, FaHome } from 'react-icons/fa'; // Somente se estiver usando React DOM

const TelaCadastroPet = () => {
  const [nomePet, setNomePet] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState('');

  const handleCadastro = () => {
    console.log('Pet cadastrado:', { nomePet, tipoAnimal });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.label}>Digite o nome do seu pet</Text>
        <TextInput
          placeholder="hunter"
          style={styles.input}
          value={nomePet}
          onChangeText={setNomePet}
        />

        <Text style={styles.label}>Escolha o tipo de animal</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoAnimal}
            onValueChange={(itemValue) => setTipoAnimal(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="clique aqui" value="" />
            <Picker.Item label="Cachorro" value="Cachorro" />
            <Picker.Item label="Gato" value="Gato" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.botaoTexto}>Cadastrar pet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TelaCadastroPet;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3dce6',
  },
  card: {
    backgroundColor: '#e3e7eb',
    padding: 30,
    borderRadius: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#222',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 14,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  botao: {
    backgroundColor: '#42566e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
});
