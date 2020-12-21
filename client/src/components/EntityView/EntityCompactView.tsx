/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';
import { Delete as DeleteIcon, RestoreFromTrash as RestoreIcon } from '@material-ui/icons';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import { ObjectEntity } from 'src/models';
import { PropertyTable } from './PropertyTable';
import { PlaceholderImages } from 'src/utils';
import { TagArea } from './TagArea';
import { useImageUrl } from 'src/hooks';
import { EntityIcon, HoverButton } from '../Reusable';

interface Props {
  entity: ObjectEntity;
  cCss?: SerializedStyles;
  onSelect?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

export const EntityCompactView: React.FC<Props> = ({ entity, cCss, onSelect, onDelete, onRestore }) => {
  const { id, properties, name, description, type, tags } = entity;

  const [hovered, setHovered] = useState(false);

  const { imageUrl } = useImageUrl(id);

  return (
    <Card
      elevation={hovered ? 5 : 2}
      css={[
        css`
          position: relative;
          height: 600px;
        `,
        cCss,
      ]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardActionArea onClick={onSelect}>
        <CardMedia
          css={css`
            height: 220px;
            background-position: 0 30%;
          `}
          image={imageUrl || PlaceholderImages[entity.type.name]}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
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
            {description}
          </Typography>
          {tags && <TagArea id={id} tags={tags} />}
          <PropertyTable properties={properties} />
        </CardContent>
      </CardActionArea>
      <EntityIcon
        type={type}
        cCss={css`
          position: absolute;
          top: 5px;
          left: 5px;
        `}
      />

      {onDelete && hovered && (
        <HoverButton position="top right" label={`delete ${type?.name}`} onClick={onDelete}>
          <DeleteIcon />
        </HoverButton>
      )}
      {onRestore && hovered && (
        <HoverButton position="top right" row={1} label={`restore deleted ${type?.name}`} onClick={onRestore}>
          <RestoreIcon />
        </HoverButton>
      )}
    </Card>
  );
};
