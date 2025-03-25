import React from "react";
import http from '../http';
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function Deleteprompt ({ open, closeEvent, user }) {

  const onClose = () => {
    closeEvent();
    window.location.reload();
  }; 

  const handleDelete = () => {
    http.delete(`/user/${user.id}`)
    closeEvent();
    window.location.reload();
  };

  return (
    <Dialog open={open}>
      <Box sx={{ m: 2 }}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <IconButton className="closebutton" onClick={onClose}>
            <CloseIcon />
        </IconButton>
        <DialogContent>
          {user && (
            <>
              <DialogContentText>
                Are you sure you want to delete <b>{user.name}</b>?
              </DialogContentText>
              <DialogContentText>
                <b>ID:</b> {user.id}
              </DialogContentText>
              <DialogContentText>
                <b>Email:</b> {user.email}
              </DialogContentText>
              <DialogContentText>
                <b>Mobile number:</b> {user.number}
              </DialogContentText>
              <DialogContentText>
                <b>Address:</b> {user.address}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="grey">
            Cancel
          </Button>
          <Button onClick={() => {
              if (handleDelete) handleDelete(user?.id);
            }} 
            color="primary" 
            variant="contained"
            disabled={!user}
          >
            Delete
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default Deleteprompt;
