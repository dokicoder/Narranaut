import { Icon } from './../utils';
import { WithTags } from './WithTags';
import { WithRelationships } from './WithRelationships';
import { PropertyMap } from './Property';
import { WithImage } from './WithImage';

export type EntityId = string;

export interface EntityType {
  id: string;

  icon?: Icon;
  name: string;
}

export interface Entity extends WithImage {
  id: EntityId;
  type: EntityType;

  name: string;
  description?: string;

  properties: PropertyMap<string>;
}

export interface ObjectEntity extends Entity, WithRelationships, WithTags {}
