import React, { useState, useEffect } from 'react';
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
    // Existing Google login function
  };

  const handleLogin = async () => {
    // Existing handleLogin function
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
  logo: {
    width: 300, 
    height: 300, 
    marginBottom: 50,
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
