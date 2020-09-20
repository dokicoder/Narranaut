/** @jsx jsx */
import produce from 'immer';
import React, { useReducer, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { css, jsx } from '@emotion/core';
import { Add as AddIcon, Clear as ClearIcon, Delete as DeleteIcon, Check as CheckIcon } from '@material-ui/icons';
import { TextField, Fab, Collapse, IconButton, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { onChangeWrapper, MainTheme } from '../../utils';

interface Props {
  // properties to display as key/value pair map
  propertyMap: Record<string, string>;
  // triggered ever time the validation state changes (changing the props invalidates them, undoing all changes validates the data again)
  onChangeInvalidationState: (valid: boolean) => void;
  // triggered every tine the property map is changed (even when the original state of the data is restored)
  onChangePropertyMap: (updatedMap: Record<string, string>) => void;
}

interface IPropsUpdateAction {
  updated: Record<string, string>;
  mode?: 'extend' | 'replace' | 'remove';
}

function propsStateUpdateReducer(state: Record<string, string>, { updated, mode = 'extend' }: IPropsUpdateAction) {
  // default - no value gets overridden to 'extend'
  if (mode === 'extend') {
    return { ...state, ...updated };
  }
  if (mode === 'replace') {
    // TODO: this could be used to do the proper collapse animation when discarding property edits - you just have to figure out how to trigger it
    const undefinedMap = Object.keys(state).reduce<Record<string, string>>((acc, key) => {
      acc[key] = undefined;

      return acc;
    }, {});

    return { ...undefinedMap, ...updated };
  }
  if (mode === 'remove') {
    const result = { ...state };
    for (const key in updated) result[key] = undefined;

    return result;
  }
}

export const EditablePropertyList: React.FC<Props> = ({
  propertyMap,
  onChangeInvalidationState,
  onChangePropertyMap,
}) => {
  const [entityProps, updateEntityProps] = useReducer(propsStateUpdateReducer, propertyMap);
  const invalidationState = useRef(true);

  useEffect(() => {
    onChangePropertyMap(entityProps);
  }, [onChangePropertyMap, entityProps]);

  const isPropInvalidated = useCallback(
    // all new props are also marked as invalidated
    (name: string, value: string) => propertyMap[name] !== value || propertyMap[name] === undefined,
    [propertyMap]
  );
  const propsInvalidated = useMemo(
    () =>
      Object.keys(entityProps)
        // the filtering is for newly added property keys that were deleted again aterwards (they have a value of undefined and get discarded only after save)
        .filter(key => entityProps[key] !== undefined).length !== Object.keys(propertyMap).length ||
      Object.entries(entityProps).some(([key, value]) => isPropInvalidated(key, value)),
    [entityProps, propertyMap, isPropInvalidated]
  );

  const [newPropertyName, setNewPropertyName] = useState<string>();

  if (propsInvalidated !== invalidationState.current) {
    invalidationState.current = propsInvalidated;
    onChangeInvalidationState(propsInvalidated);
  }

  const addProperty = () => {
    updateEntityProps({
      updated: produce(entityProps, props => {
        props[newPropertyName] = '';
      }),
    });
  };

  const removeProperty = (name: string) => {
    updateEntityProps({
      updated: { [name]: undefined },
      mode: 'remove',
    });
  };

  const invalidatedStyle = (invalidated: boolean, forTextArea = false) =>
    invalidated
      ? `${forTextArea ? 'textarea' : 'input'} {
        color: ${MainTheme.palette.primary.main} !important;
      }`
      : '';

  const sortedPropertyList = useMemo(
    () => Object.entries(entityProps).sort(([key1], [key2]) => key1.localeCompare(key2)),
    [entityProps]
  );

  return (
    <React.Fragment>
      {sortedPropertyList.map(([name, value], idx) => (
        <Collapse key={idx} in={value !== undefined}>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;

              margin-top: 15px;
              margin-bottom: 15px;
            `}
          >
            <TextField
              css={css`
                flex-grow: 1;
                ${invalidatedStyle(isPropInvalidated(name, value))}
              `}
              id={`entity-prop-${name}`}
              name={`entity-prop-${name}`}
              value={value || ''}
              onChange={onChangeWrapper((val: string) => updateEntityProps({ updated: { [name]: val } }))}
              label={`${name}`}
              variant="outlined"
            />
            <IconButton
              css={css`
                margin-left: 10px;
              `}
              aria-label="remove property"
              onClick={() => removeProperty(name)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </Collapse>
      ))}
      <div
        css={css`
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-self: center;
          align-items: center;
        `}
      >
        <Collapse in={newPropertyName == undefined}>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <Fab size="small" color="primary" onClick={() => setNewPropertyName('')}>
              <AddIcon />
            </Fab>
            {!sortedPropertyList.length && (
              <Fade in={!sortedPropertyList.length}>
                <Alert
                  css={css`
                    margin-top: 20px;
                  `}
                  severity="info"
                >
                  Add properties by clicking the plus button
                </Alert>
              </Fade>
            )}
          </div>
        </Collapse>
        <Collapse in={newPropertyName !== undefined}>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              button {
                margin-left: 5px;
              }
            `}
          >
            <TextField
              css={css`
                flex-grow: 1;
              `}
              id={`add-entity-prop`}
              name={`add-entity-prop`}
              value={newPropertyName || ''}
              onChange={onChangeWrapper(setNewPropertyName)}
              label="new property name"
              variant="outlined"
            />

            <IconButton aria-label="discard property" onClick={() => setNewPropertyName(undefined)}>
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="add property"
              disabled={!newPropertyName}
              onClick={() => {
                addProperty();
                setNewPropertyName(undefined);
              }}
            >
              <CheckIcon />
            </IconButton>
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
};
