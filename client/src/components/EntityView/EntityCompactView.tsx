/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon } from '@material-ui/icons';
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

export const EntityCompactView: React.FC<Props> = ({ entity, cCss, onSelect, onDelete }) => {
  const classes = useStyles();
  const { id, image, properties, name, description, type, tags } = entity;

  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className={classes.root}
      css={cCss}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardActionArea>
        <CardMedia className={classes.media} image={image || Icons.USER} title={name} />
        <div
          css={css`
            background-color: ${type.color || '#eeeeee'};
            border-radius: 5px;
            padding: 7px;
            font-size: 10px;
            margin: 0 !important;
            position: absolute;
            top: 5px;
            left: 5px;
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
    </Card>
  );
};
