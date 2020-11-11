/** @jsx jsx */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/core';
import { Avatar, Paper } from '@material-ui/core';
import { jsx } from '@emotion/core';
import { Relationship } from '../../models';
import { useRelationshipStore } from 'src/hooks/relationshipStore';
import { useImageUrl } from 'src/hooks';
import { Icon, Icons } from 'src/utils';
import { ObjectEntity } from 'src/models';
import { pluralize } from 'src/utils';

interface Props {
  relationship: Relationship;
  displayingEntityId?: string;
}

export const RelationshipView: React.FC<Props> = ({ relationship, displayingEntityId }) => {
  const {
    id,
    type: { forwardName, backwardName, icon },
    party1,
    party2,
  } = relationship;

  const history = useHistory();

  const { imageUrl: party1imageUrl } = useImageUrl(party1.id);
  const { imageUrl: party2imageUrl } = useImageUrl(party2.id);

  const onSelectEntity = (entity: ObjectEntity) => () => {
    const entityTypePlural = pluralize(entity.type.name);

    history.push(`/${entityTypePlural}/${entity.id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!party1 || !party2) {
    // TODO: proper error label - also these should always be defined if this works as expected
    return <div>Entities missing in relationship #{id}</div>;
  }

  const placeholderLabel = (displayingEntityId === party2.id && backwardName) || forwardName;

  // these expressions need to also work for displayingEntity === undefined
  const label = placeholderLabel
    .replace('{{p1}}', (displayingEntityId === party2.id ? party2 : party1).name)
    .replace('{{p2}}', (displayingEntityId === party2.id ? party1 : party2).name);

  const iconSrc = Icons[icon as Icon];

  return (
    <Paper
      css={css`
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
      `}
    >
      <div
        css={css`
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
        `}
      >
        <Avatar
          css={css`
            width: 100px;
            height: 100px;
            cursor: pointer;
          `}
          alt={party1.name}
          src={party1imageUrl}
          onClick={onSelectEntity(party1)}
        />
        <img
          css={css`
            width: 30px;
            height: 30px;
            margin: 15px;
          `}
          src={iconSrc}
        />
        <Avatar
          css={css`
            width: 100px;
            height: 100px;
            cursor: pointer;
          `}
          alt={party2.name}
          src={party2imageUrl}
          onClick={onSelectEntity(party2)}
        />
      </div>
      {label}
    </Paper>
  );
};

interface ByIdProps {
  relationshipId: string;
  displayingEntityId: string;
}

export const RelationshipCompactViewById: React.FC<ByIdProps> = ({ relationshipId, displayingEntityId }) => {
  const { relationshipMap } = useRelationshipStore();
  const relationship = relationshipMap[relationshipId];

  return relationship ? <RelationshipView relationship={relationship} displayingEntityId={displayingEntityId} /> : null;
};
