import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

     
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
          <Image
            source={require('../../assets/Editing a profile_he.png')}  
            style={styles.button}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ProjectListScreen')}>
          <Image
            source={require('../../assets/back_he.png')}  
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
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
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '80%', 
    position: 'absolute', 
    bottom: 30, 
  },
  button: {
    width: 150,
    height: 50,
    marginHorizontal: 10, 
    borderRadius: 15,
  },
});

export default ProfileScreen;
