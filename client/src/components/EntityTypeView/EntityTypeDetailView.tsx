/** @jsx jsx */
import React, { useReducer, useCallback, useMemo } from 'react';
import { css, jsx } from '@emotion/core';
import { Fade, Button, TextField } from '@material-ui/core';
import { Replay as UndoIcon, Save as SaveIcon } from '@material-ui/icons';
import { EntityType } from 'src/models';
import { onChangeWrapper } from '../../utils';
import { MainTheme } from './../../utils/themes';

function entityTypeUpdateReducer(state: Partial<EntityType>, updated: Partial<EntityType>) {
  return { ...state, ...updated };
}

const invalidatedStyle = (invalidated: boolean) =>
  invalidated
    ? `input {
    color: ${MainTheme.palette.primary.main} !important;
  }`
    : '';

interface Props {
  type: EntityType;
  onSave: (updatedType: EntityType) => void;
  onDiscard?: () => void;
}

export const EntityTypeDetailView: React.FC<Props> = ({ type, onSave, onDiscard }) => {
  const { id, ...typeSansId } = type;

  const [typeState, updateTypeState] = useReducer(entityTypeUpdateReducer, typeSansId);

  const isKeyInvalidated = useCallback((name: keyof EntityType, value: string) => type[name] !== value, [type]);

  const invalidated = useMemo(
    () => Object.entries(typeState).some(([key, value]) => isKeyInvalidated(key as keyof EntityType, value)),
    [typeState, isKeyInvalidated]
  );

  const saveChanges = () => {
    onSave({ ...type, ...typeState });
  };

  const discardChanges = () => {
    updateTypeState(typeSansId);
    onDiscard && onDiscard();
  };

  return (
    <React.Fragment>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: stretch;
        `}
      >
        {Object.entries(typeState).map(([key, value]) => (
          <TextField
            key={`type-${type.id}-${key}`}
            css={css`
              margin-top: 15px;
              ${invalidatedStyle(isKeyInvalidated(key as keyof EntityType, value))}
            `}
            id={`type-${type.id}-${key}`}
            name={`type-${type.id}-${key}`}
            value={value}
            onChange={onChangeWrapper(value => updateTypeState({ [key]: value }))}
            label={key}
            variant="outlined"
          />
        ))}
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
          <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveChanges}>
            Save
          </Button>
          <Button startIcon={<UndoIcon />} onClick={discardChanges}>
            Discard
          </Button>
        </div>
      </Fade>
    </React.Fragment>
  );
};
