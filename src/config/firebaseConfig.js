import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
import {getReactNativePersistence} from 'firebase/auth/react-native';

  
  

export const firebaseConfig = {
  apiKey: "AIzaSyB1zfgmcEEu4vFPhNmNLfdsCuOikaHrvw0",
  authDomain: "app-petdata-aaedf.firebaseapp.com",
  projectId: "app-petdata-aaedf",
  storageBucket: "app-petdata-aaedf.appspot.com",
  messagingSenderId: "709409120204",
  appId: "1:709409120204:web:e07498fa47e2fa62d0c769"
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
const db = getFirestore();
const storage = getStorage(app);

export { app, auth, db, storage }