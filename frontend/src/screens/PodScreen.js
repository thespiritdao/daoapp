import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';

const PodItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.podItem} onPress={() => onPress(item)}>
    <Text style={styles.podName}>{item.name}</Text>
    <Text style={styles.podDescription}>{item.description}</Text>
    <Text style={styles.podMembers}>Members: {item.members.length}</Text>
  </TouchableOpacity>
);

const PodModal = ({ visible, pod, onClose, onUpdate }) => {
  const [name, setName] = useState(pod?.name || '');
  const [description, setDescription] = useState(pod?.description || '');

  const handleUpdate = () => {
    onUpdate({ ...pod, name, description });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{pod ? 'Edit Pod' : 'Create New Pod'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Pod Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Pod Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Button title={pod ? 'Update Pod' : 'Create Pod'} onPress={handleUpdate} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const PodScreen = () => {
  const [pods, setPods] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pods', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setPods(response.data);
    } catch (error) {
      console.error('Error fetching pods:', error);
    }
  };

  const handlePodPress = (pod) => {
    setSelectedPod(pod);
    setModalVisible(true);
  };

  const handleCreatePod = () => {
    setSelectedPod(null);
    setModalVisible(true);
  };

  const handleUpdatePod = async (updatedPod) => {
    try {
      if (updatedPod._id) {
        await axios.put(`http://localhost:5000/api/pods/${updatedPod._id}`, updatedPod, {
          headers: { Authorization: `Bearer ${/* Get token from storage */}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/pods', updatedPod, {
          headers: { Authorization: `Bearer ${/* Get token from storage */}` },
        });
      }
      setModalVisible(false);
      fetchPods();
    } catch (error) {
      console.error('Error updating/creating pod:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pods</Text>
      <FlatList
        data={pods}
        renderItem={({ item }) => <PodItem item={item} onPress={handlePodPress} />}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreatePod}>
        <Text style={styles.createButtonText}>Create New Pod</Text>
      </TouchableOpacity>
      <PodModal
        visible={modalVisible}
        pod={selectedPod}
        onClose={() => setModalVisible(false)}
        onUpdate={handleUpdatePod}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  podItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  podName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  podDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  podMembers: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default PodScreen;