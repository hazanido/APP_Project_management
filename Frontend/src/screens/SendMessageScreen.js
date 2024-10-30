import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from '../api/backendAPI';
import { useNavigation } from '@react-navigation/native';

const SendMessageScreen = () => {
  const [projects, setProjects] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.get(`/projects/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('שגיאה בטעינת פרויקטים:', error);
        Alert.alert('שגיאה', 'לא ניתן לטעון את רשימת הפרויקטים');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
  
      try {
        const response = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(response.data.email);
      } catch (error) {
        console.error('שגיאה בטעינת מייל המשתמש:', error);
        Alert.alert('שגיאה', 'לא ניתן לטעון את המייל של המשתמש');
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchParticipants = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setLoading(true);
        try {
          const response = await axios.get(`/projects/${selectedProject}/participants`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const formattedParticipants = response.data.map((email) => ({ email }));
          setParticipants(formattedParticipants);
          
          console.log("Participants:", formattedParticipants);
        } catch (error) {
          console.error('שגיאה בטעינת משתתפים:', error);
          Alert.alert('שגיאה', 'לא ניתן לטעון את רשימת המשתתפים');
        } finally {
          setLoading(false);
        }
      };
      fetchParticipants();
    }
  }, [selectedProject]);
  
  const renderParticipant = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.participantItem,
        selectedParticipant === item && styles.selectedParticipant,
      ]}
      onPress={() => {
        setSelectedParticipant(item); 
        console.log("Selected Participant:", item); 
      }}
    >
      <Text style={styles.participantText}>{item.email}</Text>
    </TouchableOpacity>
  );
  const handleSendMessage = async () => {
    if (!selectedParticipant || !title || !message || !userEmail) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.post('/messages', {
            messageSender: userEmail,
            messageRecipient: selectedParticipant.email,
            title,
            message,
          }, { headers: { Authorization: `Bearer ${token}` } });
        
          

      if (response.status === 201) {
        Alert.alert('הצלחה', 'ההודעה נשלחה בהצלחה');
        navigation.goBack();
      }
    } catch (error) {
      console.error('שגיאה בשליחת ההודעה:', error);
      Alert.alert('שגיאה', 'לא ניתן לשלוח את ההודעה');
    }
  };

 

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>טוען נתונים...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>שליחת הודעה</Text>
  
      <Text style={styles.label}>בחר פרויקט</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="בחר פרויקט" value={null} />
        {projects.map((project) => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>
  
      {selectedProject && (
        <>
          <Text style={styles.label}>בחר משתתף</Text>
          {participants.length === 0 ? (
            <Text style={styles.noParticipantsText}>אין משתתפים בפרויקט זה</Text>
          ) : (
            <FlatList
              data={participants}
              renderItem={renderParticipant}
              keyExtractor={(item) => item.email}
              style={styles.participantList}
            />
          )}
  
          <Text style={styles.label}>כותרת</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
  
          <Text style={styles.label}>תוכן ההודעה</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            multiline
          />
  
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
              <Image source={require('../../assets/send_button_he.png')} style={styles.buttonImage} />
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Image source={require('../../assets/back_he.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  participantList: {
    maxHeight: 150,
    marginTop: 10,
    marginBottom: 20,
  },
  participantItem: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
  },
  selectedParticipant: {
    backgroundColor: '#cce5ff',
  },
  participantText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
  },
  buttonImage: {
    width: 120, 
    height: 60, 
    borderRadius: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  noParticipantsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  
});

export default SendMessageScreen;
