import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import http from "../http";

function Blockuserprompt({ open, closeEvent, user, setUserList }) {

    const handleBlockUser = async () => {
        closeEvent();
      
        const updatedStatus = user.status === "active" ? "blocked" : "active";
      
        try {
          await http.patch(`/user/${user.id}/status`, { status: updatedStatus });
      
          // Update the UI state to reflect the change
          // setUserList((prev) =>
          //   prev.map((u) =>
          //     u.id === user.id ? { ...u, status: updatedStatus } : u
          //   )
          // );
        } catch (error) {
          console.error("Error updating user status:", error);
        }
        
      };

  return (
    <Dialog open={open} onClose={closeEvent}>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        {user && (
          <DialogContentText>
            Are you sure you want to <b>{user.status === "active" ? "block" : "unblock"}</b> <b>{user.name}</b>?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEvent} color="primary">
          Cancel
        </Button>
        <Button onClick={handleBlockUser} color="secondary" disabled={!user}>
          {user?.status === "active" ? "Block" : "Unblock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Blockuserprompt;
