import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import Main from './components/Main';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
