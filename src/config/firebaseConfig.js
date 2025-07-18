import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNIhL5klW4jntVvd4SC0oEZzN_QzX9Gd0',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'neighbourly-prod-5f2cc',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'SENDER_ID',
  appId: '1:192241477776:android:f4dec23e813b83d8f19015'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
