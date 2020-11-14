import { atom } from 'recoil';
import { Relationship } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

// semantics: null is the loading state here - TODO: should this be undefined? make it consistent with other stores, maybe define an interface for that
const relationshipState = atom<Relationship[]>({ key: 'RELATIONSHIPS', default: null });
// stores array of unique ids representing the hook calls listening for firebase store updates - this is the only way I could think of to track when the last registration is unmounted and trigger an unsubscribe
const registrationIdState = atom<number[]>({ key: 'RELATIONSHIPS_REGISTRATION_STATE', default: [] });

let idCounter = 0;

let unsubscribeCallback: () => void | undefined = undefined;

export function useRelationshipStore() {
  const thisRegistrationIdRef = useRef<number>(++idCounter);

  const [relationships, updateRelationships] = useRecoilState(relationshipState);
  const [registrationIds, updateRegistrationIds] = useRecoilState(registrationIdState);

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback) {
      console.log('unsubscribe from relationships update');
      unsubscribeCallback();
      unsubscribeCallback = undefined;
      updateRelationships(null);
    }
  }, [updateRelationships]);

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

  const relationshipMap = useMemo(
    () =>
      relationships?.reduce<Record<string, Relationship>>((acc, relationship) => {
        acc[relationship.id] = relationship;

        return acc;
      }, {}) || {},
    [relationships]
  );

  // this effect is only called on first registration. the state is shared with recoil and a list of references to hook calls kept
  useEffect(
    () => {
      if (
        user &&
        !unsubscribeCallback &&
        relationships === null &&
        thisRegistrationIdRef.current === registrationIds[0]
      ) {
        console.log(`fetch relationships`);
        updateRelationships(undefined);

        unsubscribeCallback = db
          .collection('relationships')
          // only retrieve relationships bound to current user
          .where('uid', '==', user.uid)
          .onSnapshot(({ docs }) => {
            console.log('relationships update callback');
            const relationships = docs.map(doc => ({ id: doc.id, ...doc.data() } as Relationship));

            updateRelationships(relationships);
          });
      }
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
