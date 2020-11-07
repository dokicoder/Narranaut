/** @jsx jsx */
import React from 'react';
import 'firebase/storage';
import { Paper } from '@material-ui/core';
import { jsx } from '@emotion/core';
import { Relationship } from '../../models';
import { useRelationshipStore } from 'src/hooks/relationshipStore';

interface Props {
  relationship: Relationship;
  displayingEntityId: string;
}

export const RelationshipView: React.FC<Props> = ({ relationship, displayingEntityId }) => {
  const {
    id,
    type: { forwardName, backwardName },
    party1,
    party2,
  } = relationship;

  if (!party1 || !party2) {
    // TODO: proper error label
    return <div>Entities missing in relationship #{id}</div>;
  }

  const placeholderLabel = (displayingEntityId === party2.id && backwardName) || forwardName;

  const label = placeholderLabel.replace('{{p1}}', party1.name).replace('{{p2}}', party2.name);

  // TODO: fully implement. This was just for testing
  return <Paper>{label}</Paper>;
};

interface ByIdProps {
  relationshipId: string;
  displayingEntityId: string;
}

export const RelationshipViewById: React.FC<ByIdProps> = ({ relationshipId, displayingEntityId }) => {
  const { relationshipMap } = useRelationshipStore();
  const relationship = relationshipMap[relationshipId];

  return relationship ? <RelationshipView relationship={relationship} displayingEntityId={displayingEntityId} /> : null;
};
