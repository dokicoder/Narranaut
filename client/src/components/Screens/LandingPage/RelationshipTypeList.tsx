/** @jsx jsx */
import React, { useState } from 'react';
import { jsx, css } from '@emotion/core';
import { Paper, Collapse, Snackbar, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useRelationshipTypeStore } from 'src/hooks';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { RelationshipTypeDetailView } from 'src/components/TypeViews';
import { RelationshipType } from 'src/models';
import { Chip } from '@material-ui/core';
import { AddButton } from 'src/components/Reusable';

export const RelationshipTypeList: React.FC = () => {
  const { types, updateType, addType } = useRelationshipTypeStore();

  const loading = !types;

  const [relationshipTypeEditCandidate, updateRelationshipTypeEditCandidate] = useState<RelationshipType>();

  const [showDeleteNotImplementedInfo, setShowDeleteNotImplementedInfo] = React.useState(false);

  const emptyRelationshipType = (): RelationshipType => ({
    id: 'ignored',
    name: '',
    icon: 'LINK',
    color: '',
    forwardName: '',
  });

  return (
    <React.Fragment>
      {loading && <LoadingIndicator />}
      <Fade in={!loading}>
        <div
          css={css`
            margin-top: 60px;
          `}
        >
          {types?.map(type => (
            <Chip
              css={css`
                margin-right: 5px;
              `}
              key={`relationship-${type.id}`}
              label={type.name}
            />
          ))}
          <div
            css={css`
              margin-top: 40px;
              margin-bottom: 10px;
            `}
          >
            DEBUG EDITING TOOL FOR RELATIONSHIP TYPES - TODO: REMOVE (OR HIDE BEHIND ADMINISTRATION USER RIGHTS)
          </div>
          {types?.map(type => (
            <Paper
              key={type.id}
              elevation={2}
              css={css`
                padding: 20px;
                margin-top: 20px;
              `}
            >
              <RelationshipTypeDetailView
                type={type}
                onSave={updateType}
                onDelete={() => setShowDeleteNotImplementedInfo(true)}
              />
            </Paper>
          ))}
          <Collapse in={!relationshipTypeEditCandidate}>
            <AddButton
              size="small"
              cCss={css`
                margin-top: 50px;
              `}
              onClick={() => updateRelationshipTypeEditCandidate(emptyRelationshipType())}
            />
          </Collapse>
          <Collapse in={!!relationshipTypeEditCandidate}>
            <Paper
              elevation={2}
              css={css`
                padding: 20px;
                margin-top: 20px;
              `}
            >
              {relationshipTypeEditCandidate && (
                <RelationshipTypeDetailView
                  alwaysShowDiscard={true}
                  type={relationshipTypeEditCandidate}
                  onSave={newType => {
                    addType(newType);
                    updateRelationshipTypeEditCandidate(undefined);
                  }}
                  onDiscard={() => {
                    updateRelationshipTypeEditCandidate(undefined);
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
