
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from '../api/backendAPI';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', {
        email,
        password,
      });
      // add token to local storage
      console.log(response.data);
      navigation.navigate('HomeScreen');
    } catch (error) {
      setErrorMessage('התחברות נכשלה. בדוק את פרטי הכניסה.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="מייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="התחבר" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
