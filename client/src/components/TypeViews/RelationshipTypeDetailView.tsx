/** @jsx jsx */
import React, { useReducer, useCallback, useMemo } from 'react';
import { css, jsx } from '@emotion/core';
import { Fade, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@material-ui/core';
import { Replay as UndoIcon, Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { RelationshipType } from 'src/models';
import { onChangeWrapper, Icon, Icons } from '../../utils';
import { MainTheme } from '../../utils/themes';

function relationshipTypeUpdateReducer(state: Partial<RelationshipType>, updated: Partial<RelationshipType>) {
  return { ...state, ...updated };
}

const invalidatedStyle = (invalidated: boolean) =>
  invalidated
    ? `input {
    color: ${MainTheme.palette.primary.main} !important;
  }`
    : '';

const invalidatedStyleMultiSelect = (invalidated: boolean) =>
  invalidated
    ? `div.MuiSelect-root {
    color: ${MainTheme.palette.primary.main} !important;
  }`
    : '';

const definedPropertyList: (keyof RelationshipType)[] = [
  'name',
  'description',
  'forwardName',
  'backwardName',
  'icon',
  'color',
];

interface Props {
  type: RelationshipType;
  alwaysShowDiscard?: boolean;
  onSave: (updatedType: RelationshipType) => void;
  onDiscard?: () => void;
  onDelete?: () => void;
}

export const RelationshipTypeDetailView: React.FC<Props> = ({
  type,
  onSave,
  onDiscard,
  onDelete,
  alwaysShowDiscard,
}) => {
  const [typeState, updateTypeState] = useReducer(relationshipTypeUpdateReducer, type);

  const isKeyInvalidated = useCallback((name: keyof RelationshipType, value: string) => type[name] !== value, [type]);

  const invalidated = useMemo(
    () => Object.entries(typeState).some(([key, value]) => isKeyInvalidated(key as keyof RelationshipType, value)),
    [typeState, isKeyInvalidated]
  );

  const saveChanges = () => {
    onSave({ ...type, ...typeState });
  };

  const discardChanges = () => {
    updateTypeState(type);
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
        {definedPropertyList.map(key => {
          const value = typeState[key];

          return key === 'icon' ? (
            <FormControl
              key={`type-${type.id}-${key}`}
              variant="outlined"
              css={css`
                margin-top: 15px;
                ${invalidatedStyleMultiSelect(isKeyInvalidated(key as keyof RelationshipType, value))}
              `}
            >
              <InputLabel id="icon-select-label">icon</InputLabel>
              <Select
                css={css`
                  div > img {
                    position: absolute;
                    margin-left: 20px;
                    height: 30px;
                    transform: translateY(-50%);
                    top: 50%;
                  }
                `}
                labelId="icon-select-label"
                id="icon-select"
                value={value}
                onChange={onChangeWrapper(value => updateTypeState({ [key]: value as Icon }))}
                label="Age"
              >
                {Object.keys(Icons).map(val => {
                  const iconSrc = Icons[val as Icon];

                  return (
                    <MenuItem
                      css={css`
                        img {
                          position: absolute;
                          margin-left: 150px;
                          height: 30px;
                          transform: translateX(-50%);
                        }
                      `}
                      key={val}
                      value={val}
                    >
                      {val}
                      {iconSrc && <img src={iconSrc} />}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : key === 'color' ? (
            <div
              key={`type-${type.id}-${key}`}
              css={css`
                margin-top: 15px;
                position: relative;
                display: inline-flex;
              `}
            >
              <TextField
                css={css`
                  width: 100%;
                  ${invalidatedStyle(isKeyInvalidated(key as keyof RelationshipType, value))};
                `}
                id={`type-${type.id}-${key}`}
                name={`type-${type.id}-${key}`}
                value={value}
                onChange={onChangeWrapper(value => updateTypeState({ [key]: value }))}
                label={key}
                variant="outlined"
              />
              <div
                css={css`
                  position: absolute;
                  transform: translateY(-50%);
                  top: 50%;
                  left: 120px;
                  width: 30px;
                  height: 30px;
                  border-radius: 5px;
                  background-color: ${value};
                `}
              />
            </div>
          ) : (
            <TextField
              key={`type-${type.id}-${key}`}
              css={css`
                margin-top: 15px;
                ${invalidatedStyle(isKeyInvalidated(key as keyof RelationshipType, value))}
              `}
              id={`type-${type.id}-${key}`}
              name={`type-${type.id}-${key}`}
              value={value}
              onChange={onChangeWrapper(value => updateTypeState({ [key]: value }))}
              label={key}
              variant="outlined"
            />
          );
        })}
      </div>

      <div
        css={css`
          margin-top: 20px;
          button {
            margin-right: 10px;
          }
        `}
      >
        <Fade in={alwaysShowDiscard || invalidated}>
          <Button startIcon={<UndoIcon />} onClick={discardChanges}>
            Discard
          </Button>
        </Fade>
        <Fade in={invalidated}>
          <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveChanges}>
            Save
          </Button>
        </Fade>
        {onDelete && (
          <IconButton
            css={css`
              float: right;
              position: relative;
              bottom: 8px;
            `}
            aria-label="remove property"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </React.Fragment>
  );
};
