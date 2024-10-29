import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from '../api/backendAPI';

const EditTaskScreen = ({ route }) => {
  const { taskId, projectId } = route.params;
  const navigation = useNavigation();
  const [task, setTask] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    taskPersonId: '',
    status: 'in-progress',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [originalTaskPersonId, setOriginalTaskPersonId] = useState('');

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const fetchTaskDetails = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
        setOriginalTaskPersonId(response.data.taskPersonId); 
    } catch (error) {
        console.error('Error fetching task details:', error);
        Alert.alert('שגיאה', 'לא ניתן לטעון את פרטי המשימה');
    } finally {
        setIsLoading(false);
    }
};


const handleSave = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        
        const currentUserEmail = originalTaskPersonId;  
        
        const newUserEmail = task.taskPersonId;

        if (newUserEmail !== currentUserEmail) {
            await axios.put(
                `/users/tasks/assign`,
                { taskId, newUserEmail, currentUserEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }

        await axios.put(`/tasks/${taskId}`, { ...task, taskPersonId: newUserEmail }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        Alert.alert('הצלחה', 'המשימה נשמרה בהצלחה');
        navigation.goBack();
    } catch (error) {
        console.error('Error updating task:', error);
        Alert.alert('שגיאה', 'לא ניתן לעדכן את המשימה');
    }
};





  const toggleTaskStatus = () => {
    setTask((prevTask) => ({
      ...prevTask,
      status: prevTask.status === 'completed' ? 'in-progress' : 'completed',
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>שם המשימה</Text>
      <TextInput
        style={styles.input}
        value={task.name}
        onChangeText={(text) => setTask({ ...task, name: text })}
      />

      <Text style={styles.label}>תיאור המשימה</Text>
      <TextInput
        style={styles.input}
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
      />

      <Text style={styles.label}>תאריך התחלה</Text>
      <TextInput
        style={styles.input}
        value={task.startDate}
        onChangeText={(text) => setTask({ ...task, startDate: text })}
      />

      <Text style={styles.label}>תאריך סיום</Text>
      <TextInput
        style={styles.input}
        value={task.endDate}
        onChangeText={(text) => setTask({ ...task, endDate: text })}
      />

      <Text style={styles.label}>שיוך המשימה</Text>
      <TextInput
        style={styles.input}
        value={task.taskPersonId}
        onChangeText={(text) => setTask({ ...task, taskPersonId: text })}
      />

      <TouchableOpacity onPress={toggleTaskStatus} style={styles.statusButton}>
        <Text style={styles.buttonText}>
          {task.status === 'completed' ? 'סמן כבתהליך' : 'סמן כהושלם'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.buttonText}>שמור</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../assets/back_he.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  statusButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 150,
    height: 50,
    borderRadius: 15,
    marginTop: 30,
  },
  backButtonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditTaskScreen;
