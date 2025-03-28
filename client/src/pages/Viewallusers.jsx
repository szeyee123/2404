import * as React from 'react';
import { IconButton, Menu, MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper } from '@mui/material';
import http from '../http';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const columns = [
  { id: 'id', label: 'User ID', minWidth: 85, align: 'left' }, 
  { id: 'name', label: 'Name', minWidth: 100, align: 'left' }, 
  { id: 'email', label: 'Email', minWidth: 100, align: 'left' }, 
  { id: 'number', label: 'Mobile number', minWidth: 130, align: 'left' }, 
  { id: 'addresses', label: 'Default Address', minWidth: 170, align: 'left' }, 
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' }, 
  { id: 'updatedAt', label: 'Updated at', minWidth: 150, align: 'left', format: (value) => new Date(value).toLocaleString() }, 
  { id: 'createdAt', label: 'Created at', minWidth: 150, align: 'left', format: (value) => new Date(value).toLocaleString() }
];

export default function Viewallusers({ openEditModal, openDeleteModal, openBlockUserModal, user, setUser }) {
  const [userList, setUserList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditUser = () => {
    handleMenuClose();
    openEditModal();
  };

  const handleDeleteUser = () => {
    handleMenuClose();
    openDeleteModal();
  }

  const handleBlockUser = (user) => {
    handleMenuClose();
    openBlockUserModal(user);
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: "16px" }}>
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ width: '100%', }}>
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
            {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
              // Get the default address
              const defaultAddress = Array.isArray(user.Addresses)
                ? user.Addresses.find((address) => address.isDefault)
                : null;
              
                console.log("User Addresses:", user.Addresses);


              return (
                <TableRow hover tabIndex={-1} key={user.id}>
                  {columns.map((column) => {
                    let value;

                    if (column.id === 'addresses') {
                      value = defaultAddress
                        ? `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.country}, ${defaultAddress.zipCode}`
                        : 'No default address';
                    } else {
                      value = user[column.id];
                    }

                    if (column.id === "status") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Chip
                            label={value}
                            color={value === "active" ? "success" : "error"}
                            variant="outlined"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && value ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right">
                    <IconButton aria-label="Actions" onClick={(event) => handleMenuOpen(event, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
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
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
        <MenuItem onClick={handleBlockUser}>
          {user?.status === "active" ? "Block User" : "Unblock User"}
        </MenuItem>
      </Menu>
    </Paper>
  );
}
