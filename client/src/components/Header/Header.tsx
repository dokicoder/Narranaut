/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import SVG from 'react-inlinesvg';
import StoryIcon from '../../assets/story.svg';

interface Props {}

const Header: React.FunctionComponent<Props> = () => (
  <nav className="demo">
    <a href="#" className="brand">
      <SVG
        css={css`
          width: 25px;
          height: 25px;
          margin: 0 6px 4px 0;
        `}
        src={StoryIcon}
      />
      Narranaut
    </a>

    <div className="menu">
      <a href="#" className="pseudo button icon-picture">
        Menu 1
      </a>
      <a href="#" className="button icon-puzzle">
        Menu 2
      </a>
    </div>
  </nav>
);

export default Header;
