import React from 'react';
import * as ReactDOM from 'react-dom';
import store from './store';
import { addArticle } from './actions';
import App from './components/App';
import { Provider } from 'react-redux';

(window as any).store = store;
(window as any).addArticle = addArticle;

store.subscribe(() => console.log('Look ma, Redux!!'));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
