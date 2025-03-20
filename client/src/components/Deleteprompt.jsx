import React, { useEffect, useState } from 'react'
import { Dialog, Button } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Deleteprompt({ closeEvent, open, user }) {
  
  const onClose = () => {
    setOpenPrompt(false);
    closeEvent();
  };  

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this user?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            User Details here {user}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

