import React, { useState } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput} from 'react-native';
import {  Button } from "@react-native-material/core";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../config/firebaseConfig';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const PasswordReset = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

const passReset = () => sendPasswordResetEmail(auth, email)
  .then(() => {
    Alert.alert(
        "Redefinição de senha",
        "Um e-mail foi enviado para sua caixa de mensagens.\n\nCaso não encontre, procure na pasta de spams.",
        [
          {
            text: "OK",
            onPress: () => { setModalVisible(!modalVisible), setEmail(''); }
          },
        ]
      );  
  })
  .catch((error) => {
    const errorMessage = error.message;

    if (errorMessage == 'Firebase: Error (auth/missing-email).') {
        return Alert.alert(
          "Encontramos um problema...",
          "O campo não pode estar vazio.",
          [
            {
              text: "OK",

            },
          ]
        );
      }

    if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
        return Alert.alert(
          "Encontramos um problema...",
          "O e-mail inserido é inválido.",
          [
            {
              text: "OK",

            },
          ]
        );
      }

      if (errorMessage == 'Firebase: Error (auth/user-not-found).') {
        return Alert.alert(
          "Encontramos um problema...",
          "O e-mail informado não exista na nossa base de dados.",
          [
            {
              text: "OK",

            },
          ]
        );
      }
  });

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEmail('');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={{ alignSelf: 'flex-end', width: 25, }} onPress={() => {setModalVisible(!modalVisible), setEmail('')}}>
            <Text style={styles.buttonClose}>X</Text>
            </Pressable>
            <Text style={styles.modalText}>Insira seu e-mail:</Text>
            <TextInput 
            keyboardType='email-address'
            style={styles.inputEmail}
            onChangeText={(text) => setEmail(text)}
            value={email}/>

            <Button style={{ marginTop: 20 }} title='ENVIAR' onPress={() => passReset()}/>
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={() => setModalVisible(true)}>
        <Text style={styles.loginLink}>Esqueceu a senha?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 0,
    top: 300,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    fontSize: 20,
    marginBottom: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
  },
  loginLink: {
    color: '#1877F2',
    alignSelf: 'center',
    bottom: 300
  },
  inputEmail: {
    width: 250,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,

    paddingLeft: 5
  },
});

export default PasswordReset;