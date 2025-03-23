import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AddressDetails from "../components/Address_details";
import AddressFormPage from "./Address_form"; 
import { getAddresses, createAddress, updateAddress } from "../services/api";

const AddressMain = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch all addresses
  const fetchAddresses = async () => {
    const { data } = await getAddresses();
    setAddresses(data);
    if (data.length > 0) setSelectedAddress(data[0]);
  };

  // Show the form to add a new address
  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null);
  };

  // Save or update an address
  const handleSaveAddress = async (address) => {
    if (address.id) {
      await updateAddress(address.id, address);
    } else {
      await createAddress(address);
    }
    setShowForm(false);
    fetchAddresses();
  };

  // Handle tab switch for address selection
  const handleTabChange = (event, newValue) => {
    setSelectedAddress(addresses[newValue]);
    setShowForm(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Address Management
      </Typography>

      {!showForm && (
        <>
          {/* Tabs for each address */}
          <Tabs 
            value={selectedAddress ? addresses.indexOf(selectedAddress) : 0}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {addresses.map((address, index) => (
              <Tab key={address.id} label={address.street} />
            ))}
          </Tabs>

          {selectedAddress && <AddressDetails address={selectedAddress} />}

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAddress}
            sx={{ mt: 2 }}
          >
            + Add Address
          </Button>
        </>
      )}

      {showForm && (
        <AddressFormPage 
          onSubmit={handleSaveAddress} 
          existingAddress={selectedAddress} 
        />
      )}
    </Box>
  );
};

export default AddressMain;