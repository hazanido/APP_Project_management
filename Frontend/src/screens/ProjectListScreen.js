import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const ProjectListScreen = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchProjects = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); 
      const response = await axios.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setProjects(response.data); 
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProjects(); 
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); 
    navigation.navigate('LoginScreen'); 
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}>
      <Text style={styles.projectItem}>{item.name}</Text>
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
      <Text style={styles.title}>הפרויקטים שלי</Text>

      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          style={styles.projectList}
        />
      ) : (
        <Text style={styles.noProjectsText}>אין פרויקטים זמינים</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('CreateProjectScreen')}>
        <Image
          source={require('../../assets/Create a new project_he.png')} 
          style={styles.buttonImageLarge} 
        />
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => navigation.navigate('MyTasksScreen')}>
        <Image
          source={require('../../assets/my tasks_he.png')} 
          style={styles.buttonImageLarge} 
        />
      </TouchableOpacity>

      
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.navigate('MessagesScreen')}>
          <Image
            source={require('../../assets/Message box_he.png')} 
            style={styles.smallButtonImageLarge} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Image
            source={require('../../assets/profile_he.png')} 
            style={styles.smallButtonImageLarge} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={require('../../assets/logout_he.png')} 
            style={styles.smallButtonImageLarge} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  projectList: {
    width: '80%',
  },
  projectItem: {
    fontSize: 18,
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    borderRadius: 10,
  },
  noProjectsText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  buttonImageLarge: {
    width: 250,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  smallButtonImageLarge: {
    width: 90, 
    height: 50,
    borderRadius: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectListScreen;
