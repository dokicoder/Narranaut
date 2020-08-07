/** @jsx jsx */
import React, { useContext, useState, useEffect } from 'react';
import { jsx, css } from '@emotion/core';
import SVG from 'react-inlinesvg';
import StoryIcon from '../../assets/story.svg';
import { centeredContainer } from '../../styles';
import { FirebaseContext, User } from '../../firebase';
import { Icons } from '../../utils';
import { useLocation, useHistory } from 'react-router-dom';

const Header: React.FC = () => {
  const { auth, signOut } = useContext(FirebaseContext);

  const [currentUser, setCurrentUser] = useState<User>();

  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <nav
      css={css`
        position: static;
      `}
    >
      <div css={centeredContainer}>
        <a href="javascript:void(0)" className="brand">
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

        {currentUser && (
          <div className="menu">
            <a
              href="javascript:void(0)"
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
                {currentUser.email}
              </span>
            </a>
            <a
              href="javascript:void(0)"
              className="button"
              css={css`
                position: relative;
                border-radius: 30px;
              `}
              onClick={() => {
                signOut();
                history.push('/login');
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
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
