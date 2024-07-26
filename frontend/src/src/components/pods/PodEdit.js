import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const PodEdit = ({ route, navigation }) => {
  const { podId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPodDetails();
  }, []);

  const fetchPodDetails = async () => {
    try {
      const response = await axios.get(`/api/pods/${podId}`);
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      setError('Error fetching pod details. Please try again.');
      console.error('Error fetching pod details:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/pods/${podId}`, { name, description });
      navigation.navigate('PodDetail', { podId });
    } catch (error) {
      setError('Error updating pod. Please try again.');
      console.error('Error updating pod:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Pod</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Pod Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Pod Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Pod</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default PodEdit;