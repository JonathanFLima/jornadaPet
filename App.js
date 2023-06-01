import HomePage from './src/pages/HomePage/homePage';
import LoginScreen from './src/pages/LoginScreen/loginScreen';
import RegisterScreen from './src/pages/RegisterScreen/registerScreen';
import NewPet from './src/pages/NewPet/newPet';
import PetInfoPage from './src/pages/PetInfoPage/petInfoPage';
import AppointmentPage from './src/pages/AppointmentPage/appoiments';
import AddAppointmentPage from './src/pages/AppointmentPage/AddAppointment/addAppointment';
import VaccinesPage from './src/pages/Vaccines/vaccines';
import AddVacinePage from './src/pages/Vaccines/AddVaccine/addVaccine';
import AllergyPage from './src/pages/AllergyPage/allergies';
import AddNewAllergy from './src/pages/AllergyPage/AddNewAllergy/addNewAllergy';
import ChangeAllergyInfo from './src/pages/AllergyPage/ChangeAllergyInfo/changeAllergyInfo';
import ChangeAppointmentInfo from './src/pages/AppointmentPage/ChangeAppointmentInfo/changeAppointmentInfo';
import ChangeVaccineInfo from './src/pages/Vaccines/ChangeVaccineInfo/changeVaccineInfo';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePetInfo from './src/pages/ChangePetInfo/changePetInfo';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerBackVisible: false, title: 'Página principal', headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
        <Stack.Screen name="Cadastre seu bichinho!" component={NewPet} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
        <Stack.Screen name="PetInfoPage" component={PetInfoPage} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF', title: 'Informações do pet' }} />
        <Stack.Screen name="Consultas" component={AppointmentPage} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
        <Stack.Screen name="Novo registro" component={AddAppointmentPage} options={{ headerStyle: { backgroundColor: "#FF8718" }, title: 'Adicionar novo registro', headerTintColor: '#FFF' }} />
        <Stack.Screen name="Editar registro" component={ChangeAppointmentInfo} options={{ headerStyle: { backgroundColor: "#FF8718" }, title: 'Editar registro de consulta', headerTintColor: '#FFF' }} />
        <Stack.Screen name="Vacinas" component={VaccinesPage} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF', title: 'Vacinas' }} />
        <Stack.Screen name="Adicionar nova vacina" component={AddVacinePage} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
        <Stack.Screen name="Editar vacina" component={ChangeVaccineInfo} options={{ headerStyle: { backgroundColor: "#FF8718" }, title: 'Editar registro de vacina', headerTintColor: '#FFF' }} />
        <Stack.Screen name="Alergias/Cuidados" component={AllergyPage} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
        <Stack.Screen name="Nova alergia" component={AddNewAllergy} options={{ headerStyle: { backgroundColor: "#FF8718" }, title: 'Adicionar novo registro', headerTintColor: '#FFF' }} />
        <Stack.Screen name="Alterar alergia" component={ChangeAllergyInfo} options={{ headerStyle: { backgroundColor: "#FF8718" }, title: 'Alterar informações', headerTintColor: '#FFF' }} />
        <Stack.Screen name="Alterar informações do pet" component={ChangePetInfo} options={{ headerStyle: { backgroundColor: "#FF8718" }, headerTintColor: '#FFF' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}