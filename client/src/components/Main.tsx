/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from '.';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects } from './Screens';

const Main: React.FC = () => (
  <BrowserRouter>
    <header
      css={css`
        position: sticky;
        top: 0;
      `}
    >
      <Header />
    </header>
    <main
      id="main-container"
      css={css`
        padding: 10px;
      `}
    >
      <Switch>
        <Route path="/stories">
          <Stories />
        </Route>
        <Route path="/characters">
          <Characters />
        </Route>
        <Route path="/events">
          <Events />
        </Route>
        <Route path="/places">
          <Places />
        </Route>
        <Route path="/timelines">
          <Timelines />
        </Route>
        <Route path="/relationships">
          <Relationships />
        </Route>
        <Route path="/objects">
          <Objects />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </main>
  </BrowserRouter>
);

export default Main;
