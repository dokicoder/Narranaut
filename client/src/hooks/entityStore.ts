import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { createEntityStore } from './../store/recoilStore';
import { useEffect, useContext, useRef, useCallback } from 'react';
import { FirebaseContext } from './../firebase';
import { useRecoilState } from 'recoil';

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

  useEffect(() => {
    if (user && !unsubscribeCallback.current) {
      console.log(`fetch entities of type "${storeKey}"`);
      unsubscribeCallback.current = db
        .collection('entities')
        // only retrieve entities bound to current user
        .where('uid', '==', user.uid)
        // deleted flag is used to keep deleted records in db for now
        .where('deleted', '==', false)
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
  }, [user, db, storeKey, unsubscribe, updateEntities]);

  const updateEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).update(entity);
  };

  const addEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').add(entity);
  };

  const removeEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).delete();
    //return db.collection('entities').doc(entity.id).update({ markedAsDeleted: true });
  };

  return { entities, updateEntity, addEntity, removeEntity };
}
