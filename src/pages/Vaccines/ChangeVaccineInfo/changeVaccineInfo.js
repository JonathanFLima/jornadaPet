import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@react-native-material/core";
import { IconButton, TextInput } from 'react-native-paper';
import { auth, db } from '../../../config/firebaseConfig';
import { collection, doc, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { SelectList } from 'react-native-dropdown-select-list';
import { DatePickerModal } from 'react-native-paper-dates';
import styles from './style';


export default function ChangeVaccineInfo({ navigation, route }) {
  const PetInfo = route.params.petInfo;
  const VaccineInfo = route.params.vaccineId;
  const PetPhoto = route.params.petPhoto;

  const [vaccines, setVaccines] = useState([]);
  const [vaccine, setVaccine] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [selectedDose, setSelectedDose] = useState('');

  const [vacDate, setVacDate] = useState(new Date());
  const [reVacDate, setReVacDate] = useState(new Date());
  const [openVac, setOpenVac] = useState(false);
  const [openReVac, setOpenReVac] = useState(false);
  const [vetName, setVetName] = useState('');

  const [vacError, setVacError] = useState(false);
  const [otherVac, setOtherVac] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);


  // Em caso do usuário cancelar a escolha da data de aplicação
  const onDismissSingleVac = React.useCallback(() => {
    setOpenVac(false);
  }, [setOpenVac]);

  // Em caso do usuário cancelar a escolha da data de reaplicação
  const onDismissSingleReVac = React.useCallback(() => {
    setOpenReVac(false);
  }, [setOpenReVac]);

  // Em caso do usuário escolher a data da aplicação
  const onConfirmSingleVac = React.useCallback(
    (params) => {
      setOpenVac(false);
      setVacDate(params.date);
    },
    [setOpenVac, setVacDate]
  );

  // Em caso do usuário escolher a data da reaplicação
  const onConfirmSingleReVac = React.useCallback(
    (params) => {
      setOpenReVac(false);
      setReVacDate(params.date);
    },
    [setOpenReVac, setReVacDate]
  );

  // Lista de vacinas para cachorros
  const dataVaccinesDog = [
    { key: '1', value: 'Polivalente' },
    { key: '2', value: 'Raiva' },
    { key: '3', value: 'Tosse Canis' },
    { key: '4', value: 'Giardíase' },
    { key: '5', value: 'Leishmania' },
    { key: '6', value: 'Outra' },
  ]

  // Lista de vacinas para gatos
  const dataVaccinesCat = [
    { key: '1', value: 'Polivalente (V3)' },
    { key: '2', value: 'Polivalente (V4)' },
    { key: '3', value: 'Polivalente (V5)' },
    { key: '4', value: 'Raiva' },
    { key: '5', value: 'Outra' },
  ]

  // Quantidade de doses
  const dataDoses = [
    { key: '1', value: '1ª dose' },
    { key: '2', value: '2ª dose' },
    { key: '3', value: '3ª dose' },
    { key: '4', value: 'Anual' },
  ]

  useEffect(() => {
    const q = query(collection(db, 'vaccines'), where("vaccineId", "==", VaccineInfo));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vaccinesData = [];
      querySnapshot.forEach((doc) => {
        vaccinesData.push({ ...doc.data(), id: doc.id });
      });

      vaccinesData.map((q) => {
        setVaccine(q.vaccine);
        setSelectedVaccine(q.vaccine);
        setSelectedDose(q.dose);
        setVacDate(new Date(q.applicationDate.toDate()));
        setReVacDate(new Date(q.reApplicationDate.toDate()));
        setVetName(q.vetName);      
      })
      console.log(vaccine)
});
    return () => unsubscribe();

  }, []);

  // Editar informação da consulta
  const updateVaccineInfo = async () => {
    const user = auth.currentUser.uid;

    if (!user) {
      throw new Error('Usuário não logado');
    }

    const docRefUpdate = doc(db, 'vaccines', VaccineInfo);

    const docRef = await updateDoc(docRefUpdate, {
        vaccine: selectedVaccine,
        dose: selectedDose,
        applicationDate: vacDate,
        reApplicationDate: reVacDate,
        vetName: vetName,
    });    
  }

  useEffect(() => {

    if (selectedVaccine === 'Outra') {
      if (selectedVaccine && selectedDose && vacDate && otherVac) {
        setError(true)
      }
      else { setError(false) }
    } else {

      if (selectedVaccine && selectedDose && vacDate) {
        setError(true)
      }
      else { setError(false) }

    }
  }, [selectedVaccine, selectedDose, vacDate, otherVac]);

  const handleValueChange = () => {
    setSelectedValue(selectedVaccine);

    console.log(selectedVaccine)
    selectedVaccine === 'Outra' ? setShowTextInput(true) : setShowTextInput(false);
    selectedVaccine === 'Outra' ? setError(false) :

      console.log(showTextInput);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
      <Text style={{ marginLeft: 5 }}>Selecione a vacina desejada:</Text>
        <SelectList
          boxStyles={{ marginTop: 5, backgroundColor: '#FFF', borderColor: '#DDDBDA', borderRadius: 5 }}
          setSelected={(value) => setSelectedVaccine(value)}
          data={PetInfo.petSpecies === 'cat' ? dataVaccinesCat : dataVaccinesDog}
          save="value"
          onSelect={() => handleValueChange()}
          placeholder="Selecione a vacina desejada"
          defaultOption={{ key: `${vaccine}`, value: vaccine }}
          search={false}
          maxHeight={300}
        />

        {showTextInput && (
          <TextInput
            mode='outlined'
            outlineColor='#DDDBDA'
            placeholder='Informe o nome da vacina aplicada'
            placeholderTextColor={'#BCBCBC'}
            autoFocus={show}
            style={styles.input}
            value={otherVac}
            onChangeText={(value) => { setSelectedVaccine(value), setOtherVac(value) }}
          />
        )}

        <Text style={{ marginLeft: 5, marginTop: 10 }}>Selecione a dosagem da vacina:</Text>
        <SelectList
          boxStyles={{ marginTop: 5, backgroundColor: '#FFF', borderColor: '#DDDBDA', borderRadius: 5 }}
          setSelected={(valor) => setSelectedDose(valor)}
          data={dataDoses}
          save="value"
          placeholder="Qual é a dose da vacina?"
          defaultOption={{ key: `${selectedDose}`, value: selectedDose }}
          search={false}
        />

        <View style={styles.birthInput}>
        <Text style={{ marginLeft: 5, marginTop: 10 }}>Data de aplicação da vacina:</Text>
          <View style={styles.inputContainer}>

            <View>
              <IconButton icon="calendar" size={25} onPress={() => setOpenVac(true)} />
            </View>


            <TextInput
              mode='outlined'
              textColor='#414141'
              outlineColor='#DDDBDA'
              placeholder='Data da aplicação da vacina'
              style={styles.dateInput}
              onChangeText={(vacDate) => { setVacDate(vacDate) }}
              disabled={true}
              value={vacDate.toLocaleDateString('pt-BR')}
              onBlur={() => { vacDate === '' ? setVacError(true) : setVacError(false) }}
            />

            <SafeAreaProvider>
              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={openVac}
                onDismiss={onDismissSingleVac}
                date={vacDate}
                validRange={{ startDate: new Date('2000-01-02'), endDate: new Date() }}
                onConfirm={onConfirmSingleVac}
              />
            </SafeAreaProvider>
          </View>


          <Text style={{ marginLeft: 5, marginTop: 10 }}>Data de reaplicação da vacina (opcional):</Text>
          <View style={styles.inputContainer}>



            <View>
              <IconButton icon="calendar" size={25} onPress={() => setOpenReVac(true)} />
            </View>



            <TextInput
              mode='outlined'
              textColor='#414141'
              outlineColor='#DDDBDA'
              placeholder='Data da reaplicação da vacina'
              style={styles.dateInput}
              onChangeText={(reVacDate) => { setReVacDate(reVacDate) }}
              value={reVacDate.toLocaleDateString('pt-BR')}
              disabled={true}
            />

            <SafeAreaProvider>
              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={openReVac}
                onDismiss={onDismissSingleReVac}
                date={reVacDate}
                validRange={{ startDate: new Date('2000-01-02') }}
                onConfirm={onConfirmSingleReVac}
              />
            </SafeAreaProvider>



          </View>
          <Text style={{ marginLeft: 5, marginTop: 10 }}>Médico(a) veterinário(a) que aplicou a vacina:</Text>
          <TextInput
            mode='outlined'
            outlineColor='#DDDBDA'
            placeholder='Nome do veterinário que aplicou a vacina'
            placeholderTextColor={'#BCBCBC'}
            style={styles.input}
            onChangeText={(text) => setVetName(text)}
            value={vetName}
          />
        </View>




      </View>
      <View style={{ marginTop: 10, height: 45 }}>
        <Button disabled={!error} title="Alterar informação" onPress={() => { updateVaccineInfo(), navigation.navigate('Vacinas', { petInfo: PetInfo, petPhoto: PetPhoto }) }} />
      </View>



    </View>
  )
}