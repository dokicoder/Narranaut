/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { EntityType } from 'src/models';
import { Icons } from 'src/utils';
import { SerializedStyles } from '@emotion/core';

interface Props {
  type: EntityType;
  cCss?: SerializedStyles;
  onClick?: () => void;
  size?: 'small' | 'large';
}

export const EntityIcon: React.FC<Props> = ({ type, size = 'small', cCss, onClick }) =>
  size === 'small' ? (
    <div
      onClick={onClick}
      // TODO: do not hardcode the width somehow
      css={[
        css`
          background-color: ${type.color || '#eeeeee'};
          border-radius: 5px;
          width: 53px;
          padding-top: 7px;
          padding-bottom: 7px;
          font-size: 10px;
          margin: 0 !important;
          text-align: center;
        `,
        cCss,
      ]}
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
  ) : (
    <div
      css={[
        css`
          background-color: ${type.color || '#eeeeee'};
          border-radius: 6px;
          padding: 8px;
          font-size: 12px;
          width: 100px;
          height: 100px;
        `,
        cCss,
      ]}
    >
      {type.icon ? (
        <img
          css={css`
            height: 70px;
            display: block;
            margin: auto;
          `}
          src={Icons[type.icon]}
        />
      ) : null}
      <h3
        css={css`
              padding: 0 !important;
              margin-top -5px !important;
              text-align: center;
            `}
      >
        {type.name}
      </h3>
    </div>
  );
