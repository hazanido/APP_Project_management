import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const ProjectTasksScreen = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);

  const fetchProjectTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      const projectResponse = await axios.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsManager(projectResponse.data.managerId === userId);

      const tasksResponse = await axios.get(`/tasks/project/${projectId}`, { 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProjectTasks();
    }, [projectId])
  );

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TaskDetailsScreen', { taskId: item.id, projectId: item.projectId })}>
      <Text style={styles.taskItem}>{item.name}</Text>
    </TouchableOpacity>
  );
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>משימות הפרויקט</Text>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          style={styles.taskList}
        />
      ) : (
        <Text style={styles.noTasksText}>אין משימות זמינות</Text>
      )}

      {isManager && (
        <TouchableOpacity onPress={() => navigation.navigate('CreateTaskScreen', { projectId })}>
          <Image source={require('../../assets/create_task_he.png')} style={styles.createButton} />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/back_he.png')} style={styles.backButton} />
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
    marginBottom: 20,
  },
  taskList: {
    width: '100%',
  },
  taskItem: {
    fontSize: 18,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginVertical: 5,
    textAlign: 'center',
  },
  noTasksText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  createButton: {
    width: 250,
    height: 60,
    borderRadius: 15,
    marginVertical: 10,
  },
  backButton: {
    width: 150,
    height: 50,
    borderRadius: 15,
    marginTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectTasksScreen;