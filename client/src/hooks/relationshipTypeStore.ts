import { RelationshipType } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState, atom } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
const relationshipTypesState = atom<RelationshipType[]>({ key: 'RELATIONSHIP_TYPES', default: null });

let unsubscribeCallback: () => void | undefined = undefined;

export function useRelationshipTypeStore() {
  const [types, updateRelationshipTypes] = useRecoilState(relationshipTypesState);

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback) {
      console.log('unsubscribe from relationship types update');
      unsubscribeCallback();
      unsubscribeCallback = undefined;
      updateRelationshipTypes(null);
    }
  }, [updateRelationshipTypes]);

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

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
      if (user && !unsubscribeCallback) {
        console.log(`fetch relationship types`);
        updateRelationshipTypes(undefined);

        // firebase onSnapshot handler is triggered on every update
        unsubscribeCallback = db
          .collection('relationship-types')
          .orderBy('name')
          .onSnapshot(({ docs }) => {
            console.log('relationship types update callback');
            const types = docs.map(doc => ({ ...doc.data(), id: doc.id } as RelationshipType));

            updateRelationshipTypes(types);
          });
      }
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
