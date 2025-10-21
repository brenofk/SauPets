// firebaseConfig.js (ou firebase.ts)

// Importa apenas o que for necessário do SDK Web
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração gerada pelo Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que quiser usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta para usar em outros arquivos
export { app, auth, db, storage };
