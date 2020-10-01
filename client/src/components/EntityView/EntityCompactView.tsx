/** @jsx jsx */
import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';
import { Delete as DeleteIcon, RestoreFromTrash as RestoreIcon } from '@material-ui/icons';
import { Card, IconButton, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import { ObjectEntity } from '../../models';
import { PropertyTable } from './PropertyTable';
import { Icons } from '../../utils';
import { TagArea } from './TagArea';

import 'firebase/storage';
import { FirebaseContext } from 'src/firebase';
import { PlaceholderImages } from 'src/utils';
import { useFirebaseUser } from 'src/hooks/firebase';

interface Props {
  entity: ObjectEntity;
  cCss?: SerializedStyles;
  onSelect?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

export const EntityCompactView: React.FC<Props> = ({ entity, cCss, onSelect, onDelete, onRestore }) => {
  const { fileStorage } = useContext(FirebaseContext);
  const user = useFirebaseUser();

  const { id, properties, name, description, type, tags } = entity;

  const [hovered, setHovered] = useState(false);

  // semantics: undefined means not yet loaded, null means no image specified
  const [imageUrl, setImageUrl] = useState<string | null>(undefined);

  // TODO: if this paths needs to be altered, you have to also adjust the security rules under https://console.firebase.google.com/project/narranaut/storage/narranaut.appspot.com/rules
  const refPath = useMemo(() => user && `user/${user.uid}/${entity.id}-image`, [user, entity.id]);

  const fetchImageUrl = useCallback(() => {
    if (refPath) {
      fileStorage
        .ref(refPath)
        .getDownloadURL()
        .then(setImageUrl)
        .catch(() => {
          // no image set
          setImageUrl(null);
        });
    }
  }, [fileStorage, refPath]);

  useEffect(() => fetchImageUrl(), [fetchImageUrl]);

  return (
    <Card
      elevation={hovered ? 5 : 2}
      css={[
        css`
          position: relative;
          height: 450px;
        `,
        cCss,
      ]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardActionArea onClick={onSelect}>
        <CardMedia
          css={css`
            height: 140px;
            object-position: 100px 50px;
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
