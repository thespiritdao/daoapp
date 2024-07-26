import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const PodList = ({ navigation }) => {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    try {
      const response = await axios.get('/api/pods');
      setPods(response.data);
    } catch (error) {
      console.error('Error fetching pods:', error);
    }
  };

  const renderPodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.podItem}
      onPress={() => navigation.navigate('PodDetail', { podId: item._id })}
    >
      <Text style={styles.podName}>{item.name}</Text>
      <Text style={styles.podDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pods</Text>
      <FlatList
        data={pods}
        renderItem={renderPodItem}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('PodCreate')}
      >
        <Text style={styles.createButtonText}>Create New Pod</Text>
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
  podItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  podName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  podDescription: {
    fontSize: 14,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PodList;