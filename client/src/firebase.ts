import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React from 'react';

export type User = firebase.User;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_WEB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_WEB_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_WEB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_WEB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_WEB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_WEB_ID,
};

if (!firebaseConfig.apiKey) {
  console.warn(
    'it seems your auth configuration is missing. Go to https://console.firebase.google.com/, select your project and copy the secrets into a .env file in root directory (local) or inject environment variables (production)'
  );
}

class Firebase {
  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);
  }

  private app: firebase.app.App;

  get auth() {
    return this.app.auth();
  }

  get db() {
    return this.app.firestore();
  }

  // *** Auth API ***
  registerUser = async (email: string, password: string): Promise<User> => {
    const { user } = await this.auth.createUserWithEmailAndPassword(email, password);

    return user;
  };

  signIn = async (email: string, password: string) => {
    const { user } = await this.auth.signInWithEmailAndPassword(email, password);

    return user;
  };

  signOut = async () => {
    return this.auth.signOut();
  };

  resetPassword = async (email: string) => {
    return this.auth.sendPasswordResetEmail(email);
  };

  updatePassword = (password: string) => {
    this.auth.currentUser.updatePassword(password);
  };

  get currentUser() {
    return this.auth.currentUser;
  }
}

export const firebaseInstance = new Firebase();

export const FirebaseContext = React.createContext<Firebase>(null);
