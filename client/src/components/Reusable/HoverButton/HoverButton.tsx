/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { IconButton } from '@material-ui/core';

interface Props {
  onClick: () => void;
  position: 'top left' | 'top right' | 'bottom left' | 'bottom right';
  row?: 0 | 1 | 2 | 3; // offsets the button vertically into the component area
  col?: 0 | 1 | 2 | 3; // offsets the button horizontally into the component area
  label?: string;
}

export const HoverButton: React.FC<Props> = ({ position, row = 0, col = 0, label, children, onClick }) => (
  <IconButton
    css={css`
      position: absolute;
      ${position.includes('top') ? 'top' : 'bottom'}: ${row * 50 + 5}px;
      ${position.includes('left') ? 'left' : 'right'}: ${col * 50 + 5}px;
    `}
    aria-label={label}
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </IconButton>
);
