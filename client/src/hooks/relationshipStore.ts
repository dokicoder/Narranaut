import { atom } from 'recoil';
import { Relationship } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

// semantics: null is the loading state here - TODO: should this be undefined? make it consistent with other stores, maybe define an interface for that
const relationshipState = atom<Relationship[]>({ key: 'RELATIONSHIPS', default: null });

let unsubscribeCallback: () => void | undefined = undefined;

export function useRelationshipStore() {
  const [relationships, updateRelationshipStore] = useRecoilState(relationshipState);

  const unsubscribe = useCallback(() => {
    if (unsubscribeCallback) {
      console.log('unsubscribe from relationships update');
      unsubscribeCallback();
      unsubscribeCallback = undefined;
      updateRelationshipStore(null);
    }
  }, [updateRelationshipStore]);

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

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
      if (user && !unsubscribeCallback) {
        console.log(`fetch relationships`);
        updateRelationshipStore(undefined);

        unsubscribeCallback = db
          .collection('relationships')
          // only retrieve relationships bound to current user
          .where('uid', '==', user.uid)
          .onSnapshot(({ docs }) => {
            console.log('relationships update callback');
            const relationships = docs.map(doc => ({ id: doc.id, ...doc.data() } as Relationship));

            updateRelationshipStore(relationships);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, unsubscribe, updateRelationshipStore]
  );

  const updateRelationship = async (relationship: Relationship) => {
    return db.collection('relationships').doc(relationship.id).update(relationship);
  };

  const updateRelationships = async (relationships: Relationship[]) => {
    const batch = db.batch();

    relationships.forEach(r => {
      batch.update(db.collection('relationships').doc(r.id), r);
    });

    return batch.commit();
  };

  const addRelationship = async (relationship: Relationship) => {
    const doc = db.collection('relationships').doc();
    const relationshipWithId: Relationship = { ...relationship, id: doc.id };
    await doc.set(relationshipWithId);

    return relationshipWithId;
  };

  /**
   * this method can add *and* update entities simultaneously. those with Ids that are not available will be created
   * @param relationships list of relationships to be added, updated
   */
  const addRelationships = async (relationships: Relationship[]) => {
    const batch = db.batch();

    const docs = relationships.map(r => {
      const doc = r.id ? db.collection('relationships').doc(r.id) : db.collection('relationships').doc();
      return { r, doc };
    });

    docs.forEach(({ r, doc }) => {
      batch.set(doc, { ...r, id: doc.id });
    });

    await batch.commit();

    return Promise.all(
      docs.map(({ doc }) =>
        doc.get().then(doc => {
          return { id: doc.id, ...doc.data() } as Relationship;
        })
      )
    );
  };

  const flagRelationshipDeleted = async (relationship: Relationship, deleted: boolean) => {
    return db.collection('relationships').doc(relationship.id).update({ deleted });
  };

  const reallyDeleteRelationship = async (relationship: Relationship) => {
    return db.collection('relationships').doc(relationship.id).delete();
  };

  const reallyDeleteRelationships = async (relationships: Relationship[]) => {
    const batch = db.batch();

    relationships.map(r => {
      batch.delete(db.collection('relationships').doc(r.id));
    });

    return batch.commit();
  };

  return {
    relationships,
    relationshipMap,
    updateRelationship,
    updateRelationships,
    addRelationship,
    addRelationships,
    flagRelationshipDeleted,
    reallyDeleteRelationship,
    reallyDeleteRelationships,
  };
}
