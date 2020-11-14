/** @jsx jsx */
import React, { useState, useMemo } from 'react';
import { css, jsx } from '@emotion/core';

import { RelationshipCompactView } from '../RelationshipView';
import { useRelationshipStore } from 'src/hooks';
import { useEffect } from 'react';
import { Relationship } from 'src/models';
import { Button, Fade } from '@material-ui/core';
import { Replay as UndoIcon, Save as SaveIcon } from '@material-ui/icons';
import { MainTheme } from 'src/utils/themes';

interface Props {
  entityId?: string;
  relationshipIds?: string[];
}

export const EditableRelationshipList: React.FC<Props> = ({ entityId, relationshipIds }) => {
  const [relationships, updateRelationships] = useState<Relationship[]>([]);
  const { relationshipMap, updateRelationships: saveRelationships } = useRelationshipStore();

  useEffect(
    () => {
      updateRelationships(relationshipIds?.map(id => relationshipMap[id]).filter(Boolean) || []);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(relationshipIds || []), relationshipMap]
  );

  const updateRelationship = (relationship: Relationship) => {
    updateRelationships(relationships.map(r => (r.id === relationship.id ? relationship : r)));
  };

  const invalidatedFlags = useMemo(() => {
    return relationships.map(r => r !== relationshipMap[r.id]);
  }, [relationships, relationshipMap]);

  const invalidated = useMemo(() => invalidatedFlags.some(flag => flag), [invalidatedFlags]);

  return (
    <div
      css={css`
        margin-top: 20px;
      `}
    >
      <h3>RELATIONSHIPS</h3>
      {relationships.map((relationship, idx) => (
        <RelationshipCompactView
          cCss={
            invalidatedFlags[idx]
              ? css`
                  background-color: ${MainTheme.palette.primary.transparent};
                `
              : undefined
          }
          key={relationship.id}
          relationship={relationship}
          displayingEntityId={entityId}
          onUpdate={updateRelationship}
        />
      ))}
      <Fade in={invalidated}>
        <div
          css={css`
            margin-top: 20px;
            button {
              margin-right: 10px;
            }
          `}
        >
          <Button
            startIcon={<UndoIcon />}
            onClick={() => updateRelationships(relationshipIds?.map(id => relationshipMap[id]).filter(Boolean) || [])}
          >
            discard
          </Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            onClick={() => saveRelationships(relationships.filter((_, idx) => invalidatedFlags[idx]))}
          >
            save
          </Button>
        </div>
      </Fade>
    </div>
  );
};
