import { useState, useEffect, useContext } from 'react';
import { User, FirebaseContext } from './../firebase';

export function useFirebaseUser(): User {
  const { auth } = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, auth]);

  return currentUser;
}
