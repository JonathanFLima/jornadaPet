import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Button } from "@react-native-material/core";
import { IconButton, Card, RadioButton } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { collection, doc, deleteDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import styles from './style';

export default function VaccinesPage({ navigation, route }) {
  const PetInfo = route.params.petInfo;
  const { petPhoto } = route.params;

  const [vaccines, setVaccines] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [toggleType, setToggleType] = useState(false);
  const [checked, setChecked] = useState('first');
  const [checkedType, setCheckedType] = useState('first');
  const [expandedIds, setExpandedIds] = React.useState([]);

  // Filtra os registros por id, permitindo que cada card seja expandido, independente do outro.
  const handlePress = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((i) => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  // Janela de confirmação para deletar registro de vacina.
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Excluir vacina cadastrada",
      "Deseja mesmo excluir a vacina cadastrada?",
      [
        // The "Yes" button
        {
          text: "SIM",
          onPress: () => deleteVaccine(id)
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "NÃO",
        },
      ]
    );
  };

  // Traz informações sobre as vacinas existentes
  useEffect(() => {
    const q = query(collection(db, 'vaccines'), where("petId", "==", PetInfo.id), orderBy(toggleType ? 'created' : 'applicationDate', toggle ? 'asc' : 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vaccinesData = [];
      querySnapshot.forEach((doc) => {
        vaccinesData.push({ ...doc.data(), id: doc.id });
      });
      setVaccines(vaccinesData);
    });

    return () => unsubscribe();
  }, [toggleType, toggle]);

  //Excluir vacina
  const deleteVaccine = async (id) => {
    await deleteDoc(doc(db, 'vaccines', id));
  };


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Button onPress={() => navigation.navigate('Adicionar nova vacina', { petInfo: PetInfo, petPhoto: petPhoto })} title='Adicionar nova vacina' />
      </View>

      {vaccines.length == 0 ? <View></View> :
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, alignItems: 'center', marginTop: 15 }}>

            <RadioButton
              value="first"
              status={checkedType === 'first' ? 'checked' : 'unchecked'}
              onPress={() => { setCheckedType('first'), setToggleType(false) }}
            />
            <Text style={{ fontSize: 12 }}>Pela data do registro</Text>

            <RadioButton
              value='second'
              status={checkedType === 'second' ? 'checked' : 'unchecked'}
              onPress={() => { setCheckedType('second'), setToggleType(true) }}
            />
            <Text style={{ fontSize: 12 }}>Pela data da aplicação</Text>

          </View>

          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, alignItems: 'center', }}>

            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => { setChecked('first'), setToggle(false)}}
            />
            <Text style={{ fontSize: 12 }}>Mais recentes</Text>

            <RadioButton
              value='second'
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => { setChecked('second'), setToggle(true) }}
            />
            <Text style={{ fontSize: 12 }}>Mais antigos</Text>

          </View>
        </View>
      }

      <View style={styles.vaccinesView}>
        <View>
          {vaccines.length == 0 ? <View style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }}><Text>Nenhuma vacina adicionada ainda.</Text></View> :
            <FlatList
              data={vaccines}
              renderItem={({ item }) => (
                <View style={{ padding: 7 }}>

                  <Card>
                    <Card.Title
                      titleVariant='titleLarge' titleStyle={{ fontWeight: 'bold' }} title={item.vaccine} subtitleVariant='bodySmall' subtitle={`Adicionado em ${item.created.toDate().toLocaleDateString()}`}
                      right={(props) => <IconButton {...props} icon={expandedIds.includes(item.id) ? 'chevron-up' : 'chevron-down'} onPress={() => handlePress(item.id)} />}
                    />
                    {expandedIds.includes(item.id) && (
                      <Card.Content>

                        <Text style={{ fontWeight: 'bold' }}>Dose: <Text style={{ fontWeight: 'normal' }}>{item.dose}</Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>Data de aplicação: <Text style={{ fontWeight: 'normal' }}>{item.applicationDate.toDate().toLocaleDateString()}</Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>Data da reaplicação: <Text style={{ fontWeight: 'normal' }}>{item.reApplicationDate === null ? 'Não informada.' : item.reApplicationDate.toDate().toLocaleDateString()} </Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>Médico veterinário atuante: <Text style={{ fontWeight: 'normal' }}>{item.vetName === '' ? 'Não informado.' : item.vetName}</Text></Text>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                          <IconButton icon='file-edit' style={{ alignSelf: 'flex-end' }} accessibilityHint='Alterar informações sobre a vacina' onPress={() => navigation.navigate('Editar vacina', { petInfo: PetInfo, vaccineId: item.id })} />
                          <IconButton icon="trash-can" style={{ alignSelf: 'flex-end' }} accessibilityHint='Excluir vacina' onPress={() => showConfirmDialog(item.id)} />
                        </View>
                      </Card.Content>
                    )}
                  </Card>

                </View>
              )}
              keyExtractor={(item) => item.id} />
          }
        </View>
      </View>
    </View>
  )
}
