import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from '../api/backendAPI'; // להחליף בקובץ ה-API המתאים
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState(''); // שדה תיאור
  const [startDate, setStartDate] = useState(''); // שדה תאריך התחלה
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateProject = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // המשתמש שיצר את הפרויקט הופך למנהל
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(
        '/projects', 
        {
          name: projectName,
          description, // שליחת התיאור לשרת
          startDate, // שליחת תאריך התחלה
          endDate,
          members: members.split(',').map(member => member.trim()), // המרת רשימת משתתפים למערך
          managerId: userId, // המשתמש הנוכחי הוא המנהל
          tasks: [] // כרגע אין משימות
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
        value={description} // שדה התיאור
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="תאריך התחלה"
        value={startDate} // שדה תאריך התחלה
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
