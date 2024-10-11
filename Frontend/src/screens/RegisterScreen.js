import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from '../api/backendAPI';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('/users/register', {
        name,
        email,
        password,
        age
      });
      console.log('User registered successfully:', response.data);
      navigation.navigate('LoginScreen');
    } catch (err) {
      console.error('Registration failed:', err.response.data);
      setError('הרשמה נכשלה, אנא בדוק את הפרטים שלך.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הרשמה</Text>
      
      <TextInput
        style={styles.input}
        placeholder="שם"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="מייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="גיל"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TouchableOpacity onPress={handleRegister}>
        <Image
          source={require('../../assets/Register_he.png')} 
          style={styles.button}
        />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlign: 'right', 
  },
  button: {
    width: 150, 
    height: 50,  
    marginTop: 20,
    borderRadius: 15, 
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});

export default RegisterScreen;
