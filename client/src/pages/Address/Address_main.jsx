import { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AddressDetails from "../../components/Address_details";
import AddressFormPage from "./Address_form";
import Sidenav from '../../components/Sidenav_user';

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
      await fetchAddresses(); // Refresh the address list
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidenav />
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Address Management</Typography>

        {!showForm ? (
          <>
            <Tabs
              value={selectedAddress ? addresses.indexOf(selectedAddress) : 0}
              onChange={(e, index) => {
                setSelectedAddress(addresses[index]);
                setShowForm(false);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {addresses.map((addr) => (
                <Tab key={addr.id} label={addr.street} />
              ))}
            </Tabs>

            {selectedAddress && <AddressDetails address={selectedAddress} />}

            <Button
              variant="contained"
              onClick={handleAddAddress}
              sx={{ mt: 2 }}
            >
              + Add Address
            </Button>
          </>
        ) : (
          <AddressFormPage
            onSubmit={handleSaveAddress}
            existingAddress={selectedAddress}
          />
        )}
      </Box>
    </Box>
  );
}

export default AddressMain;
