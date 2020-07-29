import { Entity, EntityId } from './Entity';

export interface Relationship extends Entity {
  with: EntityId;
}
