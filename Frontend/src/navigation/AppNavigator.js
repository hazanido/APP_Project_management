import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditProjectScreen from '../screens/EditProjectScreen';
import ProjectProgressScreen from '../screens/ProjectProgressScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen ';
import ProjectTasksScreen from '../screens/ProjectTasksScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import SendMessageScreen from '../screens/SendMessageScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
        <Stack.Screen name="ProjectDetailsScreen" component={ProjectDetailsScreen} />
        <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
        <Stack.Screen name="MyTasksScreen" component={MyTasksScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="EditProjectScreen" component={EditProjectScreen} />
        <Stack.Screen name="ProjectProgressScreen" component={ProjectProgressScreen} />
        <Stack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
        <Stack.Screen name="ProjectTasksScreen" component={ProjectTasksScreen} />
        <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
        <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
        <Stack.Screen name="SendMessageScreen" component={SendMessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
