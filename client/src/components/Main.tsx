/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { Header } from './Header';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects, SignIn, LandingPage } from './Screens';
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

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#2ecc7',
      main: '#27ae60',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#16a045',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
});

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
          <Route path="/characters/:entityId?">
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
            <LandingPage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </ThemeProvider>
  );
};
