import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

const PodDetail = ({ route, navigation }) => {
  const { podId } = route.params;
  const [pod, setPod] = useState(null);

  useEffect(() => {
    fetchPodDetails();
  }, []);

  const fetchPodDetails = async () => {
    try {
      const response = await axios.get(`/api/pods/${podId}`);
      setPod(response.data);
    } catch (error) {
      console.error('Error fetching pod details:', error);
    }
  };

  const renderAppItem = ({ item }) => (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => navigation.navigate('AppDetail', { appId: item._id })}
    >
      <Text style={styles.appName}>{item.name}</Text>
      <Text style={styles.appDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (!pod) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pod.name}</Text>
      <Text style={styles.description}>{pod.description}</Text>
      <Text style={styles.sectionTitle}>Apps in this Pod:</Text>
      <FlatList
        data={pod.apps}
        renderItem={renderAppItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No apps in this pod yet.</Text>}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('PodEdit', { podId: pod._id })}
      >
        <Text style={styles.editButtonText}>Edit Pod</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createAppButton}
        onPress={() => navigation.navigate('AppCreate', { podId: pod._id })}
      >
        <Text style={styles.createAppButtonText}>Create New App</Text>
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  appItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAppButton: {
    backgroundColor: '#4CD964',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createAppButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PodDetail;