/** @jsx jsx */
import produce from 'immer';
import React, { useReducer, useMemo, useCallback, useRef } from 'react';
import { css, jsx } from '@emotion/core';

import { Add as AddIcon, Clear as ClearIcon } from '@material-ui/icons';
import { onChangeWrapper, MainTheme } from '../../utils';
import { TextField, Fab } from '@material-ui/core';

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

function propsStateUpdateReducer(state: Record<string, string>, { updated, mode }: IPropsUpdateAction) {
  if (mode === 'replace') {
    return { ...updated };
  }
  if (mode === 'remove') {
    const result = { ...state };
    for (const key in updated) delete result[key];

    return result;
  }
  // no mode is handled same as "extend"
  return { ...state, ...updated };
}

export const EditablePropertiesList: React.FC<Props> = ({
  propertyMap,
  onChangeInvalidationState,
  onChangePropertyMap,
}) => {
  const [entityProps, updateEntityProps] = useReducer(propsStateUpdateReducer, propertyMap);
  const invalidationState = useRef(true);

  const isPropInvalidated = useCallback((name: string, value: string) => propertyMap[name] !== value, [propertyMap]);
  const propsInvalidated = useMemo(
    () =>
      Object.keys(entityProps).length !== Object.keys(propertyMap).length ||
      Object.entries(entityProps).some(([key, value]) => isPropInvalidated(key, value)),
    [entityProps, propertyMap, isPropInvalidated]
  );

  onChangePropertyMap(entityProps);

  if (propsInvalidated !== invalidationState.current) {
    invalidationState.current = propsInvalidated;
    onChangeInvalidationState(propsInvalidated);
  }

  const addProperty = () => {
    updateEntityProps({
      updated: produce(entityProps, props => {
        props['neasdasdw'] = '';
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

  return (
    <React.Fragment>
      {Object.entries(entityProps)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .map(([name, value], idx) => (
          <div
            key={idx}
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
              value={value}
              onChange={onChangeWrapper((val: string) => updateEntityProps({ updated: { [name]: val } }))}
              label={`${name}`}
              variant="outlined"
            />
            <Fab
              css={css`
                margin-left: 10px;
                background-color: ${MainTheme.palette.error.main};
              `}
              size="small"
              color="primary"
              onClick={() => removeProperty(name)}
            >
              <ClearIcon />
            </Fab>
          </div>
        ))}
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-self: center;
          align-items: center;
        `}
      >
        <Fab size="small" color="primary" onClick={addProperty}>
          <AddIcon />
        </Fab>
      </div>
    </React.Fragment>
  );
};
