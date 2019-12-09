/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header, Sidebar } from '.';
import { Stories, Places, Events, Characters, Timelines } from './Screens';

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
      `}
    >
      <div
        id="sidebar"
        className="p-2"
        css={css`
          background-color: #aaa;
          flex: 0 1 auto;
          width: 200px;
        `}
      >
        <Sidebar />
      </div>
      <main
        id="viewContainer"
        className="p-2"
        css={css`
          flex: 1 1 auto;
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
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </div>
    <footer
      css={css`
        background-color: #333;
        color: white;
      `}
    >
      footer
    </footer>
  </BrowserRouter>
);

export default Main;
