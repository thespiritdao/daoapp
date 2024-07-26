import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const ArtifactItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item)}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <Text style={styles.itemName}>{item.name}</Text>
    <Text style={styles.itemPrice}>{item.price.amount} {item.price.currency}</Text>
  </TouchableOpacity>
);

const ArtifactModal = ({ visible, artifact, onClose, onBuy }) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Image source={{ uri: artifact?.imageUrl }} style={styles.modalImage} />
        <Text style={styles.modalName}>{artifact?.name}</Text>
        <Text style={styles.modalDescription}>{artifact?.description}</Text>
        <Text style={styles.modalPrice}>{artifact?.price?.amount} {artifact?.price?.currency}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={onBuy}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const ArtifactsScreen = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/artifacts', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
    }
  };

  const handleArtifactPress = (artifact) => {
    setSelectedArtifact(artifact);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    // Implement purchase logic here
    console.log('Buying artifact:', selectedArtifact);
    // You would typically make an API call to process the purchase
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artifacts Shop</Text>
      <FlatList
        data={artifacts}
        renderItem={({ item }) => <ArtifactItem item={item} onPress={handleArtifactPress} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
      />
      <ArtifactModal
        visible={modalVisible}
        artifact={selectedArtifact}
        onClose={() => setModalVisible(false)}
        onBuy={handleBuy}
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
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#007AFF',
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
    alignItems: 'center',
    width: '80%',
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ArtifactsScreen;