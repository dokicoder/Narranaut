/** @jsx jsx */
import React, { useState, useRef } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { TextField, Button, Fade } from '@material-ui/core';
import { ObjectEntity } from '../../models';
import { Icons, onChangeWrapper, MainTheme } from '../../utils';
import { TagArea } from './TagArea';
import { EditablePropertyList } from './EditablePropertyList';
import { Replay as UndoIcon, Save as SaveIcon } from '@material-ui/icons';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSave: (updatedEntity: ObjectEntity) => Promise<void>;
  onDiscard?: () => void;
}

export const EntityDetailView: React.FC<Props> = props => {
  const { cCss, entity, onSave, onDiscard } = props;
  const { id, image, type, tags } = entity;

  const [name, updateName] = useState(entity.name);
  const [description, updateDescription] = useState(entity.description);
  const [propertiesListReset, updatePropertiesListReset] = useState(false);

  const propertyMapCache = useRef(entity.properties);

  const nameInvalidated = entity.name !== name;
  const descriptionInvalidated = entity.description && entity.description !== description;
  const [propsInvalidated, updatePropsInvalidated] = useState(false);

  const invalidated = nameInvalidated || descriptionInvalidated || propsInvalidated;

  const invalidatedStyle = (invalidated: boolean, forTextArea = false) =>
    invalidated
      ? `${forTextArea ? 'textarea' : 'input'} {
        color: ${MainTheme.palette.primary.main} !important;
      }`
      : '';

  const updatedEntity = (): ObjectEntity => {
    const properties = { ...propertyMapCache.current };

    // delete keys with undefined values in properties map
    for (const key in properties) {
      if (properties[key] === undefined) {
        delete properties[key];
      }
    }

    return {
      ...entity,
      name,
      description,
      properties,
    };
  };

  const saveChanges = () => {
    onSave(updatedEntity()).then(() => {
      updatePropertiesListReset(!propertiesListReset);
    });
  };

  const discardChanges = () => {
    updateName(entity.name);
    updateDescription(entity.description);
    updatePropertiesListReset(!propertiesListReset);
    onDiscard && onDiscard();
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
          onChange={onChangeWrapper(updateName)}
          label="name"
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
          textarea {
            resize: vertical !important;
            min-height: 60px !important;
          }import { useRef } from 'react';

          ${invalidatedStyle(descriptionInvalidated, true)}
        `}
        name="entity-description"
        id="entity-description"
        label="description"
        multiline
        rows={8}
        value={description || ''}
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
      <EditablePropertyList
        key={String(propertiesListReset)}
        propertyMap={entity.properties}
        onChangeInvalidationState={updatePropsInvalidated}
        onChangePropertyMap={updatedMap => {
          propertyMapCache.current = updatedMap;
        }}
      />
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
            save
          </Button>
          <Button startIcon={<UndoIcon />} onClick={discardChanges}>
            discard
          </Button>
        </div>
      </Fade>
    </div>
  );
};
