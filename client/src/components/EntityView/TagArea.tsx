import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

interface Props {
  tags: string[];
  id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  })
);

export const TagArea: React.FC<Props> = ({ id, tags }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {tags.map(tag => (
        <Chip key={`${id}-tag-${tag}`} label={tag} />
      ))}
    </div>
  );
};
