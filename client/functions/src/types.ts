// TODO: share models between both projects
export interface Relationship {
  readonly id: string;
  uid: string;

  party1: ObjectEntity;
  party2: ObjectEntity;
}

export interface ObjectEntity {
  readonly id: string;
  uid: string;

  name: string;
  description?: string;

  relationshipIds: string[];
}
