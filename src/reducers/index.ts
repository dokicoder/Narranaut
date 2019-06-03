import { Action, State } from '../types';

const initialState: State = {
  articles: []
};

function rootReducer(state: State = initialState, action: Action) {
  if (action.type === 'ADD_ARTICLE') {
    return {
      articles: [...state.articles, action.payload]
    };
  }
  if (action.type === 'DELETE_ARTICLE') {
    return {
      articles: state.articles.filter(a => a.id !== action.payload)
    };
  }
  return state;
}

export default rootReducer;
