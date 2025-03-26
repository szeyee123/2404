import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import http from "../http";

function Blockuserprompt({ open, closeEvent, user }) {

    const handleBlockUser = async () => {
        closeEvent();
      
        const updatedStatus = user.status === "active" ? "blocked" : "active";
      
        try {
          await http.patch(`/user/${user.id}/status`, { status: updatedStatus });
        } catch (error) {
          console.error("Error updating user status:", error);
        }
        
    };

    const onClose = () => {
      closeEvent();
      window.location.reload();
    }; 

  return (
    <Dialog open={open} >
      <Box sx={{ m: 2 }}>
      <DialogTitle>Confirmation needed</DialogTitle>
      <IconButton className="closebutton" onClick={onClose}>
          <CloseIcon />
      </IconButton>
      <DialogContent>
        {user && (
          <DialogContentText>
            Are you sure you want to <b>{user.status === "active" ? "block" : "unblock"}</b> <b>{user.name}</b>?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="grey">
          Cancel
        </Button>
        <Button onClick={handleBlockUser} variant="contained" color="primary" disabled={!user}>
          {user?.status === "active" ? "Block" : "Unblock"}
        </Button>
      </DialogActions>
      </Box>
    </Dialog>
  );
}

export default Blockuserprompt;
