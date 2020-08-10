/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { EntityView } from '../../EntityView';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { useEntityStore } from 'src/hooks';

const Characters: React.FC = () => {
  const { entities: characters } = useEntityStore('character');

  const loading = !characters;

  return loading ? (
    <LoadingIndicator />
  ) : (
    <React.Fragment>
      <h1>Characters</h1>
      <div
        css={css`
          display: grid;
          grid-gap: 30px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        `}
      >
        {characters.map(entity => (
          <EntityView
            key={entity.id}
            {...entity}
            cCss={css`
              transition: 0.25s ease-in-out transform;
              :hover {
                transform: scale(1.1);
                z-index: 10;
              }
            `}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default Characters;
