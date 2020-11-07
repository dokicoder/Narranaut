/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css } from '@emotion/core';
import { Button, Paper, Fab, Collapse, Snackbar, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { useEntityTypeStore } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { pluralize } from 'src/utils';
import { EntityTypeDetailView } from 'src/components/TypeViews';
import { useState } from 'react';
import { EntityType } from 'src/models';
import { Add as AddIcon } from '@material-ui/icons';

export const EntityTypeList: React.FC = () => {
  const history = useHistory();

  const { types, updateType, addType } = useEntityTypeStore();

  const loading = !types;

  const [entityTypeEditCandidate, updateEntityTypeEditCandidate] = useState<EntityType>();

  const [showDeleteNotImplementedInfo, setShowDeleteNotImplementedInfo] = React.useState(false);

  const emptyEntityType = (): EntityType => ({
    id: 'ignored',
    name: '',
    icon: 'VESSEL',
    color: '',
  });

  const sortedTypes = useMemo(
    () => (types ? [...types].sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB)) : []),
    [types]
  );

  return (
    <React.Fragment>
      {loading && <LoadingIndicator />}
      <Fade in={!loading}>
        <div>
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
          {sortedTypes.map(type => (
            <Paper
              key={type.id}
              elevation={2}
              css={css`
                padding: 20px;
                margin-top: 20px;
              `}
            >
              <EntityTypeDetailView
                type={type}
                onSave={updateType}
                onDelete={() => setShowDeleteNotImplementedInfo(true)}
              />
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
              <Fab size="small" color="primary" onClick={() => updateEntityTypeEditCandidate(emptyEntityType())}>
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
        </div>
      </Fade>
      <Snackbar
        open={showDeleteNotImplementedInfo}
        autoHideDuration={8000}
        onClose={() => setShowDeleteNotImplementedInfo(false)}
      >
        <Alert severity="info">
          Deletion of Types is discouraged. If you know what you&apos;re doing, use the Developer Console
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
