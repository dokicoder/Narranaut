/** @jsx jsx */
import React, { useContext } from 'react';
import SVG from 'react-inlinesvg';
import { useHistory, NavLink } from 'react-router-dom';
import { jsx, css } from '@emotion/core';
import StoryIcon from '../../assets/story.svg';
import { centeredContainer } from '../../styles';
import { FirebaseContext } from '../../firebase';
import { useFirebaseUser } from '../../hooks';
import { Icons } from '../../utils';

const Header: React.FC = () => {
  const { signOut } = useContext(FirebaseContext);

  const user = useFirebaseUser();
  const history = useHistory();

  return (
    <nav
      css={css`
        position: static;
      `}
    >
      <div css={centeredContainer}>
        <NavLink to="/" className="brand">
          <SVG
            css={css`
              width: 25px;
              height: 25px;
              margin: 0 6px 4px 0;
            `}
            src={StoryIcon}
          />
          Narranaut
        </NavLink>

        {user && (
          <div className="menu">
            <NavLink
              to="#"
              onClick={e => e.preventDefault()}
              className="button"
              css={css`
                position: relative;
                background-color: #88ff66;
                border-radius: 30px;
              `}
            >
              <img
                css={css`
                  width: 24px;
                  height: 24px;
                  left: 10px;
                  top: 6px;

                  position: absolute;
                `}
                src={Icons.USER}
              />
              <span
                css={css`
                  margin-left: 24px;
                  color: black;
                `}
              >
                {user.email}
              </span>
            </NavLink>
            <NavLink
              to="#"
              className="button"
              css={css`
                position: relative;
                border-radius: 30px;
              `}
              onClick={e => {
                e.preventDefault();
                signOut().then(() => history.push('/'));
              }}
            >
              <img
                css={css`
                  width: 32px;
                  height: 32px;
                  left: 8px;
                  top: 2px;
                  filter: invert(100);

                  position: absolute;
                `}
                src={Icons.LEAVE}
              />
              <span
                css={css`
                  margin-left: 27px;
                `}
              >
                Logout
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
