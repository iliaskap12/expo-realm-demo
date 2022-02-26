import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, Button, Alert, Platform } from "react-native";
import { useAuth } from '../providers/AuthProvider';
import styles from '../stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginView ({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user != null) {
      navigation.navigate('Links')
    }
  }, [user])

  const onPressSignIn = async () => {
    console.log('Trying sign in with user: ' + email);
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign in: ${error.message}`;
      console.error(errorMessage);
      Alert.alert(errorMessage);
    }
  };

  const onPressSignUp = async () => {
    console.log('Trying signup with user: ' + email);
    try {
      await signUp(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign up: ${error.message}`;
      console.error(errorMessage);
      Alert.alert(errorMessage);
    }
  };

  return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text>Sign Up or Sign In:</Text>
        <SafeAreaView style={styles.inputContainer}>
          <TextInput
            placeholder='email'
            autoCapitalize='none'
            onChangeText={(mail) => {
              setEmail(mail)
            }}
            value={email}
            style={styles.inputStyle}
            keyboardType='email-address'
          />
        </SafeAreaView>
        <SafeAreaView style={styles.inputContainer}>
          <TextInput
            placeholder='password'
            secureTextEntry
            onChangeText={(pass) => {
              setPassword(pass)
            }}
            value={password}
            style={styles.inputStyle}
          />
        </SafeAreaView>
        <Button onPress={onPressSignIn} title='Sign In' />
        <Button onPress={onPressSignUp} title='Sign Up' />
      </KeyboardAvoidingView>
  );
}
