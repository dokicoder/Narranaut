/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Button } from '@material-ui/core';
import { Breadcrumbs } from 'src/components';
import { useHistory } from 'react-router-dom';
import { useEntityTypeStore } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { pluralize } from 'src/utils';
import { EntityTypeDetailView } from 'src/components/EntityTypeView';

export const LandingPage: React.FC = () => {
  const history = useHistory();

  const { types, updateType } = useEntityTypeStore();

  const loading = types === null;

  return loading ? (
    <LoadingIndicator />
  ) : (
    <React.Fragment>
      <Breadcrumbs />
      <div
        css={css`
          margin-bottom: 20px;
        `}
      >
        TODO: LANDING PAGE
      </div>
      {types?.map(({ id, name }) => (
        <Button key={id} variant="contained" color="primary" onClick={() => history.push(`/${name}s`)}>
          {pluralize(name)}
        </Button>
      ))}
      {types.map(type => (
        <EntityTypeDetailView key={type.id} type={type} onSave={updateType} />
      ))}
    </React.Fragment>
  );
};
