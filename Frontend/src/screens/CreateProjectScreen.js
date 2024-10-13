import React from 'react';
import { View, Text, Button } from 'react-native';

const CreateProjectScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Create New Project Screen</Text>
      <Button title="Back to Project List" onPress={() => navigation.navigate('ProjectListScreen')} />
    </View>
  );
};

export default CreateProjectScreen;
