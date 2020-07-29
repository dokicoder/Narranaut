export type PropertyId = string;

export interface Property<T> {
  name: string;
  value: T;
}

export type PropertyMap<T> = Record<PropertyId, Property<T>>;
