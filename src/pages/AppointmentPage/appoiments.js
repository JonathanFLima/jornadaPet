import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, } from 'react-native';
import { Button } from "@react-native-material/core";
import { IconButton, Card, RadioButton } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { collection, doc, deleteDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import styles from './styles';

export default function AppointmentPage({ route, navigation }) {
  const PetInfo = route.params.petInfo;
  const [appointments, setAppointments] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [checked, setChecked] = useState('first');

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
      "Excluir registro",
      "Deseja mesmo excluir o registro?",
      [
        // The "Yes" button
        {
          text: "SIM",
          onPress: () => deleteNote(id)
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "NÃO",
        },
      ]
    );
  };


  useEffect(() => {
    const q = query(collection(db, 'appointments'), where("petId", "==", PetInfo.id), orderBy("created", toggle ? 'asc' : 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id });
      });
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, [toggle]);

  //Excluir nota
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, 'appointments', id));
  };

  return (
    <View style={styles.container}>
      <View>
        <Button style={styles.button} title="Adicionar novo registro" onPress={() => navigation.navigate('Novo registro', { petInfo: PetInfo })} />
      </View>

      {appointments.length == 0 ? <View></View> :
        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 25, alignItems: 'center', marginTop: 15 }}>

          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('first'), setToggle(false) }}
          />
          <Text>Mais recentes</Text>

          <RadioButton
            value='second'
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('second'), setToggle(true) }}
          />
          <Text>Mais antigos</Text>
        </View>}

      <View style={styles.commentView}>
        <View>
          {appointments.length == 0 ? <View style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }}><Text>Nenhuma informação registrada ainda.</Text></View> :
            <FlatList
              data={appointments}
              renderItem={({ item }) => (
                <View style={{ padding: 7 }}>

                  <Card>
                    <Card.Title
                      titleVariant='titleLarge' titleStyle={{ fontWeight: 'bold' }} title={item.motive} subtitleVariant='bodySmall' subtitle={`Adicionado em ${item.created.toDate().toLocaleDateString()}`}
                      right={(props) => <IconButton {...props} icon={expandedIds.includes(item.id) ? 'chevron-up' : 'chevron-down'} onPress={() => handlePress(item.id)} />}
                    />
                    {expandedIds.includes(item.id) && (
                      <Card.Content>
                        <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Médico(a) veterinário(a) responsável:</Text>
                        <Text style={{ fontWeight: 'normal' }}>{item.vetName}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold' }}>Clínica/Posto: <Text style={{ fontWeight: 'normal' }}>{item.clinicName}</Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>Data: <Text style={{ fontWeight: 'normal' }}>{item.appointmentDate.toDate().toLocaleDateString()}</Text></Text>
                        

                        {item.clinicAdress &&
                          <View>
                            <Text style={{ fontWeight: 'bold' }}>Endereço: <Text style={{ fontWeight: 'normal' }}>{item.clinicAdress}</Text></Text>
                          </View>
                        }
                        {item.comment &&
                          <View>
                            
                            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Resumo da consulta:</Text>
                            <Text>{item.comment ? item.comment : ''}</Text>
                          </View>
                        }

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                          <IconButton icon='file-edit' style={{ alignSelf: 'flex-end' }} accessibilityHint='Alterar informações sobre a consulta' onPress={() => navigation.navigate('Editar registro', { petInfo: PetInfo, appointmentId: item.id })} />
                          <IconButton icon="trash-can" style={{ alignSelf: 'flex-end' }} accessibilityHint='Excluir consulta' onPress={() => showConfirmDialog(item.id)} />
                        </View>
                      </Card.Content>
                    )}
                  </Card>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />}
        </View>
      </View>
    </View>
  )
}
