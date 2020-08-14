import 'fontsource-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { Main, ContextWrapper } from './components';

import './index.scss';

ReactDOM.render(
  <ContextWrapper>
    <Main />
  </ContextWrapper>,
  document.getElementById('root') as HTMLElement
);
