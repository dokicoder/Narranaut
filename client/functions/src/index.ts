import * as admin from 'firebase-admin';
import updateRelationshipsCloudFunction from './updateRelationships';

admin.initializeApp();

export const updateRelationships = updateRelationshipsCloudFunction;
