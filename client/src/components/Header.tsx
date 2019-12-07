/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Navbar, NavbarBrand } from 'reactstrap';
import StoryIcon from '../assets/story.svg';
import SVG from 'react-inlinesvg';

interface Props {}

const Header: React.SFC<Props> = () => (
  <Navbar color="dark" expand="xs">
    <NavbarBrand href="/">
      <SVG
        css={css`
          fill: white;
          width: 35px;
          height: 35px;
        `}
        className="mr-2 pb-1"
        src={StoryIcon}
      />
      Narranaut
    </NavbarBrand>
  </Navbar>
);

export default Header;
