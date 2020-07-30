/** @jsx jsx */
import React from 'react';
import { EntityView } from '../../EntityView';
import { jsx, css } from '@emotion/core';
import { ObjectEntity } from '../../../models';

const Characters: React.FC = () => {
  const dummyEntities: ObjectEntity[] = [
    {
      id: '34tdfg',
      name: 'Mike Mock',
      description:
        'A nice guy Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
      type: {
        id: 'characterTypeId',
        name: 'Character',
        color: 'orange',
        icon: 'WEAPON',
      },
      properties: {},
      relationships: [],
      tags: ['Hunter', 'Gangster'],
    },
    {
      id: '34tdfg',
      name: 'Maurice Longlastname',
      description:
        'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
      type: {
        id: 'characterTypeId',
        name: 'Character',
        icon: 'WEAPON',
      },
      properties: {},
      relationships: [],
      tags: ['Joker', 'Space Cowboy'],
    },
    {
      id: '34tdfg',
      name: 'Sven Manny Manny Names',
      description:
        'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
      type: {
        id: 'characterTypeId',
        name: 'Character',
        color: '#ccddff',
        icon: 'WEAPON',
      },
      properties: {},
      relationships: [],
      tags: ['Hunter', 'Gangster'],
    },
    {
      id: '34tdfg',
      name: 'Mike Mock',
      description:
        'A nice guy eeping up with  seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
      type: {
        id: 'characterTypeId',
        name: 'Character',
        icon: 'WEAPON',
      },
      properties: {},
      relationships: [],
      tags: ['Hunter', 'Gangster'],
    },
  ];

  return (
    <div>
      <h1>Characters</h1>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        `}
      >
        {dummyEntities.map(entity => (
          <EntityView
            key={entity.id}
            {...entity}
            cCss={css`
              margin-right: 22px;
              margin-bottom: 30px;
              transion: 0.4s ease-in-out transform;

              :hover {
                transform: translateX(26px) scale(1.2);
                z-index: 10;
              }

              :hover ~ * {
                transform: translateX(50px);
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default Characters;
