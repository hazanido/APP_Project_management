import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert,Platform  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from '../api/backendAPI';
import * as Calendar from 'expo-calendar';

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  };

const TaskDetailsScreen = ({ route }) => {
  const { taskId, projectId } = route.params;
  const navigation = useNavigation();
  const [task, setTask] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTaskDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      const taskResponse = await axios.get(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(taskResponse.data);
      const projectResponse = await axios.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsManager(projectResponse.data.managerId === userId);
    } catch (error) {
        console.error('Error fetching task details:', error);
     
        if (error.response && error.response.status === 404) {
           Alert.alert('שגיאה', 'הפרויקט לא נמצא');
        } else {
           Alert.alert('שגיאה', 'לא ניתן היה לטעון את פרטי המשימה');
        }
     }
      finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTaskDetails();
    }, [taskId, projectId])
  );

  const addTaskToGoogleCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendarSource = Platform.OS === 'ios'
          ? await Calendar.getDefaultCalendarAsync()
          : calendars.length > 0 ? { id: calendars[0].id } : null;
  
        if (!defaultCalendarSource) {
          Alert.alert('שגיאה', 'לא נמצא יומן ברירת מחדל');
          return;
        }
  
        const startDate = parseDate(task.startDate);
        const endDate = parseDate(task.endDate);
        console.log("Parsed Start Date:", startDate);
        console.log("Parsed End Date:", endDate);
  
        const eventId = await Calendar.createEventAsync(defaultCalendarSource.id, {
          title: task.name,
          startDate,
          endDate,
          notes: task.description,
        });
        console.log("Event added with ID:", eventId);
  
        Alert.alert('הצלחה', 'המשימה נוספה ליומן Google');
      }
    } catch (error) {
      console.error('Error adding task to Google Calendar:', error);
      Alert.alert('שגיאה', 'לא ניתן להוסיף את המשימה ליומן Google');
    }
  };
  
  
  

  const toggleTaskStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
  
      await axios.put(
        `/tasks/${taskId}`,
        { status: newStatus },  
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTask(prevTask => ({ ...prevTask, status: newStatus }));
      Alert.alert('הצלחה', `המשימה סומנה כ${newStatus === 'completed' ? 'הושלמה' : 'בתהליך'}`);
    } catch (error) {
      console.error('Error toggling task status:', error);
      Alert.alert('שגיאה', 'לא ניתן לעדכן את הסטטוס של המשימה');
    }
  };
  
  

  if (loading || !task) {
    return (
      <View style={styles.loaderContainer}>
        <Text>טוען פרטי המשימה...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {task && (
        <>
          <Text style={styles.title}>{task.name}</Text>
          <Text style={styles.description}>{task.description}</Text>
          <Text style={styles.date}>תאריך התחלה: {task.startDate}</Text>
          <Text style={styles.date}>תאריך סיום: {task.endDate}</Text>
          <Text
            style={[
              styles.status,
              { color: task.status === 'completed' ? 'green' : 'red' }
            ]}
          >
            סטטוס: {task.status === 'completed' ? 'הושלם' : 'בתהליך'}
          </Text>
        </>
      )}
  
  
      <TouchableOpacity onPress={addTaskToGoogleCalendar} style={styles.button}>
        <Text style={styles.buttonText}>הוסף ליומן</Text>
      </TouchableOpacity>
  
      {isManager && (
        <TouchableOpacity onPress={() => navigation.navigate('EditTaskScreen', { taskId, projectId })} style={styles.button}>
          <Text style={styles.buttonText}>ערוך משימה</Text>
        </TouchableOpacity>
      )}
  
  <TouchableOpacity onPress={toggleTaskStatus} style={styles.button}>
  <Text style={styles.buttonText}>
    {task.status === 'completed' ? 'סמן כבתהליך' : 'סמן כהושלם'}
  </Text>
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
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
    },
    date: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 5,
    },
    status: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    backButton: {
      marginTop: 20,
    },
    backButtonImage: {
      width: 150,
      height: 50,
      borderRadius: 15,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  

export default TaskDetailsScreen;
