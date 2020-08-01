/** @jsx jsx */
import React from 'react';
import { RecoilRoot } from 'recoil';
import { css, jsx } from '@emotion/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects } from './Screens';
import { centeredContainer } from '../styles';

const Main: React.FC = () => (
  <RecoilRoot>
    <BrowserRouter>
      <header
        css={css`
          position: sticky;
          top: 0;
          z-index: 20;
        `}
      >
        <Header />
      </header>
      <main id="main-container" css={centeredContainer}>
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
  </RecoilRoot>
);

export default Main;
