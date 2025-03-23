import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddressFormPage from "./Address_form";
import Sidenav_user from '../../components/Sidenav_user';
import axios from '../../http';  // Import the axios instance

function AddressMain() {
  const [addresses, setAddresses] = useState([]); // Addresses state
  const [selectedAddress, setSelectedAddress] = useState(null); // Selected address for editing
  const [showForm, setShowForm] = useState(false); // State to show/hide form

  useEffect(() => {
    fetchAddresses(); // Fetch addresses on component mount
  }, []);

  // Fetch addresses from the backend
  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/user"); 
      setAddresses(response.data); 
      if (response.data.length) setSelectedAddress(response.data[0]);  // Select the first address by default
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Add a new address
  const handleAddAddress = () => {
    setShowForm(true); // Show the address form
    setSelectedAddress(null); // Reset selected address
  };

  // Save address (either add new or update existing)
  const handleSaveAddress = async (address) => {
    try {
      if (address.id) {
        // Update existing address
        await axios.put(`/api/addresses/${address.id}`, address);
      } else {
        // Create new address
        await axios.post("/api/addresses", address);
      }
      setShowForm(false); // Close the form
      await fetchAddresses(); // Re-fetch the addresses
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowForm(false); // Close the form
    setSelectedAddress(null); // Reset selected address
  };

  return (
    <Box className="layout-container" sx={{ display: 'flex' }}>
      <Sidenav_user className="sidebar" />
      <Box className="main-content" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Address Management</Typography>
          <Button
            variant="contained"
            onClick={handleAddAddress}
          >
            + Add Address
          </Button>
        </Box>

        {/* Address Table */}
        {!showForm && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', padding: '10px 0' }}>
              <Typography variant="body1" sx={{ width: '10%' }}>#</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>Street</Typography>
              <Typography variant="body1" sx={{ width: '30%' }}>City</Typography>
              <Typography variant="body1" sx={{ width: '20%' }}>Default</Typography>
              <Typography variant="body1" sx={{ width: '10%' }}>Action</Typography>
            </Box>

            {/* Render address list */}
            {addresses.map((addr, index) => (
              <Box key={addr.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <Typography sx={{ width: '10%' }}>{index + 1}</Typography> {/* Address Index */}
                <Typography sx={{ width: '30%' }}>{addr.street}</Typography>
                <Typography sx={{ width: '30%' }}>{addr.city}</Typography>
                <Typography sx={{ width: '20%' }}>{addr.isDefault ? "Yes" : "No"}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedAddress(addr); // Set the address for editing
                    setShowForm(true); // Show the form for editing
                  }}
                  sx={{ padding: "6px 12px", fontSize: "0.875rem" }}
                >
                  Edit Details
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* Address Form */}
        {showForm && (
          <AddressFormPage
            onSubmit={handleSaveAddress}
            existingAddress={selectedAddress}
            onCancel={handleCancel}
          />
        )}

      </Box>
    </Box>
  );
}

export default AddressMain;