import * as admin from 'firebase-admin';
import { updateRelationships as updateRelationshipsOnEntityChange } from './updatesOnEntityChange';
import { updateEntitiesOfRelationship as updateEntitiesOmRelationshipChange } from './updatesOnRelationshipChange';

admin.initializeApp();

export const updateRelationships = updateRelationshipsOnEntityChange;
export const updateEntities = updateEntitiesOmRelationshipChange;
