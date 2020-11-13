import { atom } from 'recoil';
import { Relationship } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

// semantics: null is the loading state here - TODO: should this be undefined? make it consistent with other stores, maybe define an interface for that
const relationshipState = atom<Relationship[]>({ key: 'RELATIONSHIPS', default: null });

export function useRelationshipStore() {
  const unsubscribeCallback = useRef<() => void>();

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback.current) {
      console.log('unsubscribe');
      unsubscribeCallback.current();
      unsubscribeCallback.current = undefined;
    }
  }, [unsubscribeCallback]);

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

  const [relationships, updateRelationships] = useRecoilState(relationshipState);

  const relationshipMap = useMemo(
    () =>
      relationships?.reduce<Record<string, Relationship>>((acc, relationship) => {
        acc[relationship.id] = relationship;

        return acc;
      }, {}) || {},
    [relationships]
  );

  // this effect is only called on page load. since the state is shared with recoil (due to the relationships === null part of the condition)
  useEffect(
    () => {
      if (user && !unsubscribeCallback.current && relationships === null) {
        console.log(`fetch relationships`);
        updateRelationships(undefined);

        unsubscribeCallback.current = db
          .collection('relationships')
          // only retrieve relationships bound to current user
          .where('uid', '==', user.uid)
          .onSnapshot(({ docs }) => {
            const relationships = docs.map(doc => ({ id: doc.id, ...doc.data() } as Relationship));

            updateRelationships(relationships);
          });
      }

      return () => {
        // unsubscribe on unmount
        unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, unsubscribe, updateRelationships]
  );

  const updateRelationship = async (relationship: Relationship) => {
    return db.collection('relationships').doc(relationship.id).update(relationship);
  };

  const addRelationship = async (relationship: Relationship) => {
    return db.collection('relationships').add(relationship);
  };

  const flagRelationshipDeleted = async (relationship: Relationship, deleted: boolean) => {
    return db.collection('relationships').doc(relationship.id).update({ deleted });
  };

  const reallyDeleteRelationship = async (relationship: Relationship) => {
    return db.collection('relationships').doc(relationship.id).delete();
  };

  return {
    relationships,
    relationshipMap,
    updateRelationship,
    addRelationship,
    flagRelationshipDeleted,
    reallyDeleteRelationship,
  };
}
