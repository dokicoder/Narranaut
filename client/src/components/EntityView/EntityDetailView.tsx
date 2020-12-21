/** @jsx jsx */
import React, { useState, useRef } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';
import { TextField, Button, Fade } from '@material-ui/core';
import { ObjectEntity } from 'src/models';
import { onChangeWrapper, MainTheme } from 'src/utils';
import { TagArea } from './TagArea';
import { EditablePropertyList } from './EditablePropertyList';
import { EntityDetailViewImageDropzone } from './EntityDetailViewImageDropzone';
import { Replay as UndoIcon, Save as SaveIcon } from '@material-ui/icons';
import { EditableRelationshipList } from './EditableRelationshipList';
import { EntityIcon } from '../Reusable';

interface Props {
  entity: ObjectEntity;
  cCss?: SerializedStyles;
  onSave: (updatedEntity: ObjectEntity) => Promise<any>;
  onDiscard?: () => void;
}

export const EntityDetailView: React.FC<Props> = props => {
  const { cCss, entity, onSave, onDiscard } = props;
  const { id, type, tags, relationshipIds } = entity;

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
      css={[
        css`
          display: flex;
          flex-direction: column;
          align-items: stretch;
        `,
        cCss,
      ]}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          min-height: 320px;
        `}
      >
        <EntityDetailViewImageDropzone
          entityId={id}
          entityType={type.name}
          cCss={css`
            height: 326px;
            width: 290px;
            margin-right: 15px;
          `}
        />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex-grow: 1;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
            `}
          >
            <TextField
              css={css`
              flex-grow: 1;

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
            <EntityIcon
              type={type}
              size="large"
              cCss={css`
                margin-left: 15px;
              `}
            />
          </div>

          <TextField
            css={css`
              display: flex;
              margin-top: 40px;
              margin-bottom: 15px;
              textarea {
                resize: vertical !important;
                min-height: 146px !important;
              }

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
        </div>
      </div>
      {tags && <TagArea id={id} tags={tags} />}
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
          <Button startIcon={<UndoIcon />} onClick={discardChanges}>
            discard
          </Button>
          <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveChanges}>
            save
          </Button>
        </div>
      </Fade>
      <EditableRelationshipList relationshipIds={relationshipIds} entity={entity} />
    </div>
  );
};
