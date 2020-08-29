/** @jsx jsx */
import React, { useState, useReducer } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons, onChangeWrapper } from '../../utils';
import { TextField, Button } from '@material-ui/core';
import { TagArea } from './TagArea';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSave?: (updatedEntity: ObjectEntity) => void;
  onDiscard?: () => void;
}

function propsStateUpdateReducer(state: Record<string, string>, updated: Record<string, string>) {
  return { ...state, ...updated };
}

export const EntityDetailView: React.FC<Props> = props => {
  const { cCss, entity, onSave, onDiscard } = props;
  const { id, image, type, tags } = entity;

  const [name, updateName] = useState(entity.name);
  const [description, updateDescription] = useState(entity.description);
  const [entityProps, updateEntityProps] = useReducer(propsStateUpdateReducer, entity.properties);

  const nameInvalidated = entity.name !== name;
  const descriptionInvalidated = entity.description && entity.description !== description;
  const propsInvalidated = Object.entries(entity.properties).some(([key, value]) => entityProps[key] !== value);

  const invalidated = nameInvalidated || descriptionInvalidated || propsInvalidated;

  const updatedEntity = (): ObjectEntity => ({
    ...entity,
    name,
    description,
    properties: entityProps,
  });

  const discardChanges = () => {
    updateName(entity.name);
    updateDescription(entity.description);
    updateEntityProps(entity.properties);
    onDiscard();
  };

  return (
    <div css={cCss}>
      <header>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          `}
        >
          <TextField
            id="entity-name"
            name="entity-name"
            value={name}
            onChange={onChangeWrapper(updateName)}
            label="Enter a name"
            variant="outlined"
          />
          <div
            css={css`
              background-color: ${type.color || '#eeeeee'};
              border-radius: 5px;
              padding: 7px;
              font-size: 12px;
            `}
          >
            {type.icon ? (
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                  display: block;
                  margin: auto;
                `}
                src={Icons[type.icon]}
              />
            ) : null}
            <div>{type.name}</div>
          </div>
        </div>
      </header>

      <footer
        css={css`
          overflow-y: auto;
          font-size: 14px;
          scrollbar-width: thin;

          ::-webkit-scrollbar {
            width: 7px;
          }

          scrollbar-width: thin;
          scrollbar-color: #bbbbdd transparent;

          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #bbbbbb;
            border-radius: 6px;
            border: 3px solid transparent;
          }
        `}
      >
        <TextField
          css={css`
            display: block;
            width: 100%;
            margin-top: 15px;
            margin-bottom: 15px;
          `}
          name="entity-description"
          id="entity-description"
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={onChangeWrapper(updateDescription)}
          variant="outlined"
        />
        {tags && <TagArea id={id} tags={tags} />}
        {image ? (
          <img
            src={image}
            css={css`
              width: 30%;
            `}
          />
        ) : null}
        {Object.entries(entityProps)
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .map(([name, value], idx) => (
            <TextField
              css={css`
                display: block;
                width: 100%;
                margin-top: 15px;
                margin-bottom: 15px;
              `}
              key={idx}
              id={`entity-prop-${name}`}
              name={`entity-prop-${name}`}
              value={value}
              onChange={onChangeWrapper((val: string) => updateEntityProps({ [name]: val }))}
              label={`${name}`}
              variant="outlined"
            />
          ))}
        <div
          css={css`
            margin-top: 20px;
            button {
              margin-right: 10px;
            }
          `}
        >
          {invalidated && (
            <React.Fragment>
              <Button variant="contained" color="primary" onClick={() => onSave(updatedEntity())}>
                Save
              </Button>
              <Button onClick={discardChanges}>Discard</Button>
            </React.Fragment>
          )}
        </div>
      </footer>
    </div>
  );
};
