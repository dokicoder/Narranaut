import { atomFamily } from 'recoil';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
export const createEntityStore = atomFamily<ObjectEntity[], string>({
  key: 'ENTITIES',
  default: null,
});

const unsubscribeCallbackMap: Record<string, () => void | undefined> = {};

export function useEntityStore(storeKey: string) {
  const [entities, updateEntities] = useRecoilState(createEntityStore(storeKey));

  const unsubscribe = useCallback(
    () => {
      if (unsubscribeCallbackMap[storeKey]) {
        console.log(`unsubscribe from entities of type "${storeKey}" update`);
        unsubscribeCallbackMap[storeKey]();
        unsubscribeCallbackMap[storeKey] = undefined;
        updateEntities(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateEntities]
  );

  const user = useFirebaseUser(user => {
    // unsubscribe on logout
    if (!user) unsubscribe();
  });
  const { db } = useContext(FirebaseContext);

  const entityMap = useMemo(
    () =>
      entities?.reduce<Record<string, ObjectEntity>>((acc, relationship) => {
        acc[relationship.id] = relationship;

        return acc;
      }, {}) || {},
    [entities]
  );

  // this effect is only called for the first component registration. the store state is shared between instances with recoil
  useEffect(
    () => {
      if (user && !unsubscribeCallbackMap[storeKey]) {
        console.log(`fetch entities of type "${storeKey}"`);
        updateEntities(undefined);

        unsubscribeCallbackMap[storeKey] = db
          .collection('entities')
          // only retrieve entities bound to current user
          .where('uid', '==', user.uid)
          .where('type.name', '==', storeKey)
          .onSnapshot(({ docs }) => {
            console.log(`entities of type "${storeKey}" update callback`);
            const entities = docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectEntity));

            updateEntities(entities);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, storeKey, unsubscribe, updateEntities]
  );

  const updateEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).update(entity);
  };

  const addEntity = async (entity: ObjectEntity) => {
    const doc = db.collection('entities').doc();
    const entityWithId: ObjectEntity = { ...entity, id: doc.id };
    await doc.set(entityWithId);

    return entityWithId;
  };

  const flagEntityDeleted = async (entity: ObjectEntity, deleted: boolean) => {
    return db.collection('entities').doc(entity.id).update({ deleted });
  };

  const reallyDeleteEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).delete();
  };

  return { entities, entityMap, updateEntity, addEntity, flagEntityDeleted, reallyDeleteEntity };
}
