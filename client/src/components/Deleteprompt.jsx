import React from "react";
import http from '../http';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function Deleteprompt ({ open, closeEvent, user }) {

  const handleDelete = () => {
    http.delete(`/user/${user.id}`)
    closeEvent();
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={closeEvent}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        {user ? (
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
        ) : (
          <DialogContentText>Loading user details...</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEvent} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {
            if (handleDelete) handleDelete(user?.id);
          }} 
          color="secondary" 
          disabled={!user}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Deleteprompt;
