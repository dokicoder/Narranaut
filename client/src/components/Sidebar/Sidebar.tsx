/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC<{}> = () => (
  <nav>
    <div>
      <NavLink to="/stories">Stories</NavLink>
    </div>
    <div>
      <NavLink to="/characters">Characters</NavLink>
    </div>
    <div>
      <NavLink to="/places">Places</NavLink>
    </div>
    <div>
      <NavLink to="/events">Events</NavLink>
    </div>
    <div>
      <NavLink to="/timelines">Timelines</NavLink>
    </div>
    <div>
      <NavLink to="/relationships">Relationships</NavLink>
    </div>
    <div>
      <NavLink to="/objects">Objects</NavLink>
    </div>
  </nav>
);

export default Sidebar;
