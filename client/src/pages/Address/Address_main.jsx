import { useState, useEffect } from "react";
import { Box, Typography, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddressFormPage from "./Address_form";
import Sidenav_user from '../../components/Sidenav_user';
import axios from '../../http';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function AddressMain() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [addressToDelete, setAddressToDelete] = useState(null); 
  const [showDeleteError, setShowDeleteError] = useState(false); 
  const [openSelectDefaultDialog, setOpenSelectDefaultDialog] = useState(false);  

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const userId = 1;
  
  // Fetch user data and addresses
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/user/${userId}/addresses`);
      setAddresses(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  // Handle address submission (add/update)
  const handleAddressSubmitted = () => {
    fetchUserData();
    setShowSuccess(true); 
    handleCancel();
  };

  // Handle address deletion
  const handleDeleteAddress = async () => {
    if (addressToDelete.isDefault) {
      // If the address to be deleted is the default, check if it's the only address
      if (addresses.length === 1) {
        // If there's only one address and it's the default, show an error message
        setShowDeleteError(true);
        return;
      }
      // If there are more than one address, prompt the user to select another one
      setOpenSelectDefaultDialog(true);
      return;
    }

    // Proceed with deletion if it's not a default address
    try {
      await axios.delete(`/user/${userId}/addresses/${addressToDelete.id}`);
      fetchUserData();
      setShowDeleteSuccess(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (address) => {
    setAddressToDelete(address);  
    setOpenDeleteDialog(true);  
    setShowDeleteError(false);  
  };

  // Close delete confirmation dialog without deleting
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setAddressToDelete(null); 
  };

  // Handle selecting a new default address
  const handleSelectNewDefault = (newDefaultAddress) => {
    // Set the new default address via an API call
    axios.put(`/user/${userId}/addresses/${newDefaultAddress.id}`, { isDefault: true })
      .then(() => {
        // After setting the new default, allow deletion of the original default address
        handleDeleteConfirm();
        
        // Close the select default dialog and delete dialog
        setOpenSelectDefaultDialog(false);
        setOpenDeleteDialog(false);
      })
      .catch(error => {
        console.error("Error setting new default address:", error);
      });
  };
  
  // Handle confirming address deletion
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/user/${userId}/addresses/${addressToDelete.id}`);
      fetchUserData();
      setShowDeleteSuccess(true); 
      setOpenSelectDefaultDialog(false);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedAddress(null);
  };

  const handleClosePopup = () => {
    setShowSuccess(false);
    setShowDeleteSuccess(false);
    setShowDeleteError(false);
  };

  

  return (
    <Box className="layout-container" sx={{ display: 'flex', overflow: 'hidden' }}>
      <Sidenav_user className="sidebar" />
      <Box className="main-content" sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
        {!showForm && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Address Management</Typography>
            <Button variant="contained" onClick={handleAddAddress}>
              + Add Address
            </Button>
          </Box>
        )}

        {/* Display message when there are no addresses */}
        {!showForm && addresses.length === 0 && (
          <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
            No address is found. Please enter an address.
          </Typography>
        )}

        {!showForm && addresses.length > 0 && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', padding: '10px 0' }}>
              <Typography variant="body1" sx={{ width: '10%' }}>#</Typography>
              <Typography variant="body1" sx={{ width: '40%' }}>Address</Typography>
              <Typography variant="body1" sx={{ width: '35%' }}>City</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>Default</Typography>
              <Typography variant="body1" sx={{ width: '20%' }}>Action</Typography>
            </Box>

            {addresses.map((addr, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <Typography sx={{ width: '10%' }}>{index + 1}</Typography>
                <Typography sx={{ width: '40%' }}>{addr.address}</Typography>
                <Typography sx={{ width: '35%' }}>{addr.city}</Typography>
                <Typography sx={{ width: '30%' }}>{addr.isDefault ? "Yes" : "No"}</Typography>
                <Box sx={{ width: '20%', display: 'flex', gap: 1 }}>
                  <Button onClick={() => { setSelectedAddress(addr); setShowForm(true); }}>
                    <EditLocationAltIcon /> Edit
                  </Button>
                  <Button color="error" onClick={() => handleDeleteClick(addr)}>
                    <DeleteOutlineIcon /> Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {showForm && (
          <AddressFormPage 
            onSubmit={handleAddressSubmitted}
            existingAddress={selectedAddress}
            onCancel={handleCancel}
          />
        )}

        {/* Success Popup Notification (Add/Update) */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={1000}
          onClose={handleClosePopup}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%'}}>
            Address successfully {selectedAddress ? "updated" : "added"}!
          </Alert>
        </Snackbar>

        {/* Success Popup Notification (Delete) */}
        <Snackbar
          open={showDeleteSuccess}
          autoHideDuration={1000}
          onClose={handleClosePopup}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            sx={{ width: '100%'}}
          >
            Address successfully deleted!
          </Alert>
        </Snackbar>

        {/* Error Popup Notification for Default Address Deletion */}
        <Snackbar
          open={showDeleteError}
          autoHideDuration={1000}
          onClose={handleClosePopup}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            sx={{ width: '100%'}}
          >
            You cannot delete the default address without selecting another default!
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this address?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteAddress} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Select New Default Address Dialog */}
        <Dialog
          open={openSelectDefaultDialog}
          onClose={() => setOpenSelectDefaultDialog(false)}
        >
          <DialogTitle>Set a New Default Address</DialogTitle>
          <DialogContent>
            <Typography>You are required to select a new default address before deletion:</Typography>
            <Box>
              {addresses
                .filter(addr => addressToDelete && addr.id !== addressToDelete.id)
                .map((addr) => (
                  <Button
                    key={addr.id}
                    onClick={() => handleSelectNewDefault(addr)}
                    fullWidth
                  >
                    {addr.address} | {addr.city}
                  </Button>
                ))}
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AddressMain;