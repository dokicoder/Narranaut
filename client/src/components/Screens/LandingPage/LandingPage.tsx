/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Breadcrumbs } from 'src/components';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

export const LandingPage: React.FC = () => {
  const history = useHistory();

  return (
    <React.Fragment>
      <Breadcrumbs />
      <div>TODO: LANDING PAGE</div>
      <Button variant="contained" color="primary" onClick={() => history.push('/characters')}>
        Characters
      </Button>
    </React.Fragment>
  );
};
