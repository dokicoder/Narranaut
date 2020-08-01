/** @jsx jsx */
import React from 'react';
import { useRecoilState } from 'recoil';
import { jsx, css } from '@emotion/core';
import { EntityView } from '../../EntityView';
import { charactersState } from '../../../store';

const Characters: React.FC = () => {
  const [characters] = useRecoilState(charactersState);

  return (
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
