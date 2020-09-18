/** @jsx jsx */
import React, { useReducer, useCallback, useMemo } from 'react';
import { css, jsx } from '@emotion/core';
import { Fade, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Replay as UndoIcon, Save as SaveIcon } from '@material-ui/icons';
import { EntityType } from 'src/models';
import { onChangeWrapper, Icon, Icons } from '../../utils';
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
  alwaysShowDiscard?: boolean;
  onSave: (updatedType: EntityType) => void;
  onDiscard?: () => void;
}

export const EntityTypeDetailView: React.FC<Props> = ({ type, onSave, onDiscard, alwaysShowDiscard }) => {
  const [typeState, updateTypeState] = useReducer(entityTypeUpdateReducer, type);

  const isKeyInvalidated = useCallback((name: keyof EntityType, value: string) => type[name] !== value, [type]);

  const invalidated = useMemo(
    () => Object.entries(typeState).some(([key, value]) => isKeyInvalidated(key as keyof EntityType, value)),
    [typeState, isKeyInvalidated]
  );

  const saveChanges = () => {
    onSave({ ...type, ...typeState });
  };

  const discardChanges = () => {
    updateTypeState(type);
    onDiscard && onDiscard();
  };

  const definedPropertyList: (keyof EntityType)[] = ['name', 'icon', 'color'];

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
              variant="outlined"
              css={css`
                margin-top: 15px;
                ${invalidatedStyle(isKeyInvalidated(key as keyof EntityType, value))}
              `}
            >
              <InputLabel id="demo-simple-select-outlined-label">icon</InputLabel>
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
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
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
          ) : (
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
      </div>
    </React.Fragment>
  );
};
