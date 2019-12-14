import Entity from './entity';

export interface Event extends Entity {
  placeId?: string;
  characterIds: string[];
}
