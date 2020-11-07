import { useMountedState } from 'src/hooks';
import { useState, useEffect, useContext } from 'react';
import { User, FirebaseContext } from '../firebase';

export function useFirebaseUser(callback: (user: User) => void = () => undefined): User {
  const { auth } = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState<User>();

  const isMounted = useMountedState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (isMounted()) {
        setCurrentUser(currentUser);
        callback(currentUser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, auth, callback, isMounted]);

  return currentUser;
}
