/** @jsx jsx */
import React, { useState, useMemo } from 'react';
import { css, jsx } from '@emotion/core';

import { RelationshipCompactView } from '../RelationshipView';
import { useRelationshipStore } from 'src/hooks';
import { useEffect } from 'react';
import { Relationship } from 'src/models';
import { Button, Fade } from '@material-ui/core';
import { Replay as UndoIcon, Save as SaveIcon, Add as AddIcon } from '@material-ui/icons';
import { MainTheme } from 'src/utils/themes';
import { Fab } from '@material-ui/core';
import { useFirebaseUser } from './../../hooks/firebase';
import { useCallback } from 'react';
import { useRelationshipTypeStore } from 'src/hooks';
import { ObjectEntity } from 'src/models';

interface Props {
  entity?: ObjectEntity;
  relationshipIds?: string[];
}

export const EditableRelationshipList: React.FC<Props> = ({ entity, relationshipIds }) => {
  const entityId = entity?.id;

  const [relationships, updateRelationships] = useState<Relationship[]>([]);
  const { relationshipMap, updateRelationships: saveRelationships } = useRelationshipStore();

  const { types } = useRelationshipTypeStore();

  const user = useFirebaseUser();

  const relationshipTemplate = useCallback(
    (): Relationship =>
      user
        ? (({
            uid: user.uid,
            name: '',
            typeId: types[0]?.id,
            description: '',
            party1: entity || {},
            party2: {},
            forwardName: '',
            deleted: false,
          } as unknown) as Relationship)
        : undefined,
    [user, entity, types]
  );

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

  const invalidated = useMemo(
    () => relationships.length !== Object.values(relationshipMap).length || invalidatedFlags.some(flag => flag),
    [invalidatedFlags, relationships, relationshipMap]
  );

  const undoChanges = () => {
    updateRelationships(relationshipIds?.map(id => relationshipMap[id]).filter(Boolean) || []);
  };

  const saveChanges = () => {
    saveRelationships(relationships.filter((_, idx) => invalidatedFlags[idx]));
  };

  const saveButtonDisabled = useMemo(() => !relationships?.every(r => r.party1.id && r.party2.id), [relationships]);

  return (
    <div
      css={css`
        margin-top: 20px;
      `}
    >
      <h3>RELATIONSHIPS</h3>
      <div
        css={css`
          display: grid;
          grid-gap: 15px;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        `}
      >
        {relationships.map(
          (relationship, idx) =>
            (
              <RelationshipCompactView
                cCss={
                  invalidatedFlags[idx]
                    ? css`
                        background-color: ${MainTheme.palette.primary.transparent};
                      `
                    : undefined
                }
                key={relationship.id || idx}
                relationship={relationship}
                displayingEntityId={entityId}
                onUpdate={updateRelationship}
              />
            ) || 'did not render'
        )}
        <div
          css={css`
            width: 340px;
            min-height: 170px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
          `}
        >
          <Fab size="small" color="primary">
            <AddIcon onClick={() => updateRelationships([...relationships, relationshipTemplate()])} />
          </Fab>
        </div>
      </div>

      <Fade in={invalidated}>
        <div
          css={css`
            margin-top: 20px;
            button {
              margin-right: 10px;
            }
          `}
        >
          <Button startIcon={<UndoIcon />} onClick={undoChanges}>
            discard
          </Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            onClick={saveChanges}
            disabled={saveButtonDisabled}
          >
            save
          </Button>
        </div>
      </Fade>
    </div>
  );
};
