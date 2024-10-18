import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId'); 
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data); 
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo(); 
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>טוען נתונים...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מסך הפרופיל שלי</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>שם: {userInfo.name}</Text>
        <Text style={styles.infoText}>מייל: {userInfo.email}</Text>
      </View>

      <Button title="עריכת פרופיל" onPress={() => navigation.navigate('EditProfileScreen')} />

      <Button title="חזור" onPress={() => navigation.navigate('ProjectListScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
