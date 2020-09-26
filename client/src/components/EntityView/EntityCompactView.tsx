/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon, RestoreFromTrash as RestoreIcon } from '@material-ui/icons';
import { Card, IconButton, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import { ObjectEntity } from '../../models';
import { PropertyTable } from './PropertyTable';
import { Icons } from '../../utils';
import { TagArea } from './TagArea';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSelect?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

const useStyles = makeStyles({
  root: {
    height: 450,
  },
  media: {
    height: 140,
    margin: '0 30%',
  },
});

export const EntityCompactView: React.FC<Props> = ({ entity, cCss, onSelect, onDelete, onRestore }) => {
  const classes = useStyles();
  const { id, image, properties, name, description, type, tags } = entity;

  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className={classes.root}
      elevation={hovered ? 5 : 2}
      css={
        [
          css`
            position: relative;
          `,
          cCss,
        ] as any
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardActionArea onClick={onSelect}>
        <CardMedia className={classes.media} image={image || Icons.USER} title={name} />
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
      <div
        // TODO: do not hardcode the width somehow
        css={css`
          background-color: ${type.color || '#eeeeee'};
          border-radius: 5px;
          width: 53px;
          padding-top: 7px;
          padding-bottom: 7px;
          font-size: 10px;
          margin: 0 !important;
          position: absolute;
          top: 5px;
          left: 5px;
          text-align: center;
        `}
      >
        {type.icon ? (
          <img
            css={css`
              height: 28px;
              display: block;
              margin: auto;
            `}
            src={Icons[type.icon]}
          />
        ) : null}
        {type.name}
      </div>

      {onDelete && hovered && (
        <IconButton
          css={css`
            position: absolute;
            top: 5px;
            right: 5px;
          `}
          aria-label={`delete ${type?.name}`}
          onClick={e => {
            e.preventDefault();
            onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
      {onRestore && hovered && (
        <IconButton
          css={css`
            position: absolute;
            top: 55px;
            right: 5px;
          `}
          aria-label={`delete ${type?.name}`}
          onClick={e => {
            e.preventDefault();
            onRestore();
          }}
        >
          <RestoreIcon />
        </IconButton>
      )}
    </Card>
  );
};
