import React, { useState, useEffect } from 'react';
import { Stack, Button } from "@react-native-material/core";
import { View, Text, Image, TextInput, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../config/firebaseConfig';
import PasswordReset from './PasswordReset/passwordReset';
import styles from './style';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
import {getReactNativePersistence} from 'firebase/auth/react-native';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(true);

  const app = initializeApp(firebaseConfig);

  // Garante que o botão 'Entrar' só esteja disponível quando ambos os campos estiverem
  useEffect(() => {

    if (email && password) {
      setError(false)
    } else {
      setError(true);
    }
  }, [email, password])

  const onLoginPress = () => {

    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        console.log('Usuário logado!');
        const user = userCredential.user;

        navigation.replace('Home');
      })
      .catch((error) => {
        if (error == 'FirebaseError: Firebase: Error (auth/invalid-email).' || error == 'FirebaseError: Firebase: Error (auth/wrong-password).') {
          return Alert.alert(
            "Encontramos um problema...",
            "E-mail ou senha inválidos.",
            [
              {
                text: "OK",

              },
            ]
          );
        }
        console.log(error);
      });
  };


  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');

        const uid = user.uid;        
      } else {
        // ...
      }
    });

    
  }, []);

  return (
    <View style={styles.container}>
      

      <View style={styles.pad}>

        <Image
          style={styles.logo}
          source={require('../../../assets/pet-data-imagens/logo.png')}
        />

        <Text>Seja bem-vindo!</Text>
        <TextInput
          style={styles.inputEmail}
          placeholder="E-mail"
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          value={email}

        />
        <TextInput
          style={styles.inputPassword}
          placeholder="Senha"
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
        />
        <Stack>
          <Button
            style={styles.loginButton}
            title="Entrar"
            onPress={() => { onLoginPress() }}
            disabled={error}

          />
        </Stack>

        <Text>Não possui uma conta?</Text>
        <Text>Crie uma <Text style={styles.loginLink} onPress={() => navigation.navigate('Register')}>aqui</Text>.</Text>

        <View style={{ marginTop: 20 }}>
        <PasswordReset/>
        </View>

      </View>
    </View>    
  );
}