import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const TelaCadastroVacinas = () => {
  const [nomeVacina, setNomeVacina] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVacina, setDataVacina] = useState('');
  const [dataProximaDose, setDataProximaDose] = useState('');
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

  const handleAdicionarVacina = () => {
    console.log('Vacina cadastrada:', {
      nomeVacina,
      descricao,
      dataVacina,
      dataProximaDose,
      opcaoSelecionada,
    });
  };

  const handleVoltar = () => {
    // Aqui você pode usar navigation.goBack() se estiver usando React Navigation
    console.log('Voltar');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Adicionar vacinas</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome da vacina"
          value={nomeVacina}
          onChangeText={setNomeVacina}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição da vacina"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TextInput
          style={styles.input}
          placeholder="Data da vacina"
          value={dataVacina}
          onChangeText={setDataVacina}
        />

        <TextInput
          style={styles.input}
          placeholder="Data da proxima dose"
          value={dataProximaDose}
          onChangeText={setDataProximaDose}
        />

        

        <TouchableOpacity style={styles.botao} onPress={handleAdicionarVacina}>
          <Icon name="plus" size={16} color="#fff" style={styles.icone} />
          <Text style={styles.textoBotao}>Adicionar vacina</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={handleVoltar}>
          <Icon name="arrow-left" size={16} color="#fff" style={styles.icone} />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TelaCadastroVacinas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3dce6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#e3e7eb',
    padding: 30,
    borderRadius: 20,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#111',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#42566e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
  icone: {
    marginRight: 8,
  },
});
