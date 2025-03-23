import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddressFormPage from "./Address_form";
import Sidenav_user from '../../components/Sidenav_user';
import axios from '../../http'; 

function AddressMain() {
  const [addresses, setAddresses] = useState([]); // To store user addresses
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null); // To store selected user

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data and their addresses
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/user");  // Get the list of users
      const userData = response.data[0]; // Assuming you want to fetch addresses for the first user (adjust logic as needed)
      setUser(userData);  // Set the user data
      setAddresses(userData.addresses);  // Set addresses of the selected user
      if (userData.addresses.length) setSelectedAddress(userData.addresses[0]); // Set the default address
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle add new address action
  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null); // Set to null for a new address
  };

  // Save address (either add new or update existing)
  const handleSaveAddress = async (address) => {
    try {
      if (address.id) {
        await axios.put(`/user/${address.id}`, address); // Update existing address
      } else {
        await axios.post("/user", address); // Create new address
      }
      setShowForm(false);
      await fetchUserData(); // Re-fetch user data with updated addresses
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowForm(false);
    setSelectedAddress(null);
  };

  return (
    <Box className="layout-container" sx={{ display: 'flex' }}>
      <Sidenav_user className="sidebar" />
      <Box className="main-content" sx={{ flexGrow: 1, p: 3 }}>
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
        {!showForm && user && addresses.length > 0 && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', padding: '10px 0' }}>
              <Typography variant="body1" sx={{ width: '10%' }}>#</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>Street</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>City</Typography>
              <Typography variant="body1" sx={{ width: '20%' }}>Default</Typography>
              <Typography variant="body1" sx={{ width: '10%' }}>Action</Typography>
            </Box>

            {/* Loop through addresses to display each address */}
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
            onSubmit={handleSaveAddress}
            existingAddress={selectedAddress}
            onCancel={handleCancel}
            userData={user} // Pass the user data to AddressFormPage
          />
        )}
      </Box>
    </Box>
  );
}

export default AddressMain;
