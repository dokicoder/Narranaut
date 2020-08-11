import { atomFamily } from 'recoil';
import { ObjectEntity } from '../models/Entity';

export const createEntityStore = atomFamily<ObjectEntity[], string>({
  key: 'ENTITIES',
  default: null,
});
