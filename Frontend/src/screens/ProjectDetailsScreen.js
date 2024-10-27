import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from '../api/backendAPI';

const ProjectDetailsScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [isManager, setIsManager] = useState(false);

  const fetchProjectDetails = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject(response.data);
      setIsManager(response.data.managerId === userId);
    } catch (error) {
      console.error('Error getting project details:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProjectDetails();
    }, [projectId])
  );

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

      <Text style={styles.participantsTitle}>משתתפי הפרויקט:</Text>
      <FlatList
        data={project.members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.participantItem}>{item}</Text>
        )}
      />

      {isManager && (
        <TouchableOpacity onPress={() => navigation.navigate('CreateTaskScreen', { projectId })}>
          <Image source={require('../../assets/create_task_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('ProjectProgressScreen', { projectId })}>
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
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  participantItem: {
    fontSize: 16,
    color: 'black',
    marginVertical: 2,
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
