/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css } from '@emotion/core';
import { Button, Paper, Fab, Collapse } from '@material-ui/core';
import { Breadcrumbs } from 'src/components';
import { useHistory } from 'react-router-dom';
import { useEntityTypeStore } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { pluralize } from 'src/utils';
import { EntityTypeDetailView } from 'src/components/EntityTypeView';
import { useState } from 'react';
import { EntityType } from 'src/models';
import { Add as AddIcon } from '@material-ui/icons';

export const LandingPage: React.FC = () => {
  const history = useHistory();

  const { types, updateType, addType } = useEntityTypeStore();

  const loading = types === null;

  const [entityTypeEditCandidate, updateEntityTypeEditCandidate] = useState<EntityType>();

  const emptyEtityType = (): EntityType => ({
    id: 'ignored',
    name: '',
    icon: 'VESSEL',
    color: '',
  });

  const sortedTypes = useMemo(
    () => (types ? [...types].sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB)) : []),
    [types]
  );

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
      {sortedTypes.map(({ id, name }) => (
        <Button
          css={css`
            margin-right: 10px;
          `}
          key={id}
          variant="contained"
          color="primary"
          onClick={() => history.push(`/${name}s`)}
        >
          {pluralize(name)}
        </Button>
      ))}
      <div
        css={css`
          margin-top: 40px;
          margin-bottom: 10px;
        `}
      >
        DEBUG EDITING TOOL FOR ENTITY TYPES - TODO: REMOVE (OR HIDE BEHIND ADMINISTRATION USER RIGHTS)
      </div>
      {types.map(type => (
        <Paper
          key={type.id}
          elevation={2}
          css={css`
            padding: 20px;
            margin-top: 20px;
          `}
        >
          <EntityTypeDetailView type={type} onSave={updateType} />
        </Paper>
      ))}
      <Collapse in={!entityTypeEditCandidate}>
        <div
          css={css`
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <Fab size="small" color="primary" onClick={() => updateEntityTypeEditCandidate(emptyEtityType())}>
            <AddIcon />
          </Fab>
        </div>
      </Collapse>
      <Collapse in={!!entityTypeEditCandidate}>
        <Paper
          elevation={2}
          css={css`
            padding: 20px;
            margin-top: 20px;
          `}
        >
          {entityTypeEditCandidate && (
            <EntityTypeDetailView
              alwaysShowDiscard={true}
              type={entityTypeEditCandidate}
              onSave={newType => {
                addType(newType);
                updateEntityTypeEditCandidate(undefined);
              }}
              onDiscard={() => {
                updateEntityTypeEditCandidate(undefined);
              }}
            />
          )}
        </Paper>
      </Collapse>
    </React.Fragment>
  );
};
