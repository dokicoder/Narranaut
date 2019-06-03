export interface Article {
  title: string;
  id: number;
}

export interface State {
  articles: Article[];
}

export type Action =
  | { type: 'ADD_ARTICLE'; payload: Article }
  | { type: 'DELETE_ARTICLE'; payload: number };
