import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Linking } from 'react-native';
import axios from 'axios';

const ResourceItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.resourceItem} onPress={() => onPress(item)}>
    <Text style={styles.resourceTitle}>{item.title}</Text>
    <Text style={styles.resourceType}>{item.type}</Text>
    <Text style={styles.resourceCategory}>{item.category}</Text>
  </TouchableOpacity>
);

const ResourceModal = ({ visible, resource, onClose, onCreateResource }) => {
  const [title, setTitle] = useState(resource?.title || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [url, setUrl] = useState(resource?.url || '');
  const [type, setType] = useState(resource?.type || '');
  const [category, setCategory] = useState(resource?.category || '');
  const [accessControl, setAccessControl] = useState(resource?.accessControl || 'Members');

  const handleCreateOrUpdate = () => {
    if (resource) {
      // Update logic here if needed
    } else {
      onCreateResource({ title, description, url, type, category, accessControl });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{resource ? resource.title : 'Create New Resource'}</Text>
          {resource ? (
            <>
              <Text style={styles.modalDescription}>{resource.description}</Text>
              <Text style={styles.modalType}>Type: {resource.type}</Text>
              <Text style={styles.modalCategory}>Category: {resource.category}</Text>
              <Text style={styles.modalAccess}>Access: {resource.accessControl}</Text>
              <Button title="Open Resource" onPress={() => Linking.openURL(resource.url)} />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Resource Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Resource Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Resource URL"
                value={url}
                onChangeText={setUrl}
              />
              <TextInput
                style={styles.input}
                placeholder="Resource Type"
                value={type}
                onChangeText={setType}
              />
              <TextInput
                style={styles.input}
                placeholder="Resource Category"
                value={category}
                onChangeText={setCategory}
              />
              <TextInput
                style={styles.input}
                placeholder="Access Control (Public/Members/Specific Roles)"
                value={accessControl}
                onChangeText={setAccessControl}
              />
              <Button title="Create Resource" onPress={handleCreateOrUpdate} />
            </>
          )}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const ResourceScreen = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resources', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleResourcePress = (resource) => {
    setSelectedResource(resource);
    setModalVisible(true);
  };

  const handleCreateResource = () => {
    setSelectedResource(null);
    setModalVisible(true);
  };

  const handleCreateNewResource = async (newResource) => {
    try {
      await axios.post('http://localhost:5000/api/resources', newResource, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchResources();
    } catch (error) {
      console.error('Error creating new resource:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources</Text>
      <FlatList
        data={resources}
        renderItem={({ item }) => <ResourceItem item={item} onPress={handleResourcePress} />}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateResource}>
        <Text style={styles.createButtonText}>Create New Resource</Text>
      </TouchableOpacity>
      <ResourceModal
        visible={modalVisible}
        resource={selectedResource}
        onClose={() => setModalVisible(false)}
        onCreateResource={handleCreateNewResource}
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
  resourceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resourceType: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  resourceCategory: {
    fontSize: 14,
    color: '#666',
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
  modalDescription: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalType: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  modalCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalAccess: {
    fontSize: 14,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default ResourceScreen;