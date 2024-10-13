import React from 'react';
import { View, Text, Button } from 'react-native';

const ProjectDetailsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Project Details Screen</Text>
      <Button title="Back to Project List" onPress={() => navigation.navigate('ProjectListScreen')} />
    </View>
  );
};

export default ProjectDetailsScreen;
