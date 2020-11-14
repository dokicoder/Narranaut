import { EntityType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
const entityTypesState = atom<EntityType[]>({ key: 'ENTITY_TYPES', default: null });
// stores array of unique ids representing the hook calls listening for firebase store updates - this is the only way I could think of to track when the last registration is unmounted and trigger an unsubscribe
const registrationIdState = atom<number[]>({ key: 'ENTITY_TYPES_REGISTRATION_STATE', default: [] });

let idCounter = 0;

let unsubscribeCallback: () => void | undefined = undefined;

export function useEntityTypeStore() {
  const thisRegistrationIdRef = useRef<number>(++idCounter);

  const [types, updateEntityTypes] = useRecoilState(entityTypesState);
  const [registrationIds, updateRegistrationIds] = useRecoilState(registrationIdState);

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

  useEffect(
    () => {
      updateRegistrationIds(registrationIds => [...registrationIds, thisRegistrationIdRef.current]);

      // this fixes the following warning:
      // "The ref value 'thisRegistrationIdRef.current' will likely have changed by the time this effect cleanup function runs."
      const saveRefValue = thisRegistrationIdRef.current;

      // unsubscribe if last tracked listener of store unmounts
      return () => {
        updateRegistrationIds(registrationIds => registrationIds.filter(id => id !== saveRefValue));

        if (registrationIds.length === 1) {
          unsubscribe();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
      if (user && !unsubscribeCallback && types === null && thisRegistrationIdRef.current === registrationIds[0]) {
        console.log(`fetch entity types`);
        updateEntityTypes(undefined);

        // firebase onSnapshot handler is triggered on every update
        unsubscribeCallback = db.collection('entity-types').onSnapshot(({ docs }) => {
          console.log('entity types update callback');
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
