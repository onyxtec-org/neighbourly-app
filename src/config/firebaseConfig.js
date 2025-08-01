// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBNIhL5klW4jntVvd4SC0oEZzN_QzX9Gd0',
//   authDomain: 'https://neighbourly-prod-5f2cc-default-rtdb.firebaseio.com   ',
//   projectId: 'neighbourly-prod-5f2cc',
//   storageBucket: 'neighbourly-prod-5f2cc.firebasestorage.app',
//   messagingSenderId: '192241477776',
//   appId: '1:192241477776:android:f4dec23e813b83d8f19015'
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };


// src/config/firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNIhL5klW4jntVvd4SC0oEZzN_QzX9Gd0',
  authDomain: 'neighbourly-prod-5f2cc.firebaseapp.com',
  projectId: 'neighbourly-prod-5f2cc',
  storageBucket: 'neighbourly-prod-5f2cc.appspot.com',
  messagingSenderId: '192241477776',
  appId: '1:192241477776:android:f4dec23e813b83d8f19015',
};

// ✅ Check if Firebase is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore instance
const db = getFirestore(app);

export { app, db };
