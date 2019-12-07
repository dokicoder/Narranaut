/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { BrowserRouter } from 'react-router-dom';

const Main: React.SFC = () => (
  <BrowserRouter>
    <header>header</header>
    <div
      id="main-container"
      css={css`
        display: flex;
        flex-direction: row;
        align-items: stretch;
      `}
    >
      <div
        id="sidebar"
        className="p-2"
        css={css`
          background-color: #aaa;
          flex: 0 1 auto;
          width: 200px;
        `}
      >
        sidebar
      </div>
      <main
        id="viewContainer"
        className="p-2"
        css={css`
          flex: 1 1 auto;
          min-height: 480px;
        `}
      >
        viewContainer
      </main>
    </div>
    <footer
      css={css`
        background-color: #333;
        color: white;
      `}
    >
      footer
    </footer>
  </BrowserRouter>
);

export default Main;
