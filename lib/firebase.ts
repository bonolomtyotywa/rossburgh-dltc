import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNnjXTWQ5i-xDA4NRZ50v60iP6YNT9VMw",
  authDomain: "rossburgh-dltc.firebaseapp.com",
  projectId: "rossburgh-dltc",
  storageBucket: "rossburgh-dltc.firebasestorage.app",
  messagingSenderId: "41156791306",
  appId: "1:41156791306:web:0fc4e477f7e447660163f3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };