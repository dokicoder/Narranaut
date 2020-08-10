import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { createEntityStore } from './../store/recoilStore';
import { useEffect, useContext } from 'react';
import { FirebaseContext } from './../firebase';
import { useRecoilState } from 'recoil';

export function useEntityStore(storeKey: string) {
  const user = useFirebaseUser();
  const { db } = useContext(FirebaseContext);

  const [entities, updateEntities] = useRecoilState(createEntityStore(storeKey));

  useEffect(() => {
    let unsubscribe: () => void;

    if (user) {
      console.log(`fetch entity of type "${storeKey}"`);
      unsubscribe = db
        .collection('entities')
        .where('uid', '==', user.uid)
        .where('type.id', '==', storeKey)
        .onSnapshot(({ docs }) => {
          const entities = docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectEntity));

          updateEntities(entities);
        });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, db, storeKey, updateEntities]);

  const updateEntity = async (entity: ObjectEntity) => {
    return db.collection('entities').doc(entity.id).update(entity);
  };

  return { entities, updateEntity };
}
