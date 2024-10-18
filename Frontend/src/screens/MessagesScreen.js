import React from 'react';
import { View, Text, Button } from 'react-native';

const MessagesScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages Screen</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('ProjectListScreen')} />
    </View>
  );
};

export default MessagesScreen;
