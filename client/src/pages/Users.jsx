import React, { useState } from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import { Box, Button } from "@mui/material";
import Viewallusers from "./Viewallusers";
import Usermodal from '../components/Usermodal';
import Deleteprompt from '../components/Deleteprompt';
import Blockuserprompt from '../components/Blockuserprompt';
import '../index.css';

export default function Users() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBlockUserModal, setOpenBlockUserModal] = useState(false);
  const [user, setUser] = useState();

  const handleOpenEdit = () => setOpenEditModal(true);
  const handleOpenDelete = () => setOpenDeleteModal(true);
  const handleOpenBlockUser = () => setOpenBlockUserModal(true);

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUser();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUser();
  };

  const handleCloseBlockUserModal = () => {
    setOpenBlockUserModal(false);
    setUser();
    window.location.reload();
  };

  const handleAddNewUser = () => {
    setUser();
    setOpenEditModal(true);
  }
  

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="header">
            <h1>View all users</h1>
            <Button variant="contained" onClick={handleAddNewUser} >Add new user</Button>
          </div>
          <Usermodal closeEvent={handleCloseEditModal} open={openEditModal} user={user} />
          <Deleteprompt closeEvent={handleCloseDeleteModal} open={openDeleteModal} user={user}  />
          <Blockuserprompt closeEvent={handleCloseBlockUserModal} open={openBlockUserModal} user={user}  />
          <Viewallusers 
            openEditModal={handleOpenEdit} 
            openDeleteModal={handleOpenDelete} 
            openBlockUserModal={handleOpenBlockUser} 
            user={user}
            setUser={setUser} 
          />
        </Box>
      </Box>

    </>

  )
}
