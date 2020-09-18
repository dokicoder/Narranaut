/** @jsx jsx */
import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../../../firebase';
import { css, jsx } from '@emotion/core';
import { Redirect, useLocation } from 'react-router-dom';
import { useFirebaseUser, useMountedState } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { TextField } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

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

  const customOnChangeWrapper = <T extends HTMLInputElement | HTMLTextAreaElement>(
    handler: (value: string) => void
  ) => (event: React.ChangeEvent<T>) => {
    setSubmitted(false);
    handler(event.target.value);
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
    <form
      name={`${formMode}-form`}
      css={css`
        height: 60vh;
        display: grid;
        place-items: center;
      `}
    >
      <Paper
        elevation={3}
        css={css`
          width: 500px;
          padding: 30px;
          display: flex;
          flex-direction: column;
        `}
      >
        <h2>{formMode === 'sign-in' ? 'Login' : 'Register'}</h2>

        <TextField
          css={css`
            flex-grow: 1;
          `}
          id="email"
          name="email"
          value={email}
          onChange={customOnChangeWrapper(setEmail)}
          label="email"
          variant="outlined"
          type="email"
        />
        <TextField
          css={css`
            flex-grow: 1;
            margin-top: 15px;
          `}
          id="password"
          name="password"
          value={password}
          onChange={customOnChangeWrapper(setPassword)}
          label="password"
          variant="outlined"
          type="password"
        />
        {formMode === 'sign-up' && (
          <TextField
            css={css`
              flex-grow: 1;
              margin-top: 15px;
            `}
            id="password-repeat"
            name="password-repeat"
            value={passwordRepeat}
            onChange={customOnChangeWrapper(setPasswordRepeat)}
            label="repeat password"
            variant="outlined"
            type="password"
          />
        )}
        {formMode === 'sign-in' && (
          <Button
            css={css`
              margin-top: 15px;
            `}
            size="large"
            variant="contained"
            color="primary"
            onClick={onSignIn}
          >
            login
          </Button>
        )}
        {formMode === 'sign-in' && (
          <Button
            css={css`
              margin-top: 15px;
            `}
            size="large"
            onClick={() => setFormMode('sign-up')}
          >
            sign up
          </Button>
        )}
        {formMode === 'sign-up' && (
          <Button
            css={css`
              margin-top: 15px;
            `}
            size="large"
            variant="contained"
            color="primary"
            onClick={onRegister}
          >
            submit registration
          </Button>
        )}
        {formMode === 'sign-up' && (
          <Button
            css={css`
              margin-top: 15px;
            `}
            size="large"
            onClick={() => setFormMode('sign-in')}
          >
            login
          </Button>
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
      </Paper>
    </form>
  );
};
