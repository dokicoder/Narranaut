import React, { useMemo } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles(() =>
  createStyles({
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      marginTop: theme.spacing(2),
    },
  })
);

export const PropertyTable: React.FC<{ properties: Record<string, string>; sorted?: boolean }> = ({
  properties,
  sorted = true,
}) => {
  const classes = useStyles();

  const propertyList = useMemo(
    () =>
      sorted
        ? Object.entries(properties).sort(([key1], [key2]) => key1.localeCompare(key2))
        : Object.entries(properties),
    [properties, sorted]
  );

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table size="small" aria-label="customized table">
        <TableBody>
          {propertyList.map(([name, value]) => (
            <StyledTableRow key={name}>
              <StyledTableCell align="left">{name}</StyledTableCell>
              <StyledTableCell align="right">{value}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
