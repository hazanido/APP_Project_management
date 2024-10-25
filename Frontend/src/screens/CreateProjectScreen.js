import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from '../api/backendAPI'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState(''); 
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateProject = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); 
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(
        '/projects', 
        {
          name: projectName,
          description, 
          startDate, 
          endDate,
          members: members.split(',').map(member => member.trim()), 
          managerId: userId, 
          tasks: [] 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigation.navigate('ProjectListScreen');
    } catch (error) {
      setErrorMessage('שגיאה ביצירת הפרויקט.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>מסך יצירת פרויקט חדש</Text>

      <TextInput
        style={styles.input}
        placeholder="שם פרויקט"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        style={styles.input}
        placeholder="תיאור פרויקט"
        value={description} 
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="תאריך התחלה"
        value={startDate} 
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="תאריך סיום"
        value={endDate}
        onChangeText={setEndDate}
      />
      <TextInput
        style={styles.input}
        placeholder="משתתפי הפרויקט (מופרדים בפסיקים)"
        value={members}
        onChangeText={setMembers}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={handleCreateProject}>
        <Image source={require('../../assets/Create a new project_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>
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
  buttonImage: {
    width: 200,
    height: 50,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default CreateProjectScreen;
