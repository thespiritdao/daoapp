import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    walletAddress: '',
    twitter: '',
    linkedin: '',
    farcaster: '',
    areasOfInterest: [],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${/* Get token from storage */}` },
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderField = (label, value, key) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}:</Text>
      {isEditing && key !== 'email' && key !== 'walletAddress' ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setProfile({ ...profile, [key]: text })}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      {renderField('First Name', profile.firstName, 'firstName')}
      {renderField('Last Name', profile.lastName, 'lastName')}
      {renderField('Email', profile.email, 'email')}
      {renderField('Wallet Address', profile.walletAddress, 'walletAddress')}
      {renderField('Twitter', profile.twitter, 'twitter')}
      {renderField('LinkedIn', profile.linkedin, 'linkedin')}
      {renderField('Farcaster', profile.farcaster, 'farcaster')}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Areas of Interest:</Text>
        <Text style={styles.value}>{profile.areasOfInterest.join(', ')}</Text>
      </View>
      {isEditing ? (
        <Button title="Save" onPress={handleUpdate} />
      ) : (
        <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
      )}
    </ScrollView>
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
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;