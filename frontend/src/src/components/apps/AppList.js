import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const AppList = ({ route, navigation }) => {
  const { podId } = route.params;
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await axios.get(`/api/pods/${podId}/apps`);
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };

  const renderAppItem = ({ item }) => (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => navigation.navigate('AppDetail', { podId, appId: item._id })}
    >
      <Text style={styles.appName}>{item.name}</Text>
      <Text style={styles.appDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apps in Pod</Text>
      <FlatList
        data={apps}
        renderItem={renderAppItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No apps in this pod yet.</Text>}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('AppCreate', { podId })}
      >
        <Text style={styles.createButtonText}>Create New App</Text>
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

export default AppList;