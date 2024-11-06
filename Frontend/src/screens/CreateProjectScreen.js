import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Alert, Platform, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/backendAPI'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState(''); 
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date());
  const [members, setMembers] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleDateChange = (event, selectedDate, isStartDate) => {
    const currentDate = selectedDate || (isStartDate ? startDate : endDate);
    isStartDate ? setShowStartPicker(false) : setShowEndPicker(false);
    
    if (isStartDate) {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // פורמט YYYY-MM-DD
  };

  const handleCreateProject = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); 
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(
        '/projects', 
        {
          name: projectName,
          description, 
          startDate: formatDate(startDate), 
          endDate: formatDate(endDate),
          members: members ? members.split(',').map(member => member.trim()) : [], 
          managerId: userId, 
          tasks: [] 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        'הצלחה',
        'הפרויקט נפתח בהצלחה!',
        [
          { text: 'אישור', onPress: () => navigation.navigate('ProjectListScreen') }
        ]
      );
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

      <Button onPress={() => setShowStartPicker(true)} title={`בחר תאריך התחלה: ${formatDate(startDate)}`} />
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, date) => handleDateChange(e, date, true)}
        />
      )}

      <Button onPress={() => setShowEndPicker(true)} title={`בחר תאריך סיום: ${formatDate(endDate)}`} />
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(e, date) => handleDateChange(e, date, false)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="מייל של משתתפי הפרויקט (מופרדים בפסיקים)"
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
