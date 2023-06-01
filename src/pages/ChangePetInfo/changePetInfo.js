import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, ScrollView } from 'react-native';
import { Button } from "@react-native-material/core";
import { auth, db, storage } from '../../config/firebaseConfig';
import styles from './style';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { RadioButton, TextInput, IconButton } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { pt, registerTranslation } from 'react-native-paper-dates';
registerTranslation('pt-BR', pt)


export default function ChangePetInfo({ navigation, route }) {

  const user = auth.currentUser.uid;
  const PetInfo = route.params.petInfo;
  const { petPhoto } = route.params;
  const [pets, setPets] = useState([]);

  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState(new Date(PetInfo.petBirthday.toDate()));
  const [open, setOpen] = useState(false);
  const [catOrDog, setCatOrDog] = useState('');
  const [petName, setPetName] = useState(PetInfo.petName);
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState(PetInfo.petWeight);
  const [petGender, setPetGender] = useState(PetInfo.petGender);
  const [petBreed, setPetBreed] = useState('');
  const [petSize, setPetSize] = useState('');
  const [petColor, setPetColor] = useState(PetInfo.petColor)
  const [image, setImage] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const [showBreeds, setShowBreeds] = useState(true);

  // Função para selecionar imagem da galeria.
  const pickImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

  };

  // Caso a seleção da data de nascimento seja cancelada.
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Função que define a data escolhida.
  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  // Garante que o botão 'ADICIONAR PET' só fique acessível quando todos os campos forem devidamente preenchidos.
  useEffect(() => {
    if (petName && petWeight && date && petGender && petColor && petHeight && petBreed) {
      setError(true)
    }
    else { setError(false) }

  }, [petName, petWeight, date, petGender, petColor, petHeight, petBreed]);


  // Lista de raças de cachorro.
  const dataDogList = [
    { key: '1', value: 'SRD - Sem raça definida' },
    { key: '2', value: 'Afghan Hound (Galgo Afegão)' },
    { key: '3', value: 'Akita Inu' },
    { key: '4', value: 'American Bully' },
    { key: '5', value: 'American Staffordshire Terrier' },
    { key: '6', value: 'Basenji' },
    { key: '7', value: 'Basset Hound' },
    { key: '8', value: 'Beagle' },
    { key: '9', value: 'Bernese' },
    { key: '10', value: 'Bichon Frisé' },
    { key: '11', value: 'Bloodhound' },
    { key: '12', value: 'Boiadeiro Australiano' },
    { key: '13', value: 'Border Collie' },
    { key: '14', value: 'Borzoi' },
    { key: '15', value: 'Boston Terrier' },
    { key: '16', value: 'Boxer' },
    { key: '17', value: 'Buldogue Francês' },
    { key: '18', value: 'Buldogue Inglês' },
    { key: '19', value: 'Bull Terrier' },
    { key: '20', value: 'Cane Corso' },
    { key: '21', value: 'Cavalier King Charles Spaniel' },
    { key: '22', value: 'Chihuahua' },
    { key: '23', value: 'Chow Chow' },
    { key: '24', value: 'Cocker Spaniel' },
    { key: '25', value: 'Corgi' },
    { key: '26', value: 'Dachshund (Salsicha)' },
    { key: '27', value: 'Dálmata' },
    { key: '28', value: 'Doberman' },
    { key: '29', value: 'Dogo Argentino' },
    { key: '30', value: 'Dogue Alemão' },
    { key: '31', value: 'Dogue de Bordeaux' },
    { key: '32', value: 'Fila Brasileiro' },
    { key: '33', value: 'Fox Paulistinha' },
    { key: '34', value: 'Galguinho Italiano' },
    { key: '35', value: 'Golden Retriever' },
    { key: '36', value: 'Greyhound (Galgo Inglês)' },
    { key: '37', value: 'Husky Siberiano' },
    { key: '38', value: 'Jack Russell Terrier' },
    { key: '39', value: 'Labradoodle' },
    { key: '40', value: 'Labrador Retriever' },
    { key: '41', value: 'Lhasa Apso' },
    { key: '42', value: 'Lulu da Pomerânia' },
    { key: '43', value: 'Malamute do Alasca' },
    { key: '44', value: 'Maltês (Bichon Maltês)' },
    { key: '45', value: 'Mastiff Inglês' },
    { key: '46', value: 'Mastim Napolitano' },
    { key: '47', value: 'Mastim Tibetano' },
    { key: '48', value: 'Papillon' },
    { key: '49', value: 'Pastor Alemão' },
    { key: '50', value: 'Pastor Australiano' },
    { key: '51', value: 'Pastor Belga' },
    { key: '52', value: 'Pastor de Shetland' },
    { key: '53', value: 'Pastor do Cáucaso' },
    { key: '54', value: 'Pastor Maremano Abruzes' },
    { key: '55', value: 'Pastor Suíço' },
    { key: '56', value: 'Pequinês' },
    { key: '57', value: 'Pinscher' },
    { key: '58', value: 'Pit bull' },
    { key: '59', value: 'Pointer Inglês' },
    { key: '60', value: 'Poodle' },
    { key: '61', value: 'Poodle Toy' },
    { key: '62', value: 'Pug' },
    { key: '63', value: 'Rottweiler' },
    { key: '64', value: 'Rough Collie' },
    { key: '65', value: 'Samoieda' },
    { key: '66', value: 'São Bernardo' },
    { key: '67', value: 'Schnauzer' },
    { key: '68', value: 'Setter Irlandês' },
    { key: '69', value: 'Shar-pei' },
    { key: '70', value: 'Shiba' },
    { key: '71', value: 'Shih Tzu' },
    { key: '72', value: 'Spitz Japonês' },
    { key: '73', value: 'Staffordshire Bull Terrier' },
    { key: '74', value: 'Terra Nova' },
    { key: '75', value: 'Weimaraner' },
    { key: '76', value: 'West Highland White Terrier' },
    { key: '77', value: 'Whippet' },
    { key: '78', value: 'Yorkshire' },
  ]

  // Lista de raças de gato.
  const dataCatList = [
    { key: '1', value: 'SRD - Sem raça definida' },
    { key: '2', value: 'Abissínio' },
    { key: '3', value: 'American Bobtail' },
    { key: '4', value: 'American Curl' },
    { key: '5', value: 'American Shorthair' },
    { key: '6', value: 'American Wirehair' },
    { key: '7', value: 'Angorá' },
    { key: '8', value: 'Asiático' },
    { key: '9', value: 'Australian Mist' },
    { key: '10', value: 'Balinês' },
    { key: '11', value: 'Bengal' },
    { key: '12', value: 'Bobtail Japonês' },
    { key: '13', value: 'Bombaim' },
    { key: '14', value: 'British Longhair' },
    { key: '15', value: 'British Shorthair' },
    { key: '16', value: 'Burmês' },
    { key: '17', value: 'Burmilla' },
    { key: '18', value: 'Chartreux' },
    { key: '19', value: 'Cornish Rex' },
    { key: '20', value: 'Cymric' },
    { key: '21', value: 'Devon Rex' },
    { key: '22', value: 'Don Sphynx' },
    { key: '23', value: 'Exótico' },
    { key: '24', value: 'German Rex' },
    { key: '25', value: 'Havana' },
    { key: '26', value: 'Khao Manee' },
    { key: '27', value: 'Korat' },
    { key: '28', value: 'Kurilian Bobtail' },
    { key: '29', value: 'LaPerm' },
    { key: '30', value: 'Maine Coon' },
    { key: '31', value: 'Manx' },
    { key: '32', value: 'Mau Egípcio' },
    { key: '33', value: 'Munchkin' },
    { key: '34', value: 'Neva Masquerade' },
    { key: '35', value: 'Norueguês da Floresta' },
    { key: '36', value: 'Ocicat' },
    { key: '37', value: 'Oriental' },
    { key: '38', value: 'Persa' },
    { key: '39', value: 'Peterbald' },
    { key: '40', value: 'Pixiebob' },
    { key: '41', value: 'Ragamuffin' },
    { key: '42', value: 'Ragdoll' },
    { key: '43', value: 'Russo' },
    { key: '44', value: 'Sagrado da Birmânia' },
    { key: '45', value: 'Scottish Fold' },
    { key: '46', value: 'Scottish Straight' },
    { key: '47', value: 'Selkirk Rex' },
    { key: '48', value: 'Seychellois' },
    { key: '49', value: 'Siamês' },
    { key: '50', value: 'Siberiano' },
    { key: '51', value: 'Singapura' },
    { key: '52', value: 'Snowshoe' },
    { key: '53', value: 'Sokoke' },
    { key: '54', value: 'Somali' },
    { key: '55', value: 'Sphynx' },
    { key: '56', value: 'Thai' },
    { key: '57', value: 'Tonquinês' },
    { key: '58', value: 'Van Turco' },
    { key: '59', value: 'Vankedisi' }
  ]

  // Lista de portes do pet (pequeno, médio e grande).
  const petHeight = [
    { key: '1', value: 'Pequeno' },
    { key: '2', value: 'Médio' },
    { key: '3', value: 'Grande' },
  ]

  // Função que pega a data de nascimento informada e calcula a idade a partir disso.
  useEffect(() => {
    function petAgeMath() {
      if (date !== null) {
        //const age = (Math.floor(Math.ceil(Math.abs(date.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) / 365.25));

        const ageInDays = Math.ceil(Math.abs(date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        const ageInYears = Math.floor(ageInDays / 365);
        const ageInMonths = Math.floor((ageInDays % 365) / 30);

        if (ageInYears < 1) {
          const age = ageInMonths === 1 ? `${ageInMonths} mês` : `${ageInMonths} meses`;
          setPetAge(age);
        } else {
          const age = ageInYears === 1 ? `${ageInYears} ano` : `${ageInYears} anos`;
          setPetAge(age);
        }

      }
    }
    petAgeMath();
  })

  // Função que pega as informações inseridas e as atualiza no Firebase.
  const changePetInfo = async () => {
    const user = auth.currentUser.uid;

    if (!user) {
      throw new Error('Usuário não logado');
    }

    // Get a reference to the document you want to update
const docRefUpdate = doc(db, 'pets', PetInfo.petId);


    const docRef = await updateDoc(docRefUpdate, {
      petName: petName,
      petAge: petAge,
      petWeight: petWeight,
      petGender: petGender,
      petColor: petColor,
      petBreed: petBreed,
      petBirthday: date,
      petSize: petSize,
    });

    const petId = PetInfo.petId;
    image === null ? <View></View> : uploadImage(petId);

    navigation.navigate('PetInfoPage', { petInfo: PetInfo, petPhoto: petPhoto } )
  }

  // Função que faz o upload da imagem selecionada.
  const uploadImage = async (petId) => {
    //setUploading(true);
    const user = auth.currentUser.uid;

    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    const metadata = {
      contentType: 'image/jpeg',
    };

    const storageRef = ref(storage, `Photos/${user}/${petId}`);
    const uploadTask = uploadBytes(storageRef, blobImage, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  // Traz a informação do pet
  useEffect(() => {
    const q = query(collection(db, 'pets'), where("petId", "==", PetInfo.petId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ ...doc.data(), id: doc.id });
      });
      petsData.map((pet) => {
        setPets(pet);
        setPetName(pet.petName);
        setDate(pet.petBirthday.toDate());
        setPetWeight(pet.petWeight);
        setPetGender(pet.petGender);
        setPetBreed(pet.petBreed);
        setPetSize(pet.petSize);
        setPetColor(pet.petColor);
      })
    });
    
    return () => unsubscribe();
  }, [PetInfo]);

  // Traz a informação das vacinas do pet
  useEffect(() => {
    const q = query(collection(db, 'vaccines'), where("petId", "==", PetInfo.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vaccinesData = [];
      querySnapshot.forEach((doc) => {
        vaccinesData.push({ ...doc.data(), id: doc.id });
      });
      setVaccines(vaccinesData);
    });

    return () => unsubscribe();
  }, []);

  // Traz a informação de consultas do pet
  useEffect(() => {
    const q = query(collection(db, 'appointments'), where("petId", "==", PetInfo.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id });
      });
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  // Questiona o usuário se ele tem certeza da ação
  const showConfirmDeletePet = (idPet, idVac, idAppoint) => {
    return Alert.alert(
      "Deseja mesmo excluir este perfil?",
      "Essa ação não poderá ser desfeita.",
      [
        {
          text: "SIM",
          onPress: () => deletePetProfile(idPet, idVac, idAppoint)
        },
        {
          text: "NÃO",
        },
      ]
    );
  };

  // Excluir perfil do pet (também exclui histórico de vacinas e de consultas)
  const deletePetProfile = async (idPet, idVac, idAppoint) => {
    navigation.navigate('Home');
    await deleteDoc(doc(db, "pets", idPet));

    for (let numberOfVaccines of idVac) {
      await deleteDoc(doc(db, "vaccines", numberOfVaccines.id));
    }

    for (let numberOfAppointments of idAppoint) {
      await deleteDoc(doc(db, 'appointments', numberOfAppointments.id));
    }

     // Create a reference to the file to delete
     const deleteRef = ref(storage, petPhoto);

     // Delete the file
     try {
       deleteObject(deleteRef).then(() => {
         console.log('Foto excluída com sucesso');
       })
     } catch {
       // 
     }
   };
 

  return (
    <ScrollView
      style={styles.container}>
      <View>
        <View style={styles.inputContainer}>

          <View style={styles.petSelect}>
            <Text style={{ marginLeft: 5 }}>Nome do pet:</Text>
            <View>
              <TextInput
                mode='outlined'
                outlineColor={'#DDDBDA'}
                placeholder={'Nome do pet'}
                placeholderTextColor={'#BCBCBC'}
                maxLength={12}
                style={styles.input}
                onChangeText={(text) => setPetName(text)}
                value={petName}
                />
            </View>

            <Text style={{ marginLeft: 5, marginTop: 5 }}>Data de nascimento / Peso (kg):</Text>
            <View style={styles.ageAndWeightView}>
              <View style={styles.birthInput}>
                <IconButton
                  icon="calendar"
                  size={30}
                  onPress={() => { setOpen(true) }}
                  />
                <View style={styles.inputContainer}>

                  <TextInput
                    mode='outlined'
                    textColor='#414141'
                    outlineColor='#DDDBDA'
                    placeholder='Data de nascimento'
                    style={styles.dateInput}
                    onChange={(date) => { setDate(date) }}
                    value={date.toLocaleDateString('pt-BR')}
                    disabled={true}
                    />
                </View>
                <SafeAreaProvider>
                  <View style={{ justifyContent: 'center', marginLeft: 20, alignItems: 'center' }}>

                    <DatePickerModal
                      locale="pt-BR"
                      mode="single"
                      visible={open}
                      onDismiss={onDismissSingle}
                      date={date}
                      validRange={{ startDate: new Date('2000-01-02'), endDate: new Date() }}
                      onConfirm={onConfirmSingle}
                      />
                  </View>
                </SafeAreaProvider>
              </View>



              <View style={{ width: 70 }}>
                <TextInput
                  mode='outlined'
                  outlineColor={'#DDDBDA'}
                  maxLength={2}
                  placeholder='Peso (kg)'
                  placeholderTextColor={'#BCBCBC'}
                  keyboardType='numeric'
                  style={styles.input}
                  onChangeText={(text) => setPetWeight(text)}
                  value={petWeight}
                  />
              </View>
            </View>

            <View>
              <View style={styles.radioButtonView}>
                <Text style={{ marginLeft: 5 }}>Sexo:</Text>
                <RadioButton
                  status={petGender === 'Macho' ? 'checked' : 'unchecked'}
                  
                  onPress={
                    () => {
                      setPetGender('Macho');
                    }
                  }
                  />
                <Text>Macho</Text>
                <RadioButton
                  status={petGender === 'Fêmea' ? 'checked' : 'unchecked'}
                  onPress={
                    () => {
                      setPetGender('Fêmea');
                    }
                  }
                  />
                <Text>Fêmea</Text>
                
                  
              </View>

              <View>

                <View>
                  <Text style={{ marginLeft: 5 }}>Cor:</Text>
                  <TextInput
                    mode='outlined'
                    outlineColor='#DDDBDA'
                    placeholder='Cor'
                    placeholderTextColor={'#BCBCBC'}
                    style={styles.input}
                    onChangeText={(text) => setPetColor(text)}
                    value={petColor}
                    />
                </View>

                <Text style={{ marginLeft: 5, marginTop: 5 }}>Porte:</Text>
                <SelectList
                  setSelected={(value) => setPetSize(value)}
                  data={petHeight}
                  Keyboard={false}
                  boxStyles={{ borderRadius: 5, backgroundColor: '#FFF', borderColor: '#DDDBDA', marginTop: 6 }}
                  save="value"
                  placeholder="Escolha o porte do seu pet"
                  defaultOption={{ key: `${petSize}`, value: petSize }}
                  search={false}
                />
              </View>

              <Text style={{ marginLeft: 5, marginTop: 5 }}>Raça:</Text>
              <SelectList
                setSelected={(value) => setPetBreed(value)}
                data={catOrDog === 'dog' ? dataDogList : dataCatList}
                save="value"
                boxStyles={{ borderRadius: 5, backgroundColor: '#FFF', marginTop: 6, borderColor: '#DDDBDA' }}
                placeholder="Escolha a raça do seu pet"
                notFoundText='Não encontramos nenhum resultado :('
                searchPlaceholder="Pesquise a raça do seu pet"
                defaultOption={{ key: `${petBreed}`, value: petBreed }}
              />
            </View>
          </View>
        </View>
      </View>

      <View>
        <View style={image === null ? <View /> : styles.petPhoto}>
          {image === null ? <View></View> : <Text>Prévia:</Text>}
          {image && <Image source={{ uri: image }} style={{ alignSelf: 'center', width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'orange' }} />}
          {image === null ? <View></View> : <Text style={{ fontSize: 12, marginTop: 7 }}>A imagem pode demorar alguns minutos para aparecer após o perfil ter sido criado.</Text>}
        </View>
      </View>
      <View>
        <Text style={{ marginLeft: 5, marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Atenção: </Text>Todos os campos são obrigatórios.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={{ width: 50, height: 40, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginRight: 10 }} title={<IconButton icon="camera" iconColor='#FFF' />} onPress={pickImage} />
        <Button disabled={!error} title="Alterar informações" onPress={() => { changePetInfo() }} />
      </View>

      <View style={{ marginTop: 10, marginBottom: 30, width: '90%', alignSelf: 'center' }}>
        <Button title="Excluir perfil do pet" onPress={() => showConfirmDeletePet(PetInfo.id, vaccines, appointments)} />
      </View>
    </ScrollView>

  );
}
