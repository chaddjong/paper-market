import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBwh61jRpBiSrRZxki3GFJ2woFsAK7uu40',
  authDomain: 'paper-market-56903.firebaseapp.com',
  projectId: 'paper-market-56903',
  storageBucket: 'paper-market-56903.firebasestorage.app',
  messagingSenderId: '814132386608',
  appId: '1:814132386608:web:a7c02faee733de504f46f5',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
