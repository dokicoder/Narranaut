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

      return Promise.all(
        // delete relationships from old entities
        [
          changedBefore.length
            ? admin
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
                )
            : undefined,
          changedAfter.length
            ? admin
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
                      const curentRelationshipIds = entity.relationshipIds || [];

                      // only add id if not already included
                      if (curentRelationshipIds.includes(relationshipId)) {
                        return;
                      }

                      return doc.ref.update({
                        ...entity,
                        relationshipIds: [...curentRelationshipIds, relationshipId],
                      });
                    })
                  )
                )
            : undefined,
        ]
      );
    } catch (e) {
      functions.logger.error(e);
    }

    return null;
  });
