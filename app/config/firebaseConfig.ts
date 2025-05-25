import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { measure } from 'react-native-reanimated';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY as string,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN as string,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL as string,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID as string,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET as string,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID as string,
    appId: process.env.EXPO_PUBLIC_APP_ID as string,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID as string
  }

// console.log("Errrrrrrrrrrrrrrrrrrrrrrr")
// console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const fireBaseDB = getDatabase(app);

export { fireBaseDB };