/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects, SignIn } from './Screens';
import { centeredContainer } from '../styles';
import { useFirebaseUser } from 'src/hooks';

const ToSignInWithReferrer: React.FC = () => {
  const location = useLocation();

  return (
    <Redirect
      to={{
        pathname: '/sign-in',
        state: { referrer: location },
      }}
    />
  );
};

export const Main: React.FC = () => {
  const user = useFirebaseUser();

  return (
    <React.Fragment>
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
          <Route path="/sign-in">
            <SignIn />
          </Route>
          {user === null ? (
            <Route path="*">
              <ToSignInWithReferrer />
            </Route>
          ) : null}
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
          <Route path="/" exact>
            <div>TODO: LANDING PAGE</div>
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </React.Fragment>
  );
};
