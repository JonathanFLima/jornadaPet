import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import { app, auth, db, storage } from '../../config/firebaseConfig';
import { getAuth, signOut } from "firebase/auth";
import { HStack, Avatar } from "@react-native-material/core";
import {  Button } from 'react-native-paper';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import styles from './style';



export default function PetProfilePage({ navigation }) {
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const user = auth.currentUser.uid;
  const [petId, setPetId] = useState([]);

  const [url, setUrl] = useState({});
  const imageUrl = "https://www.flaticon.com/free-icons/tumbleweed";


  const checkHowManyPets = () => {

    if (pets.length >= 9) {
      return Alert.alert(
        "Limite máximo atingido",
        "Você atingiu o limite máximo de perfis de pet no momento.",
        [
          {
            text: "OK",

          },
        ]
      );
    }

    navigation.navigate('Cadastre seu bichinho!');

  }

  useEffect(() => {
    const fetchPetUrls = async () => {
      const urls = {};
      for (const pet of pets) {
        const reference = ref(storage, `Photos/${user}/${pet.id}/`);
        try {
          const url = await getDownloadURL(reference);
          urls[pet.id] = url;
        } catch (error) {
          // Sem aviso de erro, fotos carregam normalmente.
        }
      }
      setUrl(urls);
    };
    fetchPetUrls();
  }, [user, pets])

  useEffect(() => {
    const q = query(collection(db, 'users'), where("userId", "==", user));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ ...doc.data(), id: doc.id });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'pets'), where("petOwner", "==", user));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ ...doc.data(), id: doc.id });
      });
      setPets(petsData);
    });

    return () => unsubscribe();
  }, []);

  // Página de informações do pet
  const handleSelectPet = (pet, url) => {
    navigation.navigate('PetInfoPage', { petInfo: pet, petPhoto: url });
  };

  const confirmLogOut = () => {
    return Alert.alert(
      'Sair da conta',
      'Você tem certeza que deseja sair da sua conta?',
      [
        {
          text: "SIM",
          onPress: () => logOut()
        },

        {
          text: 'NÃO'
        }
      ]
    );
  }

  const logOut = () => {
    const auth = getAuth(app);

    signOut(auth).then(() => {
        navigation.replace('Login');
      
      }).catch((error) => {
        
        Alert.alert(
          'Erro inesperado',
          'Algo aconteceu. Por favor, tente novamente em alguns instantes.',
          [
            {
              text: "OK",
            },
          ]
        );

    });
      
  }

  

  return (


    <View style={styles.container} >
      {users.map((user) => (     
        <View key={user.id} style={{ flexDirection: 'row' }}>
          <Text style={styles.heading}>Olá, {user.userName}!</Text>
          <View style={{ position:'absolute', top: 5, right: 0, flexDirection: 'row', alignItems: 'center' }}> 
          <Button icon='logout' textColor='red' accessibilityHint='Efetuar log'  onPress={() => confirmLogOut()} />
          <Text style={{ position: 'absolute', right: 50, color: 'red' }} onPress={() => confirmLogOut()}>SAIR</Text>
          </View>
        </View>
      ))}
      <Text style={{ marginLeft: 10, marginBottom: 30 }}>Escolha seu pet ou crie um novo perfil.</Text>
      {pets.length == 0 ? 
      <View style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', height: '60%' }}>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}><Text style={{ fontSize: 8 }}>Créditos pela imagem: </Text><Text style={{ color: '#0000EE', fontSize: 8 }} onPress={() => Linking.openURL(imageUrl)}>Freepik - Flaticon</Text></View>
        <Image source={require('../../../assets/pet-data-imagens/tumbleweed.png')} style={{ height: 150, width: 150 }} />
        <Text>Um pouco vazio, não acha?</Text>
        <Text>Adicione um novo pet!</Text>
        </View> 
        :
         <View style={styles.petProfiles}>
        {pets.map((pet) => (


          <View key={pet.id}>
            <HStack>
              <View style={styles.petInfo}>
                <TouchableOpacity onPress={() => handleSelectPet(pet, url[pet.id])}>

                  <Avatar label={pet.petName} autoColor size={90} image={{ uri: url[pet.id] }} />

                </TouchableOpacity>
                <Text>{pet.petName}</Text>
              </View>
            </HStack>
          </View>
        ))}
      </View>}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => checkHowManyPets()}
      >
        <Text style={styles.addNewPetText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}