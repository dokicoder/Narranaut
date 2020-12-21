import { EntityType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
const entityTypesState = atom<EntityType[]>({ key: 'ENTITY_TYPES', default: null });

let unsubscribeCallback: () => void | undefined = undefined;

export function useEntityTypeStore() {
  const [types, updateEntityTypes] = useRecoilState(entityTypesState);

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback) {
      console.log('unsubscribe from entity types update');
      unsubscribeCallback();
      unsubscribeCallback = undefined;
      updateEntityTypes(null);
    }
  }, [updateEntityTypes]);

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

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
      if (user && !unsubscribeCallback) {
        console.log(`fetch entity types`);
        updateEntityTypes(undefined);

        // firebase onSnapshot handler is triggered on every update
        unsubscribeCallback = db
          .collection('entity-types')
          .orderBy('name')
          .onSnapshot(({ docs }) => {
            console.log('entity types update callback');
            const types = docs.map(doc => ({ ...doc.data(), id: doc.id } as EntityType));

            updateEntityTypes(types);
          });
      }
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
