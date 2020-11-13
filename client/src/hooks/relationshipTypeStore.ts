import { RelationshipType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
const relationshipTypesState = atom<RelationshipType[]>({ key: 'RELATIONSHIP_TYPES', default: null });

export function useRelationshipTypeStore() {
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

  const [types, updateRelationshipTypes] = useRecoilState(relationshipTypesState);

  const typesMap = useMemo(
    () =>
      types?.reduce<Record<string, RelationshipType>>((acc, type) => {
        acc[type.id] = type;

        return acc;
      }, {}) || {},
    [types]
  );

  useEffect(
    () => {
      if (user && !unsubscribeCallback.current && types === null) {
        console.log(`fetch relationship types`);
        updateRelationshipTypes(undefined);

        // firebase onSnapshot handler is triggered on every update
        unsubscribeCallback.current = db.collection('relationship-types').onSnapshot(({ docs }) => {
          const types = docs.map(doc => ({ ...doc.data(), id: doc.id } as RelationshipType));

          updateRelationshipTypes(types);
        });
      }

      return () => {
        // unsubscribe on unmount
        unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, unsubscribe, updateRelationshipTypes]
  );

  const updateType = async (type: RelationshipType) => {
    return db.collection('relationship-types').doc(type.id).update(type);
  };

  const addType = async (type: RelationshipType) => {
    return db.collection('relationship-types').add(type);
  };

  return { types, typesMap, updateType, addType };
}
