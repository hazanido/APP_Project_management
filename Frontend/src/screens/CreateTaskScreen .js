import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const CreateTaskScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedUserEmail, setAssignedUserEmail] = useState('');

  const createTask = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(
        '/tasks',
        {
          projectId,
          name: taskName,
          description,
          startDate,
          endDate,
          taskPersonId: assignedUserEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Alert.alert('הצלחה', 'המשימה נוצרה בהצלחה!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('שגיאה', 'לא ניתן היה ליצור את המשימה. בדוק את הנתונים ונסה שנית.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>יצירת משימה חדשה</Text>

      <TextInput
        style={styles.input}
        placeholder="שם המשימה"
        value={taskName}
        onChangeText={setTaskName}
      />

      <TextInput
        style={styles.input}
        placeholder="תיאור המשימה"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="תאריך התחלה (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />

      <TextInput
        style={styles.input}
        placeholder="תאריך סיום (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TextInput
        style={styles.input}
        placeholder="מייל של המשתמש"
        value={assignedUserEmail}
        onChangeText={setAssignedUserEmail}
      />

      <TouchableOpacity onPress={createTask}>
        <Image source={require('../../assets/create_task_button_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/back_he.png')} style={styles.backButton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  buttonImage: {
    width: 250,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  backButton: {
    width: 250,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default CreateTaskScreen;
