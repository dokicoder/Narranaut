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
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: -15px !important;
        `}
      >
        {characters.map(entity => (
          <EntityView
            key={entity.id}
            {...entity}
            cCss={css`
              margin: 15px 11px 15px 11px !important;
              flex-grow: 1;
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
