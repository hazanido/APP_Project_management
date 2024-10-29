import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/backendAPI';

const screenWidth = Dimensions.get('window').width;

const ProjectProgressScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(1);

  useEffect(() => {
    const fetchProjectProgress = async () => {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.get(`/tasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data;
        const completed = tasks.filter(task => task.status === 'completed').length;
        setCompletedTasks(completed);
        setTotalTasks(tasks.length);
      } catch (error) {
        console.error('Error fetching project progress:', error);
      }
    };

    fetchProjectProgress();
  }, [projectId]);

  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התקדמות הפרויקט</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { name: 'הושלם', population: completedTasks, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'נותר', population: totalTasks - completedTasks, color: 'gray', legendFontColor: '#7F7F7F', legendFontSize: 15 },
          ]}
          width={screenWidth * 0.8}  
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <Text style={styles.progressText}>התקדמות: {completionPercentage.toFixed(1)}%</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/back_he.png')} style={styles.backButton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    marginVertical: 20,
  },
  backButton: {
    width: 150,
    height: 50,
    borderRadius: 15,
    marginTop: 30,
  },
});

export default ProjectProgressScreen;
