import React, { useState } from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import { Box, Button } from "@mui/material";
import Viewallusers from "./Viewallusers";
import Addusermodal from '../components/Addusermodal';
import '../index.css';

export default function Users() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddNewUser = () => {
    setUser();
    handleOpen();
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
          <Addusermodal closeEvent={handleClose} open={open} user={user} />
          <Viewallusers openEditModal={handleOpen} setUser={setUser} />
        </Box>
      </Box>

    </>

  )
}
