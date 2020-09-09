import { EntityType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

const entityTypesState = atom<EntityType[]>({ key: 'ENTITY_TYPES', default: null });

export function useEntityTypeStore() {
  const unsubscribeCallback = useRef<() => void>();

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback.current) {
      unsubscribeCallback.current();
      unsubscribeCallback.current = undefined;
    }
  }, [unsubscribeCallback]);

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

  const [types, updateEntityTypes] = useRecoilState(entityTypesState);

  useEffect(() => {
    if (user && !unsubscribeCallback.current) {
      console.log(`fetch entity types`);
      unsubscribeCallback.current = db.collection('entity-types').onSnapshot(({ docs }) => {
        const types = docs.map(doc => ({ id: doc.id, ...doc.data() } as EntityType));

        updateEntityTypes(types);
      });
    }

    return () => {
      // unsubscribe on unmount
      unsubscribe();
    };
  }, [user, db, unsubscribe, updateEntityTypes]);

  const updateType = async (type: EntityType) => {
    console.log({ id: type.id });
    return db.collection('entity-types').doc(type.id).update(type);
  };

  const addType = async (type: EntityType) => {
    return db.collection('entity-types').add(type);
  };

  return { types, updateType, addType };
}
