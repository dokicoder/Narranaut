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
import { useFirebaseUser } from '../../hooks/firebase';
import { useCallback } from 'react';
import { useRelationshipTypeStore } from 'src/hooks';
import { ObjectEntity } from 'src/models';
import { AddButton } from '../Reusable';

interface Props {
  entity?: ObjectEntity;
  relationshipIds?: string[];
}

export const EditableRelationshipList: React.FC<Props> = ({ entity, relationshipIds }) => {
  const entityId = entity?.id;

  const [relationships, updateRelationships] = useState<Relationship[]>([]);
  const { relationshipMap, addRelationships: saveRelationships, reallyDeleteRelationships } = useRelationshipStore();

  const { types } = useRelationshipTypeStore();

  const user = useFirebaseUser();

  const relationshipTemplate = useCallback(
    (): Relationship =>
      user
        ? (({
            uid: user.uid,
            typeId: types[0]?.id,
            party1: entity || {},
            party2: {},
            deleted: false,
          } as unknown) as Relationship)
        : undefined,
    [user, entity, types]
  );

  const relationshipsUnaltered = useMemo(() => {
    return relationshipIds?.map(id => relationshipMap[id]).filter(Boolean) || [];
  }, [relationshipIds, relationshipMap]);

  useEffect(
    () => {
      updateRelationships(relationshipsUnaltered);
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
    () => relationships.length !== relationshipsUnaltered.length || invalidatedFlags.some(flag => flag),
    [invalidatedFlags, relationships, relationshipsUnaltered.length]
  );

  const undoChanges = () => {
    updateRelationships(relationshipIds?.map(id => relationshipMap[id]).filter(Boolean) || []);
  };

  const saveChanges = async () => {
    const invalidatedRelationships = relationships.filter((_, idx) => invalidatedFlags[idx]);

    const deletedRelationships = relationshipsUnaltered.filter(ur => !relationships.find(r => r.id === ur.id));
    reallyDeleteRelationships(deletedRelationships);

    saveRelationships(invalidatedRelationships);
    // this is just an optimistic update before the firebase cloud function adds them
    updateRelationships(relationships);
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
                canSelectNonDisplayingEntity={!relationship.id}
                onUpdate={updateRelationship}
                onDelete={
                  relationship.id && (() => updateRelationships(relationships.filter(r => r.id !== relationship.id)))
                }
              />
            ) || 'did not render' // for debugging purposes. Should never render - TODO: remove
        )}
        <AddButton
          size="small"
          cCss={css`
            width: 400px;
            min-height: 170px;
            transition: 0.4s ease-in-out background-color;
            :hover {
              background-color: #00000010;
            }
          `}
          onClick={() => updateRelationships([...relationships, relationshipTemplate()])}
        />
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
