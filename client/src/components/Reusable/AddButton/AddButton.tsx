/** @jsx jsx */
import React from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';
import { Fab, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add as AddIcon } from '@material-ui/icons';

interface Props {
  size?: 'small' | 'medium' | 'large';
  onClick: () => void;
  infoLabel?: string;
  cCss?: SerializedStyles;
}

export const AddButton: React.FC<Props> = ({ cCss, infoLabel, size, onClick }) => (
  <div
    css={[
      css`
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      `,
      cCss,
    ]}
  >
    <Fab size={size} color="primary" onClick={onClick}>
      <AddIcon />
    </Fab>
    {infoLabel && (
      <Fade in={!!infoLabel}>
        <Alert
          css={css`
            margin-top: 20px;
          `}
          severity="info"
        >
          {infoLabel}
        </Alert>
      </Fade>
    )}
  </div>
);
