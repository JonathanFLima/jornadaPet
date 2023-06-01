import React, { useState, useEffect } from 'react';
import { View, ScrollView} from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@react-native-material/core";
import { IconButton, TextInput } from 'react-native-paper';
import { db } from '../../../config/firebaseConfig';
import { collection, doc, addDoc, query, where, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { SelectList } from 'react-native-dropdown-select-list';
import { DatePickerModal } from 'react-native-paper-dates';
import styles from './style';


export default function AddAppointmentPage({ navigation, route }) {
  const PetInfo = route.params.petInfo;

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
    const q = query(collection(db, 'appointments'), where("petId", "==", PetInfo.id)/*, orderBy("created")*/);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id });
      });
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  // Adicionar nova vacina
  const addAppointment = async () => {
    const docRef = await addDoc(collection(db, 'appointments'), {
      petId: PetInfo.id,
      clinicName: clinicName,
      clinicAdress: clinicAdress,
      vetName: vetName,
      motive: motive,
      otherMotive: otherMotive,
      comment: comment,
      appointmentDate: date,
      created: Timestamp.fromDate(new Date()),
    });

    const docRefs = doc(db, 'appointments', docRef.id);
   

    const docRefUpdate = await updateDoc(docRefs, {
      appointmentId: docRef.id
    })

  }

  // Faz com que o campo de data mostre a propriedade placeholder
  useEffect(() => {
    setDate(null);
  }, []);

  // Garante que o botão só fique ativo quando os campos obrigatórios estiverem preenchidos
  useEffect(() => {

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
        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Informe o nome da clínica ou posto'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          value={clinicName}
          onChangeText={(value) => { setClinicName(value) }}
        />

        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Nome do médico veterinário responsável'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          onChangeText={(text) => setVetName(text)}
          value={vetName}
        />

        <TextInput
          mode='outlined'
          outlineColor='#DDDBDA'
          placeholder='Endereço da clínica (opcional)'
          placeholderTextColor={'#BCBCBC'}
          style={styles.input}
          value={clinicAdress}
          onChangeText={(value) => { setClinicAdress(value) }}
        />
        <SelectList
          boxStyles={{ marginTop: 5, backgroundColor: '#FFF', borderColor: '#DDDBDA', borderRadius: 5, height: 45 }}
          setSelected={(value) => setMotive(value)}
          data={dataMotives}
          save="value"
          onSelect={() => handleValueChange()}
          placeholder="Selecione o motivo da consulta"
          search={false}
          maxHeight={300}
        />

        {showTextInput && (
          <TextInput
            mode='outlined'
            outlineColor='#DDDBDA'
            placeholder='Informe o motivo da consulta'
            placeholderTextColor={'#BCBCBC'}
            autoFocus={show}
            style={styles.input}
            value={otherMotive}
            onChangeText={(value) => { setMotive(value), setOtherMotive(value) }}
          />
        )}



        <View style={styles.birthInput}>
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
              value={date ? date.toLocaleDateString('pt-BR') : ''}
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
        <Button disabled={!error} title="Adicionar registro" onPress={() => { addAppointment(), navigation.navigate('Consultas', { petInfo: PetInfo }) }} />
      </View>



    </ScrollView>
  )
}