/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Breadcrumbs } from 'src/components';
import { EntityTypeList } from './EntityTypeList';
import { RelationshipTypeList } from './RelationshipTypeList';

export const LandingPage: React.FC = () => {
  return (
    <React.Fragment>
      <Breadcrumbs />
      <EntityTypeList />
      <RelationshipTypeList />
    </React.Fragment>
  );
};
