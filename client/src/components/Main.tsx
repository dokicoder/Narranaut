/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from '.';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects } from './Screens';

const Main: React.FunctionComponent = () => (
  <BrowserRouter>
    <header>
      <Header />
    </header>
    <div
      id="main-container"
      css={css`
        display: flex;
        flex-direction: row;
        align-items: stretch;
        height: 100%;
      `}
    >
      <main
        id="viewContainer"
        className="p-2"
        css={css`
          flex: 1 1 auto;
          overflow: hidden;
          min-height: 480px;
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
    </div>
  </BrowserRouter>
);

export default Main;
