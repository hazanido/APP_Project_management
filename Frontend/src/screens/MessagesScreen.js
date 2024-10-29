import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from '../api/backendAPI';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`/messages/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('שגיאה בשליפת הודעות:', error);
      Alert.alert('שגיאה', 'לא ניתן לטעון את ההודעות');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setModalVisible(false);
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity onPress={() => openMessage(item)} style={styles.messageItem}>
      <Text style={styles.messageTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תיבת הודעות</Text>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>כותרת: {selectedMessage?.title}</Text>
            <Text>תוכן: {selectedMessage?.content}</Text>
            <Text>נשלח על ידי: {selectedMessage?.sender}</Text>
            <Text>נשלח אל: {selectedMessage?.recipient}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateMessageScreen')}>
          <Image source={require('../../assets/send_message_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Image source={require('../../assets/profile_he.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  messagesList: {
    flex: 1,
    width: '90%',
    marginTop: 20,
  },
  messageItem: {
    fontSize: 18,
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonImage: {
    width: 120, 
    height: 60, 
    borderRadius: 15,
  },
});


export default MessagesScreen;
