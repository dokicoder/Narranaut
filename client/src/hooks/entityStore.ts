import { atomFamily } from 'recoil';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
export const createEntityStore = atomFamily<ObjectEntity[], string>({
  key: 'ENTITIES',
  default: null,
});

export function useEntityStore(storeKey: string) {
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

  const [entities, updateEntities] = useRecoilState(createEntityStore(storeKey));

  const entityMap = useMemo(
    () =>
      entities?.reduce<Record<string, ObjectEntity>>((acc, relationship) => {
        acc[relationship.id] = relationship;

        return acc;
      }, {}) || {},
    [entities]
  );

  // this effect is only called on page load. since the state is shared with recoil (due to the entities === null part of the condition)
  useEffect(
    () => {
      if (user && !unsubscribeCallback.current && entities === null) {
        console.log(`fetch entities of type "${storeKey}"`);
        updateEntities(undefined);

        unsubscribeCallback.current = db
          .collection('entities')
          // only retrieve entities bound to current user
          .where('uid', '==', user.uid)
          .where('type.name', '==', storeKey)
          .onSnapshot(({ docs }) => {
            const entities = docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectEntity));

            updateEntities(entities);
          });
      }

      return () => {
        // unsubscribe on unmount
        unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, storeKey, unsubscribe, updateEntities]
  );

  const updateEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).update(entity);
  };

  const addEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').add(entity);
  };

  const flagEntityDeleted = async (entity: ObjectEntity, deleted: boolean) => {
    return db.collection('entities').doc(entity.id).update({ deleted });
  };

  const reallyDeleteEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).delete();
  };

  return { entities, entityMap, updateEntity, addEntity, flagEntityDeleted, reallyDeleteEntity };
}
