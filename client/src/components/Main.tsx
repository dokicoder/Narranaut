/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { Header } from './Header';
import { Stories, DefaultEntityOverview, Timelines, Relationships, Objects, SignIn, LandingPage } from './Screens';
import { centeredContainer } from '../styles';
import { useFirebaseUser } from 'src/hooks';
import { MainTheme } from './../utils/themes';
import { Paper } from '@material-ui/core';
import Events from './Screens/Events/Events';

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

const theme = createMuiTheme(MainTheme);

export const Main: React.FC = () => {
  const user = useFirebaseUser();

  return (
    <ThemeProvider theme={theme}>
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
        <Paper
          css={css`
            padding: 50px;
          `}
        >
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
            <Route path="/timelines">
              <Timelines />
            </Route>
            <Route path="/events">
              <Events />
            </Route>
            <Route path="/relationships">
              <Relationships />
            </Route>
            <Route path="/:entityType/:entityId?">
              <DefaultEntityOverview />
            </Route>
            <Route path="/objects">
              <Objects />
            </Route>
            <Route path="/" exact>
              <LandingPage />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Paper>
      </main>
    </ThemeProvider>
  );
};
