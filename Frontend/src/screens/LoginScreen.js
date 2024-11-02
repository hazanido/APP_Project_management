import React, { useState,useEffect  } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import axios from '../api/backendAPI';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '485232347458-98sovcd93k1s4qd599ppi5d6ohoe85tt.apps.googleusercontent.com',
  });
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '485232347458-erll3la836qnnbmavv066nus14t6f7d9.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],

    });
  }, []);
  
  const handleGoogleLogin = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("User Info from Google:", userInfo);

        if (!userInfo.data || !userInfo.data.user || !userInfo.data.user.email || !userInfo.data.user.name) {
            console.error("User info is missing essential properties.");
            setErrorMessage("שגיאה בקבלת פרטי המשתמש מ-Google.");
            return;
        }

        const { email, name } = userInfo.data.user;
        console.log("User email:", email);
        console.log("User name:", name);

        const checkUserExistence = async (email) => {
            try {
                const response = await axios.post('/users/login', { email, password: 'google_oauth' });
                const { token, userId } = response.data;
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userId', userId);
                console.log('User logged in successfully with Google:', email);
                navigation.navigate('ProjectListScreen');
                return true;
            } catch (error) {
                console.log('User does not exist, registering new user.');
                return false;
            }
        };

        const userExists = await checkUserExistence(email);
        if (!userExists) {
            try {
                const response = await axios.post('/users/register', {
                    name: name,
                    email: email,
                    password: 'google_oauth',
                    age: 0,
                });
                console.log('User registered successfully:', response.data);

                const loginResponse = await axios.post('/users/login', { email, password: 'google_oauth' });
                const { token, userId } = loginResponse.data;
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userId', userId);
                console.log('User logged in successfully after registration:', email);
                navigation.navigate('ProjectListScreen');
            } catch (error) {
                console.error('Registration and login failed:', error.response?.data || error);
                setErrorMessage('שגיאה בהרשמה או התחברות');
            }
        }
    } catch (error) {
        console.error("Error during Google login:", error);
        setErrorMessage('שגיאה בהתחברות עם Google.');
    }
};


  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, userId } = response.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', userId);
      console.log('User logged in successfully:', response.data.email);
      navigation.navigate('ProjectListScreen');
    } catch (error) {
      setErrorMessage('התחברות נכשלה. בדוק את פרטי הכניסה.');
    }
  };

  return (

    
    <View style={styles.container}>

      <Image 
        source={require('../../assets/logo1.png')} 
        style={styles.logo} 
      />

      <TextInput
        style={styles.input}
        placeholder="מייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={handleLogin}>
        <Image source={require('../../assets/login_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Image source={require('../../assets/Register_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoogleLogin}>
        <Image source={require('../../assets/google login_he.png')} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonImage: {
    width: 200,
    height: 50,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  logo: {
    width: 300,
    height: 300, 
    marginBottom: 40,
  },
});

export default LoginScreen;
