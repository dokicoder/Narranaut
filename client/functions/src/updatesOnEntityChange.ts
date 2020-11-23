import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { splitToChunks } from './utils';
import { ObjectEntity, Relationship } from './types';

const updateRelationshipsChunk = (entity: ObjectEntity) => async (relationshipIds: string[]) => {
  const snapshot = await admin
    .firestore()
    .collection('relationships')
    // only retrieve relationships bound to user of entity
    .where('uid', '==', entity.uid)
    // the "in" query is limited to arrays of max length 10
    .where('id', 'in', relationshipIds)
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
};

export const updateRelationships = functions.firestore.document('/entities/{entityId}').onUpdate(async change => {
  try {
    const beforeEntity = change.before.data() as ObjectEntity;
    const entity = change.after.data() as ObjectEntity;

    // only update when properties relevant for display for relationship change
    // TODO: these might change when the detail view of relationships is implemented
    if (beforeEntity.name === entity.name && beforeEntity.description === entity.description) {
      return null;
    }

    if (!entity.relationshipIds?.length) {
      return null;
    }

    const updater = updateRelationshipsChunk(entity);
    const chunks: string[][] = splitToChunks(entity.relationshipIds);

    return Promise.all(chunks.map(updater));
  } catch (e) {
    functions.logger.error(e);
  }

  return null;
});
