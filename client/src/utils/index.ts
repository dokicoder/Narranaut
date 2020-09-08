export * from './icons';
export * from './form';
export * from './themes';

export const singularize = (plural: string) => plural.slice(0, -1);
export const pluralize = (singular: string) => `${singular}s`;
