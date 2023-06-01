import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from "@react-native-material/core";
import { auth, db } from '../../../config/firebaseConfig';
import styles from './style';
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { TextInput } from 'react-native-paper';


export default function AddNewAllergy({ navigation, route }) {
const PetInfo = route.params.petInfo;

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
  const addAllergyInfo = async () => {
    const user = auth.currentUser.uid;

    if (!user) {
      throw new Error('Usuário não logado');
    }

    const docRef = await addDoc(collection(db, 'allergies'), {
      petId: PetInfo.id,
      allergy: allergy,
      treatment: allergyTreatment,
      medicine: allergyMedicine,
      created: Timestamp.fromDate(new Date())
    });

    const docRefs = doc(db, 'allergies', docRef.id);
   

    const docRefUpdate = await updateDoc(docRefs, {
      allergyId: docRef.id
    })

    navigation.navigate('Alergias/Cuidados', { petInfo: PetInfo })
  }

  return (
    <ScrollView
      style={styles.container}>
      <View>
        <View style={styles.inputContainer}>

      <Text style={{textAlign: 'justify'}}>Existem diversos tipos de alergias e diferentes causas para que elas ocorram com seu bichinho. Sendo assim, é ideal que você confirme com seu médico veterinário o diagnóstico correto da alergia antes de preencher as informações nesta página.</Text>
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
        <Button disabled={!error} title="Adicionar informação" onPress={() => { addAllergyInfo() }} />
      </View>
    </ScrollView>

  );
}
