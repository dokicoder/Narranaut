import Entity from './entity';

export type Gender = 'male' | 'female' | 'transgender' | 'agender' | 'other';

export interface Character extends Entity {
  age: number;
  gender: Gender;
}
