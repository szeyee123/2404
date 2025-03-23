import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddressFormPage from "./Address_form";
import Sidenav_user from '../../components/Sidenav_user';
import axios from '../../http'; 

function AddressMain() {
  const [addresses, setAddresses] = useState([]); // To store user addresses
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data and their addresses
  const fetchUserData = async () => {
    try {
      const userId = 1;
      const response = await axios.get(`/user/${userId}/addresses`);
      setAddresses(response.data); 
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };
  
  

  // Handle add new address action
  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null); // Set to null for a new address
  };

  // Handle successful form submission
  const handleAddressSubmitted = () => {
    // Fetch the updated addresses
    fetchUserData();
    // Close the form
    handleCancel();
  };
  

  // Handle cancel action
  const handleCancel = () => {
    setShowForm(false);
    setSelectedAddress(null);
  };

  return (
    <Box className="layout-container" sx={{ display: 'flex', overflow: 'hidden' }}>
      <Sidenav_user className="sidebar" />
      <Box className="main-content" sx={{ flexGrow: 1, p: 3 , overflow: 'hidden' }}>
        {/* Conditional Rendering of Header */}
        {!showForm && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Address Management</Typography>
            <Button
              variant="contained"
              onClick={handleAddAddress}
            >
              + Add Address
            </Button>
          </Box>
        )}

        {/* Displaying addresses if user is fetched */}
        {!showForm && addresses.length > 0 && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', padding: '10px 0' }}>
              <Typography variant="body1" sx={{ width: '10%' }}>#</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>Street</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>City</Typography>
              <Typography variant="body1" sx={{ width: '20%' }}>Default</Typography>
              <Typography variant="body1" sx={{ width: '10%' }}>Action</Typography>
            </Box>

            {addresses.map((addr, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <Typography sx={{ width: '10%' }}>{index + 1}</Typography> {/* Index Column */}
                <Typography sx={{ width: '30%' }}>{addr.street}</Typography>
                <Typography sx={{ width: '30%' }}>{addr.city}</Typography>
                <Typography sx={{ width: '20%' }}>{addr.isDefault ? "Yes" : "No"}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowForm(true); // Show form for editing this address
                  }}
                  sx={{ padding: "6px 12px", fontSize: "0.875rem" }}
                >
                  Edit Details
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* Show the form when adding or editing an address */}
        {showForm && (
          <AddressFormPage
            onSubmit={handleAddressSubmitted}
            existingAddress={selectedAddress}
            onCancel={handleCancel}
          />
        )}
      </Box>
    </Box>
  );
}

export default AddressMain;
