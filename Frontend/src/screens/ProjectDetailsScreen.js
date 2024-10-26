import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const ProjectDetailsScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
  
      try {
        console.log("Fetching project details for projectId:", projectId); 
        const response = await axios.get(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setProject(response.data);
        setIsManager(response.data.managerId === userId);
      } catch (error) {
        console.error('שגיאה בקבלת פרטי הפרויקט:', error); 
        console.log("Response data:", error.response?.data);
      }
    };
  
    fetchProjectDetails();
  }, [projectId]);

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>טוען פרטי פרויקט...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.description}>{project.description}</Text>
      <Text style={styles.dates}>תאריך התחלה: {project.startDate} - תאריך סיום: {project.endDate}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('ProjectTasksScreen')}>
        <Image source={require('../../assets/project_tasks_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ProjectProgressScreen')}>
        <Image source={require('../../assets/project_progress_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      {isManager && (
        <TouchableOpacity onPress={() => navigation.navigate('EditProjectScreen', { projectId })}>
          <Image source={require('../../assets/edit_project_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SendNotificationScreen')}>
        <Image source={require('../../assets/send_notification_he.png')} style={styles.buttonImage} />
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
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  dates: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  buttonImage: {
    width: 250,
    height: 60,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default ProjectDetailsScreen;
