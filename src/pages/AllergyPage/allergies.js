import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Button } from "@react-native-material/core";
import { IconButton, Card  } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { collection, doc, deleteDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import styles from './style';

export default function AllergyPage({ navigation, route }) {
  const PetInfo = route.params.petInfo;

  const [allergiesInfo, setAllergiesInfo] = useState([]);
  const [expandedIds, setExpandedIds] = React.useState([]);

  const handlePress = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((i) => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Excluir alergia cadastrada",
      "Deseja mesmo excluir a informação sobre a alergia cadastrada?",
      [
        {
          text: "SIM",
          onPress: () => deleteAllergy(id)
        },
        {
          text: "NÃO",
        },
      ]
    );
  };

  const deleteAllergy = async (id) => {
    await deleteDoc(doc(db, 'allergies', id));
  };

 
  useEffect(() => {
    const q = query(collection(db, 'allergies'), where("petId", "==", PetInfo.id), orderBy('created'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allergiesData = [];
      querySnapshot.forEach((doc) => {
        allergiesData.push({ ...doc.data(), id: doc.id });
      });
      setAllergiesInfo(allergiesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Button onPress={() => navigation.navigate('Nova alergia', { petInfo: PetInfo })} title='Adicionar novo registro' />
      </View>
      <View style={styles.vaccinesView}>
        <View>
        {allergiesInfo.length == 0 ? <View style={{ justifyContent: 'center', alignSelf: 'center', height: '100%'}}><Text>Nenhuma informação registrada ainda.</Text></View> :
          <FlatList
            data={allergiesInfo}
            renderItem={({ item }) => (
              
              <View style={{ padding: 7 }}>

                <Card>
                  <Card.Title
                    titleVariant='titleLarge' titleStyle={{ fontWeight: 'bold' }} title={item.allergy}
                    right={(props) => <IconButton {...props} icon={expandedIds.includes(item.id) ? 'chevron-up' : 'chevron-down'} onPress={() => handlePress(item.id)} />}
                  />
                  {expandedIds.includes(item.id) && (
                  <Card.Content>
                    <Text style={{ fontWeight: 'bold' }}>Cuidados: <Text style={{ fontWeight: 'normal' }}>{item.treatment}</Text></Text>
                    {item.medicine && <Text style={{ fontWeight: 'bold' }}>Remédios: <Text style={{ fontWeight: 'normal' }}>{item.medicine}</Text></Text>}
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                      <IconButton icon='file-edit' style={{ alignSelf: 'flex-end' }} accessibilityHint='Alterar informações sobre a alergia' onPress={() => navigation.navigate('Alterar alergia', { petInfo: PetInfo, allergyId: item.id })} />
                      <IconButton icon="trash-can" style={{ alignSelf: 'flex-end' }} accessibilityHint='Excluir informação sobre alergia registrada' onPress={() => showConfirmDialog(item.id)} />
                      </View>
                    </View>
                  </Card.Content>
                  )}
                </Card>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />  }
        </View>

      </View>
    </View>
  )
}
