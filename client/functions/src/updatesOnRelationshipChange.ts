import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Relationship, ObjectEntity } from './types';

export const updateEntitiesOfRelationship = functions.firestore
  .document('/relationships/{relationshipId}')
  .onWrite(async change => {
    try {
      const relationshipBefore = (change.before.data() || { party1: {}, party2: {} }) as Relationship;
      const relationshipAfter = (change.after.data() || { party1: {}, party2: {} }) as Relationship;

      const relationshipId = change.after?.id;

      const { party1: party1Before, party2: party2Before } = relationshipBefore;
      const { party1: party1After, party2: party2After } = relationshipAfter;

      const changedBefore = [
        party1Before.id !== party1After.id && party1Before.id,
        party2Before.id !== party2After.id && party2Before.id,
      ].filter(Boolean);

      const changedAfter = [
        party1Before.id !== party1After.id && party1After.id,
        party2Before.id !== party2After.id && party2After.id,
      ].filter(Boolean);

      if (changedBefore.length) {
        // delete relationships from old entities
        await admin
          .firestore()
          .collection('entities')
          // only retrieve relationships bound to user of entity
          .where('uid', '==', relationshipAfter.uid)
          .where('id', 'in', changedBefore)
          .get()
          .then(({ docs }) =>
            Promise.all(
              docs.map(doc => {
                const entity = { ...doc.data(), id: doc.id } as ObjectEntity;

                return doc.ref.update({
                  ...entity,
                  relationshipIds: (entity.relationshipIds || []).filter(id => id !== relationshipId),
                });
              })
            )
          );
      }

      if (changedAfter.length) {
        // add relationships to new entities
        await admin
          .firestore()
          .collection('entities')
          // only retrieve relationships bound to user of entity
          .where('uid', '==', relationshipAfter.uid)
          .where('id', 'in', changedAfter)
          .get()
          .then(({ docs }) =>
            Promise.all(
              docs.map(doc => {
                const entity = { ...doc.data(), id: doc.id } as ObjectEntity;

                return doc.ref.update({
                  ...entity,
                  relationshipIds: [...(entity.relationshipIds || []), relationshipId],
                });
              })
            )
          );
      }
    } catch (e) {
      functions.logger.error(e);
    }

    return null;
  });
