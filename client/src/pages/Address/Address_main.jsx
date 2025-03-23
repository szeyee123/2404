import { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AddressDetails from "../components/Address_details";
import AddressFormPage from "./Address_form";
import { getAddresses, createAddress, updateAddress } from "../services/api";

const AddressMain = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      const { data } = await getAddresses();
      setAddresses(data);
      if (data.length) setSelectedAddress(data[0]);
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    setShowForm(true);
    setSelectedAddress(null);
  };

  const handleSaveAddress = async (address) => {
    address.id ? await updateAddress(address.id, address) : await createAddress(address);
    setShowForm(false);
    const { data } = await getAddresses();
    setAddresses(data);
    if (data.length) setSelectedAddress(data[0]);
  };

  return (
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
  );
};

export default AddressMain;