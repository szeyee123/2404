import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import http from '../http';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const columns = [
  {
    id: 'id',
    label: 'User ID',
    minWidth: 170
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 100
  },
  {
    id: 'number',
    label: 'Mobile number',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'address',
    label: 'Address',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'updatedAt',
    label: 'Updated at',
    minWidth: 170,
    align: 'right',
    format: (value) => new Date(value).toLocaleString(),
  },
  {
    id: 'createdAt',
    label: 'Created at',
    minWidth: 170,
    align: 'right',
    format: (value) => new Date(value).toLocaleString(),
  },
];

export default function Viewallusers({ openEditModal, setUser }) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    http.get('/user').then((res) => {
      console.log(res.data);
      setUserList(res.data);
    });
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    setUser(user);
    openEditModal(true);
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                return (
                  <TableRow hover tabIndex={-1} key={user.id} onClick={() => handleEditUser(user)}>
                    {columns.map((column) => {
                      const value = user[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && value
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <IconButton aria-label="Actions">
                      <MoreVertIcon />
                    </IconButton>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
