import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';

const ProposalItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.proposalItem} onPress={() => onPress(item)}>
    <Text style={styles.proposalTitle}>{item.title}</Text>
    <Text style={styles.proposalStatus}>Status: {item.status}</Text>
    <Text style={styles.proposalDates}>
      Start: {new Date(item.startDate).toLocaleDateString()} - 
      End: {new Date(item.endDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>
);

const ProposalModal = ({ visible, proposal, onClose, onVote, onCreateProposal }) => {
  const [title, setTitle] = useState(proposal?.title || '');
  const [description, setDescription] = useState(proposal?.description || '');
  const [startDate, setStartDate] = useState(proposal?.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(proposal?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleCreateOrUpdate = () => {
    if (proposal) {
      // Update logic here if needed
    } else {
      onCreateProposal({ title, description, startDate, endDate });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{proposal ? proposal.title : 'Create New Proposal'}</Text>
          {proposal ? (
            <>
              <Text style={styles.modalDescription}>{proposal.description}</Text>
              <Text style={styles.modalStatus}>Status: {proposal.status}</Text>
              <View style={styles.voteButtons}>
                <Button title="Vote For" onPress={() => onVote(proposal._id, 'For')} />
                <Button title="Vote Against" onPress={() => onVote(proposal._id, 'Against')} />
                <Button title="Abstain" onPress={() => onVote(proposal._id, 'Abstain')} />
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Proposal Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Proposal Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
              />
              <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                value={endDate}
                onChangeText={setEndDate}
              />
              <Button title="Create Proposal" onPress={handleCreateOrUpdate} />
            </>
          )}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const ProposalScreen = () => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/proposals', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleProposalPress = (proposal) => {
    setSelectedProposal(proposal);
    setModalVisible(true);
  };

  const handleCreateProposal = () => {
    setSelectedProposal(null);
    setModalVisible(true);
  };

  const handleVote = async (proposalId, vote) => {
    try {
      await axios.post(`http://localhost:5000/api/proposals/${proposalId}/vote`, { vote }, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchProposals();
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  const handleCreateNewProposal = async (newProposal) => {
    try {
      await axios.post('http://localhost:5000/api/proposals', newProposal, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchProposals();
    } catch (error) {
      console.error('Error creating new proposal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proposals</Text>
      <FlatList
        data={proposals}
        renderItem={({ item }) => <ProposalItem item={item} onPress={handleProposalPress} />}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateProposal}>
        <Text style={styles.createButtonText}>Create New Proposal</Text>
      </TouchableOpacity>
      <ProposalModal
        visible={modalVisible}
        proposal={selectedProposal}
        onClose={() => setModalVisible(false)}
        onVote={handleVote}
        onCreateProposal={handleCreateNewProposal}
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
  proposalItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  proposalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  proposalStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  proposalDates: {
    fontSize: 12,
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
  modalStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 15,
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

export default ProposalScreen;