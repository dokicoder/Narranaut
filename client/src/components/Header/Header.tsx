/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/core';
import SVG from 'react-inlinesvg';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Chip, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Mail from '@material-ui/icons/AlternateEmail';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { FirebaseContext } from 'src/firebase';
import { useFirebaseUser } from 'src/hooks';
import { useHistory } from 'react-router-dom';
import StoryIcon from '../../assets/story.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    mailChip: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export const Header: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = !!anchorEl;

  const { signOut } = useContext(FirebaseContext);

  const user = useFirebaseUser();
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <SVG
            css={css`
              width: 35px;
              height: 35px;
              margin: 0 12px 4px 0;
              color: white;
              fill: white;
              cursor: pointer;
            `}
            src={StoryIcon}
            onClick={() => {
              history.push('/');
            }}
          />
          <Typography
            css={css`
              cursor: pointer;
            `}
            variant="h5"
            className={classes.title}
            onClick={() => {
              history.push('/');
            }}
          >
            Narranaut
          </Typography>

          {user && (
            <React.Fragment>
              <Chip icon={<Mail />} label={user.email} clickable className={classes.mailChip} color="secondary" />

              <IconButton
                aria-label="logged in user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isOpen}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    signOut().then(() => {
                      handleClose();
                      history.push('/');
                    });
                  }}
                >
                  Logout
                </MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
