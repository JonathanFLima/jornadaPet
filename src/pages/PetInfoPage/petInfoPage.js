import React, { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Button } from "@react-native-material/core";
import { Card } from 'react-native-paper';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import styles from './style';

export default function VaccinesPage({ navigation, route }) {
  const user = auth.currentUser.uid;
  const PetInfo = route.params.petInfo;
  const { petPhoto } = route.params;
  const imageUrl = 'https://www.freepik.com/free-vector/seamless-animal-pattern-background-cute-paw-print-vector-illustration_20266394.htm#query=dog%20paws&position=14&from_view=keyword&track=robertav1_2_sidr';

  const [vaccines, setVaccines] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [selectedDose, setSelectedDose] = useState('');

  const [vacDate, setVacDate] = useState(new Date());
  const [reVacDate, setReVacDate] = useState(new Date());


  useEffect(() => {
    const q = query(collection(db, 'pets'), where("petId", "==", PetInfo.petId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ ...doc.data(), id: doc.id });
      });
      setPets(petsData);
      
    });
    
    return () => unsubscribe();
  }, []);


  return (
    <View style={styles.container}>
      <View>
        <View style={styles.petInfoWrapper}>

          <View style={{ width: '100%', marginLeft: 0, }}>

          {pets.map((pet) => 
          <Card style={{  backgroundColor: '#FFF' }} key={pet.petId}>
                  <Card.Cover resizeMode='stretch' source={petPhoto ? { uri: petPhoto } : require('../../../assets/pet-data-imagens/noImageBg.jpg')} />
                  {!petPhoto && <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 5 }}><Text style={{ fontSize: 8 }}>Créditos pela imagem: </Text><Text style={{ color: '#0000EE', fontSize: 8 }} onPress={() => Linking.openURL(imageUrl)}>Freepik</Text></View>}
                  <Card.Title titleVariant='titleLarge' titleStyle={{ fontWeight: 'bold', fontSize: 28 }} title={pet.petName} subtitleVariant='bodySmall' subtitle={`${pet.petAge} (${pet.petBirthday.toDate().toLocaleDateString()})`} />
                  <Card.Content>
                    <Text>{pet.petBreed}</Text>
                    <Text>{pet.petWeight}kg, {pet.petGender}</Text>
                    <Text>Porte: {pet.petSize}</Text>
                    <Text>Cor: {pet.petColor}</Text>
                  </Card.Content>
                </Card>
                )}
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Button onPress={() => navigation.navigate('Vacinas', { petInfo: PetInfo, petPhoto: petPhoto })} title='Histórico de vacinas'>
          </Button>
        </View>
        <View style={styles.deletePetButton}>
          <Button title="Histórico de alergias" onPress={() => navigation.navigate('Alergias/Cuidados', { petInfo: PetInfo })} />
        </View>
        <View style={styles.deletePetButton}>
          <Button title="Histórico de consultas" onPress={() => navigation.navigate('Consultas', { petInfo: PetInfo })} />
        </View>
        <View style={styles.deletePetButton}>
          <Button title="Alterar informações do pet" onPress={() => navigation.navigate('Alterar informações do pet', { petInfo: PetInfo, petPhoto: petPhoto })} />
        </View>
      </View>
    </View>
  )
}
