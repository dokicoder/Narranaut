import { Icon } from 'src/utils';
import { EntityId, ObjectEntity } from './Entity';
export interface RelationshipType {
  readonly id: string;

  icon?: Icon;
  color?: string;
  name: string;

  description?: string;

  // a label describing the relationship between the partners with placeholders {{p1}}, {{p2}} that are expanded. i.e. "{{p1}} is friends with {{p2}}" may expand to "John is friends with Simon"
  forwardName: string;
  // the relationship may be asymmetric (for example "owns, owned by", in this case, this label is shown when viewing the relationship on partner 2)
  backwardName?: string;
}

export interface Relationship {
  readonly id: EntityId;
  // corresponding user id
  uid: string;

  // the parties are stored redundantly in the relationship - the order matters here as the relationship need not be symmetric (e.g. father/son)
  // TODO: they need to be updated whenever an entity is changed - introducing cloud functions
  party1: ObjectEntity;
  party2: ObjectEntity;

  // id of relationship type
  typeId: string;

  deleted: boolean;
}
