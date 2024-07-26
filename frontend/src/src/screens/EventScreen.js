import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';

const EventItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.eventItem} onPress={() => onPress(item)}>
    <Text style={styles.eventTitle}>{item.title}</Text>
    <Text style={styles.eventDate}>
      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
    </Text>
    <Text style={styles.eventLocation}>{item.location.type}: {item.location.details}</Text>
  </TouchableOpacity>
);

const EventModal = ({ visible, event, onClose, onRegister, onUnregister, onCreateEvent }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(event?.endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [locationType, setLocationType] = useState(event?.location?.type || 'Physical');
  const [locationDetails, setLocationDetails] = useState(event?.location?.details || '');

  const handleCreateOrUpdate = () => {
    if (event) {
      // Update logic here if needed
    } else {
      onCreateEvent({ title, description, startDate, endDate, location: { type: locationType, details: locationDetails } });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{event ? event.title : 'Create New Event'}</Text>
          {event ? (
            <>
              <Text style={styles.modalDescription}>{event.description}</Text>
              <Text style={styles.modalDate}>
                Start: {new Date(event.startDate).toLocaleString()}
              </Text>
              <Text style={styles.modalDate}>
                End: {new Date(event.endDate).toLocaleString()}
              </Text>
              <Text style={styles.modalLocation}>
                Location: {event.location.type} - {event.location.details}
              </Text>
              <Text style={styles.modalAttendees}>
                Attendees: {event.attendees.length} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}
              </Text>
              <View style={styles.actionButtons}>
                <Button title="Register" onPress={() => onRegister(event._id)} />
                <Button title="Unregister" onPress={() => onUnregister(event._id)} />
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Event Description"
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
              <TextInput
                style={styles.input}
                placeholder="Location Type (Physical/Virtual)"
                value={locationType}
                onChangeText={setLocationType}
              />
              <TextInput
                style={styles.input}
                placeholder="Location Details"
                value={locationDetails}
                onChangeText={setLocationDetails}
              />
              <Button title="Create Event" onPress={handleCreateOrUpdate} />
            </>
          )}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setModalVisible(true);
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/unregister`, {}, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('Error unregistering from event:', error);
    }
  };

  const handleCreateNewEvent = async (newEvent) => {
    try {
      await axios.post('http://localhost:5000/api/events', newEvent, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating new event:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventItem item={item} onPress={handleEventPress} />}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
        <Text style={styles.createButtonText}>Create New Event</Text>
      </TouchableOpacity>
      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={() => setModalVisible(false)}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onCreateEvent={handleCreateNewEvent}
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
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  eventLocation: {
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
  modalDate: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  modalLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalAttendees: {
    fontSize: 14,
    marginBottom: 15,
  },
  actionButtons: {
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

export default EventScreen;