import 'fontsource-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { Main, ContextWrapper } from './components';
import { CssBaseline } from '@material-ui/core';

ReactDOM.render(
  <>
    <CssBaseline />
    <ContextWrapper>
      <Main />
    </ContextWrapper>
  </>,
  document.getElementById('root') as HTMLElement
);
