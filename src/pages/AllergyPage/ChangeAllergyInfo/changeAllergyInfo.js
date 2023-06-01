import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from "@react-native-material/core";
import { auth, db } from '../../../config/firebaseConfig';
import styles from './style';
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { TextInput } from 'react-native-paper';


export default function ChangeAllergyInfo({ navigation, route }) {
const PetInfo = route.params.petInfo;
const AllergyInfo = route.params.allergyId;

  const [allergies, setAllergies] = useState([]);
  const [allergy, setAllergy] = useState('');
  const [allergyTreatment, setAllergyTreatment] = useState('');
  const [allergyMedicine, setAllergyMedicine] = useState('');
  const [error, setError] = useState(false);
  
  // Garante que o botão 'ADICIONAR INFORMAÇÃO' só fique acessível quando todos os campos forem devidamente preenchidos.
  useEffect(() => {
    if (allergy && allergyTreatment) {
      setError(true)
    }
    else { setError(false) }

  }, [allergy, allergyTreatment]);

  
  // Função que pega as informações inseridas e salva no Firebase.
  const updateAllergyInfo = async () => {
    const user = auth.currentUser.uid;

    if (!user) {
      throw new Error('Usuário não logado');
    }

    const docRefUpdate = doc(db, 'allergies', AllergyInfo);

    const docRef = await updateDoc(docRefUpdate, {
      allergy: allergy,
      treatment: allergyTreatment,
      medicine: allergyMedicine,
    });

    navigation.navigate('Alergias/Cuidados', { petInfo: PetInfo })
  }


    useEffect(() => {
      const q = query(collection(db, 'allergies'), where("allergyId", "==", AllergyInfo));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allergiesData = [];
        querySnapshot.forEach((doc) => {
          allergiesData.push({ ...doc.data(), id: doc.id });
        });
        
        allergiesData.map((q) => {
              setAllergies(q);
              setAllergy(q.allergy);
              setAllergyTreatment(q.treatment);
              setAllergyMedicine(q.medicine);
            })
      });

      return () => unsubscribe();
    }, []);
  


  return (
    <ScrollView
      style={styles.container}>
      <View>
        <View style={styles.inputContainer}>

      <Text>Tipo de alergia:</Text>
        <TextInput
              mode='outlined'
              outlineColor={'#DDDBDA'}
              placeholder={'Informe o tipo de alergia'}
              placeholderTextColor={'#BCBCBC'}
              style={styles.input}
              onChangeText={(text) => setAllergy(text)}
              value={allergy}
            />
          <View>

          <Text style={{ marginLeft: 5, marginTop: 10 }}>Cuidados a serem tomados:</Text>
            <TextInput
              mode='outlined'
              outlineColor={'#DDDBDA'}
              placeholder={'Descreva cuidados a se tomar referente a esta alergia'}
              placeholderTextColor={'#BCBCBC'}
              numberOfLines={5}
              maxLength={500}
              multiline={true}
              style={styles.textAreaInput}
              onChangeText={(text) => setAllergyTreatment(text)}
              value={allergyTreatment}
            />
          </View>

          <Text style={{ marginLeft: 5, marginTop: 10 }}>Medicamentos:</Text>
          <TextInput
              mode='outlined'
              outlineColor={'#DDDBDA'}
              placeholder={'É necessário tomar medicamentos?\nAnote sobre aqui (opcional).'}
              placeholderTextColor={'#BCBCBC'}
              numberOfLines={5}
              maxLength={500}
              multiline={true}
              style={styles.textAreaInput}
              onChangeText={(text) => setAllergyMedicine(text)}
              value={allergyMedicine}
            />    
        </View>
      </View>
      <View style={styles.buttonContainer}>       
        <Button disabled={!error} title="Alterar informação" onPress={() => { updateAllergyInfo() }} />
      </View>
    </ScrollView>

  );
}
