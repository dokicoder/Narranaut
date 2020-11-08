import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// TODO: share models between both projects
interface Relationship {
  readonly id: string;

  party1: ObjectEntity;
  party2: ObjectEntity;
}

interface ObjectEntity {
  readonly id: string;

  uid: string;
  relationshipIds: string[];
}

admin.initializeApp();

export const updateRelationships = functions.firestore
  .document('/entities/{entityId}')
  .onUpdate(async (change, context) => {
    try {
      const entity = change.after.data() as ObjectEntity;

      if (!entity.relationshipIds.length) {
        return null;
      }

      const snapshot = await admin
        .firestore()
        .collection('relationships')
        // only retrieve relationships bound to user of entity
        .where('uid', '==', entity.uid)
        // TODO: the "in" query is limited to arrays of max length 10. There could easily be more than 10 relationships
        .where('id', 'in', entity.relationshipIds)
        .get();

      return Promise.all(
        snapshot.docs.map(doc => {
          const relationship = { ...doc.data(), id: doc.id } as Relationship;

          const updateRelationship =
            relationship.party1.id === entity.id
              ? {
                  ...relationship,
                  party1: entity,
                }
              : {
                  ...relationship,
                  party2: entity,
                };

          return doc.ref.update(updateRelationship);
        })
      );
    } catch (e) {
      functions.logger.error(e);
    }

    return null;
  });
