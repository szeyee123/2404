import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddressDetails from "../../components/Address_details";
import AddressFormPage from "./Address_form";
import Sidenav_user from '../../components/Sidenav_user';

function AddressMain() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch all addresses from the backend
  const fetchAddresses = async () => {
    try {
      const { data } = await getAddresses();
      setAddresses(data);
      if (data.length) setSelectedAddress(data[0]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Add a new address
  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null);
  };

  // Save address (either add new or update existing)
  const handleSaveAddress = async (address) => {
    try {
      if (address.id) {
        await updateAddress(address.id, address); 
      } else {
        await createAddress(address); 
      }
      setShowForm(false);
      await fetchAddresses(); 
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Address Management</Typography>
          <Button
            variant="contained"
            onClick={handleAddAddress}
          >
            + Add Address
          </Button>
        </Box>
        
        {/* Table showing address list */}
        {!showForm && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ddd', padding: '10px 0' }}>
              <Typography variant="body1" sx={{ width: '33%' }}>Street</Typography>
              <Typography variant="body1" sx={{ width: '33%' }}>City</Typography>
              <Typography variant="body1" sx={{ width: '33%' }}>Action</Typography>
            </Box>

            {addresses.map((addr) => (
              <Box key={addr.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <Typography sx={{ width: '33%' }}>{addr.street}</Typography>
                <Typography sx={{ width: '33%' }}>{addr.city}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowForm(false);
                  }}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </Box>
        )}
        
        {showForm && (
          <AddressFormPage
            onSubmit={handleSaveAddress}
            existingAddress={selectedAddress}
            onCancel={handleCancel} // Pass the cancel handler to the AddressFormPage component
          />
        )}

        {/* Show Address Details */}
        {selectedAddress && !showForm && (
          <AddressDetails address={selectedAddress} />
        )}
      </Box>
    </Box>
  );
}

export default AddressMain;
