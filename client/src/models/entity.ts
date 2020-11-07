import { Icon } from '../utils';
import { WithTags } from './WithTags';
import { WithRelationships } from './WithRelationships';
import { PropertyMap } from './Property';
import { WithImage } from './WithImage';

export type EntityId = string;

export interface EntityType {
  readonly id: string;

  icon?: Icon;
  color?: string;
  name: string;
}

export interface Entity extends WithImage {
  readonly id: EntityId;
  // corresponding user id
  uid: string;

  type: EntityType;

  name: string;
  description?: string;

  properties: PropertyMap<string>;

  deleted: boolean;
}

export interface ObjectEntity extends Entity, WithRelationships, WithTags {}
