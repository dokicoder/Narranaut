import { atom } from 'recoil';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { useEffect, useContext, useCallback, useMemo } from 'react';
import { FirebaseContext } from '../firebase';
import { useRecoilState } from 'recoil';

/*
TODO: this redundantly stores all entities in another store that is kept in sync. We could also use this store to derive the other stores from it and keep every entity just once
*/

// semantics: null means "before initial load", will be set to undefined when reload with loading indication is intended
const entityState = atom<ObjectEntity[]>({ key: 'ALL_ENTITIES', default: null });

let unsubscribeCallback: () => void | undefined;

export function useFullEntityStore() {
  const [entities, updateEntities] = useRecoilState(entityState);

  const unsubscribe = useCallback(
    () => {
      if (unsubscribeCallback) {
        console.log(`unsubscribe from all entities update`);
        unsubscribeCallback();
        unsubscribeCallback = undefined;
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

  // this effect is only called for the first component registration. the store state is shared between instances with recoil (due to the entities === null part of the condition)
  useEffect(
    () => {
      if (user && !unsubscribeCallback) {
        console.log(`fetch all entities`);
        updateEntities(undefined);

        unsubscribeCallback = db
          .collection('entities')
          // only retrieve entities bound to current user
          .where('uid', '==', user.uid)
          .orderBy('name')
          .onSnapshot(({ docs }) => {
            console.log(`all entities update callback`);
            const entities = docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectEntity));

            updateEntities(entities);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, db, unsubscribe, updateEntities]
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
