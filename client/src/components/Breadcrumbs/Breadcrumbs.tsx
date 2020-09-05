import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';

interface Props {
  withHome?: boolean;
  items?: { label: string; handler?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void; active?: boolean }[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      marginBottom: theme.spacing(5),
    },
    link: {
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
  })
);

export const Breadcrumbs: React.FC<Props> = ({ withHome = true, items = [] }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" className={classes.main}>
      Breadcrumbs
      {withHome ? (
        items?.length ? (
          <Link
            color="inherit"
            href="#"
            onClick={(e: any) => {
              e.preventDefault();
              history.push('/');
            }}
            className={classes.link}
          >
            <HomeIcon className={classes.icon} />
            Narranaut
          </Link>
        ) : (
          <Typography color="textPrimary" className={classes.link}>
            <HomeIcon className={classes.icon} />
            Narranaut
          </Typography>
        )
      ) : null}
      {items.map(({ label, active, handler }) =>
        active ? (
          <Typography key={label} color="textPrimary" className={classes.link}>
            {label}
          </Typography>
        ) : (
          <Link key={label} color="inherit" href="#" onClick={handler} className={classes.link}>
            {label}
          </Link>
        )
      )}
    </MUIBreadcrumbs>
  );
};
