import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { firebaseInstance, FirebaseContext } from '../firebase';

export const ContextWrapper: React.FC = ({ children }) => {
  return (
    <RecoilRoot>
      <FirebaseContext.Provider value={firebaseInstance}>
        <BrowserRouter>{children}</BrowserRouter>
      </FirebaseContext.Provider>
    </RecoilRoot>
  );
};
