import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from '../api/backendAPI'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); 
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.put(
        `/users/${userId}`, 
        {
          name,
          email,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage('הפרטים נשמרו בהצלחה!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('שגיאה בשמירת הפרטים.');
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    navigation.navigate('ProfileScreen'); 
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); 
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        setErrorMessage('שגיאה בטעינת פרטי המשתמש.');
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ערוך פרופיל</Text>

      <TextInput
        style={styles.input}
        placeholder="שם פרטי"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="אימייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Image source={require('../../assets/save_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleCancel}>
          <Image source={require('../../assets/back_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  buttonImage: {
    width: 150,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default EditProfileScreen;
