import React, {useState} from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import {Box, Button, Modal} from "@mui/material";
import Viewallusers from "./Viewallusers";
import Addusermodal from '../components/Addusermodal';
import '../index.css';

function Users() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <>
    <Navbar />
    <Box height={30}/>
      <Box sx={{ display: "flex"}}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <div className="header">
          <h1>View all users</h1>
          <Button variant="contained" onClick={handleOpen}>Add new user</Button>
        </div>
        <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="adduserModal">
              <Addusermodal />
              </Box>
            </Modal>
        </div>
        
          <Viewallusers/>
        </Box>
      </Box>
      
    </>
    
  )
}

export default Users