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


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
        <Stack.Screen name="ProjectDetailsScreen" component={ProjectDetailsScreen} />
        <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
        <Stack.Screen name="MyTasksScreen" component={MyTasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
