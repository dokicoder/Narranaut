/** @jsx jsx */
import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../../../firebase';
import { css, jsx } from '@emotion/core';
import { Redirect, useLocation } from 'react-router-dom';
import { useFirebaseUser, useMountedState } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { onChangeWrapper } from 'src/utils';

export const SignIn: React.FC = () => {
  const { registerUser, signIn } = useContext(FirebaseContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [signInError, setSignInError] = useState<Error>();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const isMounted = useMountedState();

  const [formMode, setFormMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  const { state: locationState } = useLocation<{ referrer: string }>();

  const user = useFirebaseUser(() => {
    isMounted() && setLoading(false);
  });

  const invalidateWrapper = (handler: (value: string) => void) => {
    setSubmitted(false);
    return handler;
  };

  const onRegister = () => {
    registerUser(email, password)
      .then(() => {
        setSignInError(undefined);
      })
      .catch(error => {
        setSignInError(error);
      });
    setLoading(true);
    setSubmitted(true);
  };

  const onSignIn = () => {
    signIn(email, password)
      .then(() => {
        isMounted() && setSignInError(undefined);
      })
      .catch(error => {
        isMounted() && setSignInError(error);
      });
    setLoading(true);
    setSubmitted(true);
  };

  const validator = () => {
    if (password.length < 8) return 'the password should have a length of at least 8';
    if (!/^.*@.*\..*$/.test(email)) return 'the email seems to be malformed';

    return null;
  };

  const error = signInError?.message || submitted ? validator() : undefined;

  if (user) {
    return <Redirect to={locationState?.referrer || '/'} />;
  }

  return loading ? (
    <LoadingIndicator />
  ) : (
    <div
      css={css`
        height: 80vh;
        display: grid;
        place-items: center;
      `}
    >
      <div
        className="card"
        css={css`
          width: 400px;
          padding: 14px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
        `}
      >
        <header>
          <h3>{formMode === 'sign-in' ? 'Login' : 'Register'}</h3>
        </header>
        <footer>
          <fieldset
            name={`${formMode}-form`}
            css={css`
              input,
              button {
                margin-top: 8px;
              }
              button {
                display: block;
                width: 100%;
              }
              button::first-of-type {
                margin-top: 20px;
              }
            `}
          >
            <label>
              <input
                name="username"
                value={email}
                onChange={onChangeWrapper(invalidateWrapper(setEmail))}
                type="email"
                placeholder="Email"
              />
            </label>
            <label>
              <input
                name="password"
                value={password}
                onChange={onChangeWrapper(invalidateWrapper(setPassword))}
                type="password"
                placeholder="Password"
              />
            </label>
            {formMode === 'sign-up' && (
              <label>
                <input
                  name="password-repeat"
                  value={passwordRepeat}
                  onChange={onChangeWrapper(invalidateWrapper(setPasswordRepeat))}
                  type="password"
                  placeholder="Repeat Password"
                />
              </label>
            )}
            {formMode === 'sign-in' && <button onClick={onSignIn}>Login</button>}
            {formMode === 'sign-in' && (
              <button onClick={() => setFormMode('sign-up')} className="pseudo">
                Sign Up
              </button>
            )}

            {formMode === 'sign-up' && <button onClick={onRegister}>Submit Registration</button>}
            {formMode === 'sign-up' && (
              <button onClick={() => setFormMode('sign-in')} className="pseudo">
                Login
              </button>
            )}

            {signInError && (
              <label
                css={css`
                  color: #dd2200;
                `}
                className="error"
                htmlFor="sign-in"
              >
                {error}
              </label>
            )}
          </fieldset>
        </footer>
      </div>
    </div>
  );
};
