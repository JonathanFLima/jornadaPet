import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView} from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@react-native-material/core";
import { IconButton, TextInput } from 'react-native-paper';
import { auth, db } from '../../../config/firebaseConfig';
import { collection, doc, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { SelectList } from 'react-native-dropdown-select-list';
import { DatePickerModal } from 'react-native-paper-dates';
import styles from './style';


export default function AddAppointmentPage({ navigation, route }) {
  const PetInfo = route.params.petInfo;
  const AppointmentInfo = route.params.appointmentId;

  const [appointments, setAppointments] = useState([]);
  const [clinicName, setClinicName] = useState('');
  const [clinicAdress, setClinicAdress] = useState('');
  const [vetName, setVetName] = useState('');
  const [motive, setMotive] = useState('');
  const [otherMotive, setOtherMotive] = useState('');
  const [comment, setComment] = useState('');

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [showTextInput, setShowTextInput] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);


  // Em caso do usuário cancelar a escolha da data da consulta
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);


  // Em caso do usuário escolher a data da consulta
  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  // Lista com possíveis motivos para levar o pet em uma consulta
  const dataMotives = [
    { key: '1', value: 'Consulta geral' },
    { key: '2', value: 'Exames' },
    { key: '3', value: 'Operação' },
    { key: '4', value: 'Reavaliação' },
    { key: '5', value: 'Outro' },
  ]

  

  useEffect(() => {
    const q = query(collection(db, 'appointments'), where("appointmentId", "==", AppointmentInfo));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id });
      });

      appointmentsData.map((q) => {
        setAppointments(q);
        setClinicName(q.clinicName);
        setVetName(q.vetName);
        setClinicAdress(q.clinicAdress);
        setMotive(q.motive);
        setDate(new Date(q.appointmentDate.toDate()));
        setComment(q.comment);

        if (otherMotive) { setOtherMotive(q.otherMotive), showTextInput(true); }
        
        
      })
});
    return () => unsubscribe();

  }, []);

  // Editar informação da consulta
  const updateAppointmentInfo = async () => {
    const user = auth.currentUser.uid;

    if (!user) {
      throw new Error('Usuário não logado');
    }

    const docRefUpdate = doc(db, 'appointments', AppointmentInfo);

    const docRef = await updateDoc(docRefUpdate, {
        clinicName: clinicName,
        clinicAdress: clinicAdress,
        vetName: vetName,
        motive: otherMotive ? otherMotive : motive,
        otherMotive: otherMotive,
        comment: comment,
        appointmentDate: date,
    });    
  }

  // Garante que o botão só fique ativo quando os campos obrigatórios estiverem preenchidos
  useEffect(() => {

    if (motive !== 'Outro') {
      setOtherMotive('')
    }

    if (motive === 'Outro') {
      if (clinicName && vetName && date && otherMotive) {
        setError(true)
      }
      else { setError(false) }
    } else {

      if (clinicName && vetName && motive && date) {
        setError(true)
      }
      else { setError(false) }

    }
  }, [clinicName, vetName, date, motive, otherMotive]);

  // Adicionar um campo caso o motivo da consulta seja 'Outro'
  const handleValueChange = () => {
    setMotive(motive);

    
    motive === 'Outro' ? (setShowTextInput(true), setShow(true)) : setShowTextInput(false);

    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={{ marginLeft: 5 }}>Nome da clínica ou posto:</Text>
        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Informe o nome da clínica ou posto'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          value={clinicName}
          onChangeText={(value) => { setClinicName(value), setOtherMotive(value) }}
        />

        <Text style={{ marginLeft: 5, marginTop: 10 }}>Médico veterinário responsável pela consulta:</Text>
        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Nome do veterinário responsável'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          onChangeText={(text) => setVetName(text)}
          value={vetName}
        />

        <Text style={{ marginLeft: 5, marginTop: 10 }}>Endereço da clínica (opcional):</Text>
        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Endereço da clínica (opcional)'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          value={clinicAdress}
          onChangeText={(value) => { setClinicAdress(value) }}
        />

        <Text style={{ marginLeft: 5, marginTop: 10 }}>Motivo da consulta:</Text>
        <SelectList
          boxStyles={{ marginTop: 5, backgroundColor: '#FFF', borderColor: '#DDDBDA', borderRadius: 5, height: 45 }}
          setSelected={(value) => setMotive(value)}
          data={dataMotives}
          save="value"
          onSelect={() => handleValueChange()}
          placeholder="Selecione o motivo da consulta"
          search={false}
          defaultOption={{ key: `${motive}`, value: motive }}
          maxHeight={300}
        />

        {showTextInput && (
          <TextInput
            mode='outlined'
            outlineColor='#DDDBDA'
            placeholder='Informe o motivo da consulta'
            placeholderTextColor={'#BCBCBC'}
            style={styles.input}
            value={otherMotive}
            onChangeText={(value) => { setOtherMotive(value) }}
          />
        )}



        <View style={styles.birthInput}>
          <Text style={{ marginLeft: 5, marginTop: 10 }}>Data da ida à consulta:</Text>
          <View style={styles.inputContainer}>
            <View>
              <IconButton icon="calendar" size={25} onPress={() => setOpen(true)} />
            </View>

            
            <TextInput
              mode='outlined'
              textColor='#414141'
              outlineColor='#DDDBDA'
              placeholder='Data da ida a consulta'
              style={styles.dateInput}
              onChangeText={(date) => { setDate(date) }}
              disabled={true}
              value={date.toLocaleDateString('pt-BR')}
            />

            <SafeAreaProvider>
              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                date={date}
                validRange={{ startDate: new Date('2000-01-02'), endDate: new Date() }}
                onConfirm={onConfirmSingle}
              />
            </SafeAreaProvider>
          </View>





          <View>
          <Text style={{ marginLeft: 5, marginTop: 10 }}>Observações:</Text>
            <TextInput mode='outlined'
              outlineColor='#DDDBDA'
              multiline={true}
              numberOfLines={5}
              maxLength={500}
              placeholder='Escreva brevemente sobre a consulta (opcional)'
              placeholderTextColor={'#BCBCBC'}
              style={styles.textAreaInput}
              value={comment}
              onChangeText={(value) => setComment(value)} />
          </View>

        </View>




      </View>
      <View style={{ marginTop: 10, height: 45 }}>
        <Button disabled={!error} title="Alterar registro" onPress={() => { updateAppointmentInfo(), navigation.navigate('Consultas', { petInfo: PetInfo }) }} />
      </View>



    </ScrollView>
  )
}