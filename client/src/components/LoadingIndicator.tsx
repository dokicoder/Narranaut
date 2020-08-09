/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

export const LoadingIndicator: React.FC = () => (
  <div
    css={css`
      height: 80vh;
      display: grid;
      place-items: center;
    `}
  >
    <div
      css={css`
        opacity: 0;
        animation: 0.3s ease-in 0.3s fadein forwards;

        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}
    >
      loading...
    </div>
  </div>
);
