import { Action, Article } from '../types';

export function addArticle(payload: Article): Action {
  return { type: 'ADD_ARTICLE', payload };
}

export function deleteArticle(payload: number): Action {
  return { type: 'DELETE_ARTICLE', payload };
}
