import { atom } from 'recoil';
import { ObjectEntity } from '../models/Entity';

export const CHARACTERS_STATE = 'CHARACTERS_STATE';

export const charactersState = atom<ObjectEntity[]>({
  key: CHARACTERS_STATE,
  default: undefined,
});
