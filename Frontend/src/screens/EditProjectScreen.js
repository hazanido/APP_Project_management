import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const EditProjectScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [newParticipant, setNewParticipant] = useState('');
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
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
    fetchProjectDetails();
  }, [projectId]);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        `/projects/${projectId}`,
        { ...project },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'הפרטים נשמרו בהצלחה');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const addParticipant = async () => {
    if (newParticipant && !project.members.includes(newParticipant)) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log("Adding participant to project:", newParticipant);

            const projectResponse = await axios.put(
                `/projects/${projectId}/addParticipant`, 
                { email: newParticipant },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Project update response:", projectResponse.data);
            console.log("Sending request to add project to user...");

            const userResponse = await axios.put('/users/addProject',
                { email: newParticipant, projectId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("User update response:", userResponse.data);

            setProject({ ...project, members: [...project.members, newParticipant] });
            setNewParticipant('');
            Alert.alert('Success', 'המשתתף נוסף');
            
        } catch (error) {
            console.error('Error adding participant:', error);
            Alert.alert('Error', 'ההוספה נכשלה.');
        }
    }
};


const removeParticipant = async (participant) => {
    try {
        const token = await AsyncStorage.getItem('userToken');

        await axios.put(
            `/projects/${projectId}/removeParticipant`, 
            { email: participant },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.put(
            `/users/removeProject`, 
            { email: participant, projectId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject({
            ...project,
            members: project.members.filter((item) => item !== participant),
        });

        Alert.alert('Success', 'המשתמש הוסר בהצלחה');
    } catch (error) {
        console.error('Error removing participant from project:', error);
        Alert.alert('Error', 'Failed to remove participant from project.');
    }
};

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>טוען פרטי פרויקט...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>עריכת פרויקט</Text>
      <TextInput
        style={styles.input}
        placeholder="שם פרויקט"
        value={project.name}
        onChangeText={(text) => setProject({ ...project, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="תאריך התחלה"
        value={project.startDate}
        onChangeText={(text) => setProject({ ...project, startDate: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="תאריך סיום"
        value={project.endDate}
        onChangeText={(text) => setProject({ ...project, endDate: text })}
      />

      <Text style={styles.subTitle}>משתתפים</Text>
      <FlatList
        data={project.members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.participantContainer}>
            <Text style={styles.participantText}>{item}</Text>
            <TouchableOpacity onPress={() => removeParticipant(item)}>
              <Image source={require('../../assets/remove_participant_he.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="הוסף משתתף לפי מייל"
        value={newParticipant}
        onChangeText={setNewParticipant}
      />
      <TouchableOpacity onPress={addParticipant}>
        <Image source={require('../../assets/add_participant_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave}>
        <Image source={require('../../assets/save_he.png')} style={styles.buttonImage} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  participantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantText: {
    fontSize: 16,
  },
  buttonImage: {
    width: 100,
    height: 40,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default EditProjectScreen;
