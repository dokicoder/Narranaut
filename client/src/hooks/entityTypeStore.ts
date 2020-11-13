import { EntityType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
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

  const typesMap = useMemo(
    () =>
      types?.reduce<Record<string, EntityType>>((acc, type) => {
        acc[type.id] = type;

        return acc;
      }, {}) || {},
    [types]
  );

  useEffect(
    () => {
      if (user && !unsubscribeCallback.current && types === null) {
        console.log(`fetch entity types`);
        updateEntityTypes(undefined);

        // firebase onSnapshot handler is triggered on every update
        unsubscribeCallback.current = db.collection('entity-types').onSnapshot(({ docs }) => {
          const types = docs.map(doc => ({ ...doc.data(), id: doc.id } as EntityType));

          updateEntityTypes(types);
        });
      }

      return () => {
        // unsubscribe on unmount
        unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, unsubscribe, updateEntityTypes]
  );

  const updateType = async (type: EntityType) => {
    return db.collection('entity-types').doc(type.id).update(type);
  };

  const addType = async (type: EntityType) => {
    return db.collection('entity-types').add(type);
  };

  return { types, typesMap, updateType, addType };
}
