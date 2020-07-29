/** @jsx jsx */
import React from 'react';
import { EntityView } from '../../EntityView';
import { jsx } from '@emotion/core';
import { ObjectEntity } from '../../../models';

const Characters: React.FC = () => {
  const dummyEntity: ObjectEntity = {
    id: '34tdfg',
    name: 'Mike Mock',
    description:
      'A nice guy Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    type: {
      id: 'characterTypeId',
      name: 'Character',
      icon: 'WEAPON',
    },
    properties: {},
    relationships: [],
    tags: ['Hunter', 'Gangster'],
  };

  return (
    <div>
      <h1>Characters</h1>
      <EntityView {...dummyEntity} />
    </div>
  );
};

export default Characters;
