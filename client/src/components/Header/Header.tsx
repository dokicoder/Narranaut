/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Navbar, NavbarBrand } from 'reactstrap';
import SVG from 'react-inlinesvg';
import StoryIcon from '../../assets/story.svg';

interface Props {}

const Header: React.FunctionComponent<Props> = () => (
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
