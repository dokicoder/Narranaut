/** @jsx jsx */
import React from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { ObjectEntity } from '../../models';
import { PropertyTable } from './PropertyTable';
import { Icons } from '../../utils';
import { TagArea } from './TagArea';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSelect?: () => void;
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

export const EntityCompactView: React.FC<Props> = ({ cCss, onSelect, entity }) => {
  const classes = useStyles();
  const { id, image, properties, name, description, type, tags } = entity;

  return (
    <Card className={classes.root} css={cCss} onClick={onSelect}>
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
            right: 5px;
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
