/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

interface Props {}

const Sidebar: React.FunctionComponent<Props> = () => (
  <Nav vertical>
    <NavItem>
      <NavLink tag={Link} to="/stories">
        Stories
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/characters">
        Characters
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/places">
        Places
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/events">
        Events
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/timelines">
        Timelines
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/relationships">
        Relationships
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/objects">
        Objects
      </NavLink>
    </NavItem>
  </Nav>
);

export default Sidebar;
