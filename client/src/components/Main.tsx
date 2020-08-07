/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { css, jsx } from '@emotion/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { firebaseInstance, FirebaseContext, User } from '../firebase';
import { Header } from './Header';
import { Stories, Places, Events, Characters, Timelines, Relationships, Objects, SignIn } from './Screens';
import { centeredContainer } from '../styles';

const Main: React.FC = () => {
  const { auth } = firebaseInstance;
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <FirebaseContext.Provider value={firebaseInstance}>
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
              <Route path="/sign-in">
                <SignIn />
              </Route>
              {currentUser ? null : (
                <Route path="*">
                  <Redirect to="/sign-in" />
                </Route>
              )}
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
              <Route path="/">{currentUser ? <Redirect to="/characters" /> : <Redirect to="/sign-in" />}</Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </main>
        </BrowserRouter>
      </RecoilRoot>
    </FirebaseContext.Provider>
  );
};

export default Main;
