import React, { useState } from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import { Box, Button } from "@mui/material";
import Viewallusers from "./Viewallusers";
import Usermodal from '../components/Usermodal';
import Deleteprompt from '../components/Deleteprompt';
import '../index.css';

export default function Users() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [user, setUser] = useState();

  const handleOpenEdit = () => setOpenEditModal(true);
  const handleOpenDelete = () => {
    setOpenDeleteModal(true)
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUser();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUser();
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
          <Usermodal closeEvent={handleCloseEditModal} openEditModal={openEditModal} user={user} />
          <Deleteprompt closeEvent={handleCloseDeleteModal} openDeleteModal={openDeleteModal} user={user} />
          <Viewallusers 
            openEditModal={handleOpenEdit} 
            openDeleteModal={handleOpenDelete} 
            setUser={setUser} 
          />
        </Box>
      </Box>

    </>

  )
}
