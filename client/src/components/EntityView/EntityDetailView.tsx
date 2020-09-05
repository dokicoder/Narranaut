/** @jsx jsx */
import React, { useState, useReducer } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons, onChangeWrapper, MainTheme } from '../../utils';
import { TextField, Button, Fade } from '@material-ui/core';
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

  const isPropInvalidated = (name: string, value: string) => entity.properties[name] !== value;
  const propsInvalidated = Object.entries(entityProps).some(([key, value]) => isPropInvalidated(key, value));

  const invalidated = nameInvalidated || descriptionInvalidated || propsInvalidated;

  const invalidatedStyle = (invalidated: boolean) =>
    invalidated
      ? `input {
        color: ${MainTheme.palette.primary.main} !important;
      }`
      : '';

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
    <div
      css={
        [
          css`
            display: flex;
            flex-direction: column;
            align-items: stretch;
          `,
          cCss,
        ] as any
      }
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: flex-start;
        `}
      >
        <TextField
          css={css`
              label {
                font-size: 30px !important;
              }

              label.MuiInputLabel-outlined.MuiInputLabel-shrink {
                transform: translate(14px, -12px) scale(0.75); !important;
              }
              div {
                font-size: 30px !important;
              }

              ${invalidatedStyle(nameInvalidated)}
            `}
          id="entity-name"
          name="entity-name"
          value={name}
          color={nameInvalidated ? 'secondary' : undefined}
          onChange={onChangeWrapper(updateName)}
          label="Name"
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

      <TextField
        css={css`
          display: flex;
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
              display: block !important;

              div {
                display: block !important;
              }

              margin-top: 15px;
              margin-bottom: 15px;

              ${invalidatedStyle(isPropInvalidated(name, value))}
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
        <Fade in={invalidated}>
          <div>
            <Button variant="contained" color="primary" onClick={() => onSave(updatedEntity())}>
              Save
            </Button>
            <Button onClick={discardChanges}>Discard</Button>
          </div>
        </Fade>
      </div>
    </div>
  );
};
