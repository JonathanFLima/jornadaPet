import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, Linking } from 'react-native';
import { Button } from "@react-native-material/core";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../config/firebaseConfig';
import styles from './style';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(true);
  const [randomImage, setRandomImage] = useState();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const imageUrlCat = 'https://www.flaticon.com/free-icons/cat'
  const imageUrlDog = 'https://www.flaticon.com/free-icons/dog'
  
  useEffect(() => {
    const images = [
    require('../../../assets/pet-data-imagens/dog.png'),
    require('../../../assets/pet-data-imagens/cat.png'),
    ];
   
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
   }, []);
   
  useEffect(() => {
    if (name, email, password) {
      setError(false);
    } else {
      setError(true);
    }
  }, [name, email, password])
  
  const onRegisterPress = () => {

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('Conta criada com sucesso.');

        const user = userCredential.user;

        const usersRef = await addDoc(collection(db, 'users'), {
          userId: user.uid,
          userName: name,
          userEmail: email,
        });

        
        await navigation.navigate('Login');

      })
      .catch(error => {

        if (error == 'FirebaseError: Firebase: Error (auth/invalid-email).') {
          return Alert.alert(
            "Encontramos um problema...",
            "E-mail inválido.",
            [
              {
                text: "OK",

              },
            ]
          );
        }

        if (error == 'FirebaseError: Firebase: Error (auth/email-already-in-use).') {
          return Alert.alert(
            "Encontramos um problema...",
            "E-mail já cadastrado.",
            [
              {
                text: "OK",

              },
            ]
          );
        }
        

        if (error == 'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).') {
          return Alert.alert(
            "Encontramos um problema...",
            "A senha deve ter no mínimo 6 caracteres.",
            [
              {
                text: "OK",

              },
            ]
          );
        }
        console.log(error);
      })


      
  };

  return (
    <View style={styles.container}>
      <View style={styles.pad}>

      <View style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', height: '35%' }}>
        <Image
          style={{height: 150, width: 150, marginBottom: 2}}
          source={randomImage}
        />
        <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 8 }}>Créditos pela imagem: </Text><Text style={{ color: '#0000EE', fontSize: 8 }} onPress={() => Linking.openURL(randomImage == 5 ? imageUrlDog : imageUrlCat)}>Freepik - Flaticon</Text></View>
        </View>

        

        <TextInput
          style={styles.inputName}
          placeholder="Apelido"
          onChangeText={(name) => setName(name)}
          maxLength={15}
          value={name}
        />
        <TextInput
          style={styles.inputEmail}
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={(email) => setEmail(email)}
          value={email}
        />
        <TextInput
          style={styles.inputPassword}
          placeholder="Senha"
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
        />
        <Button style={styles.registerButton} disabled={error} title="Registrar" onPress={() => onRegisterPress()} />

        <Text>Já possui uma conta?</Text>
        <Text style={styles.registerLink} onPress={() => { navigation.navigate('Login') }}>Faça login.</Text>
      </View>
    </View>
  );
}
