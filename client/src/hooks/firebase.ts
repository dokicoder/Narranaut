import { useState, useEffect, useContext } from 'react';
import { User, FirebaseContext } from './../firebase';

export function useFirebaseUser(callback: (user: User) => void = () => undefined): User {
  const { auth } = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);
      callback(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, auth, callback]);

  return currentUser;
}
