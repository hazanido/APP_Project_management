import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import axios from '../api/backendAPI';
import firebase from '../../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '485232347458-98sovcd93k1s4qd599ppi5d6ohoe85tt.apps.googleusercontent.com', // החלף ב-Client ID שקיבלת
    redirectUri: 'http://localhost:8081', // ודא שה-redirect URI נכון
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleLogin(response.authentication);
    }
  }, [response]);

  const handleGoogleLogin = async (authentication) => {
    try {
      if (authentication) {
        const idToken = authentication.idToken;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await firebase.auth().signInWithCredential(credential);
        const user = userCredential.user;

        await AsyncStorage.setItem('userToken', idToken);
        await AsyncStorage.setItem('userId', user.uid);

        console.log('User logged in with Google:', user);
        navigation.navigate('ProjectListScreen');
      } else {
        setErrorMessage('התחברות עם Google נכשלה.');
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

      <TouchableOpacity onPress={() => promptAsync()}>
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
});

export default LoginScreen;
