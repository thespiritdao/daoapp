import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const AppEdit = ({ route, navigation }) => {
  const { podId, appId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppDetails();
  }, []);

  const fetchAppDetails = async () => {
    try {
      const response = await axios.get(`/api/pods/${podId}/apps/${appId}`);
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      setError('Error fetching app details. Please try again.');
      console.error('Error fetching app details:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/pods/${podId}/apps/${appId}`, { name, description });
      navigation.navigate('AppDetail', { podId, appId });
    } catch (error) {
      setError('Error updating app. Please try again.');
      console.error('Error updating app:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit App</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="App Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="App Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update App</Text>
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

export default AppEdit;