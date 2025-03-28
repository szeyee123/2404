import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Typography, Box, TextField, Button, Modal, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseIcon from "@mui/icons-material/Close";
import http from '../http';
import SearchIcon from '@mui/icons-material/Search';

function Usermodal({ existingAddress, closeEvent, open, user }) {
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState(user?.addresses || [{ address: '', city: '', country: '', zipCode: '', isDefault: false }]);

  const textFieldRef = useRef(null);
  const [textFieldHeight, setTextFieldHeight] = useState(56);

  useEffect(() => {
    if (textFieldRef.current) {
      setTextFieldHeight(textFieldRef.current.offsetHeight);
    }
  }, [postalCode, error, loading]);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      number: user?.number || "",
      status: user?.status || "active",
      addresses: existingAddress
        ? [{ ...existingAddress, isDefault: null }]
        : [],
    },
    validationSchema: yup.object({
      name: yup.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name must be at most 100 characters').required('Name is required'),
      email: yup.string().trim().min(3, 'Email must be at least 3 characters').max(500, 'Email must be at most 500 characters').required('Email is required'),
      number: yup.string().matches(/^\d+$/).length(8, "Mobile number must be 8 digits").required('Mobile number is required'),
      addresses: yup.array().of(
        yup.object({
          address: yup.string().required('Address is required'),
          city: yup.string().required('City is required'),
          country: yup.string().required('Country is required'),
          zipCode: yup.string().required('Zip code is required'),
          isDefault: yup.boolean(),
        })
      ),      
    }),
    onSubmit: (data) => {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        number: data.number.trim(),
        status: data.status,
        addresses: addresses.map(address => ({
          address: address.address.trim(),
          city: address.city.trim(),
          country: address.country.trim(),
          zipCode: address.zipCode.trim(),
          isDefault: address.isDefault
        })),
      };

      if (user?.id) {
        http.put(`/user/${user.id}`, trimmedData)
          .then((res) => {
            console.log("User updated:", res.data);
            closeEvent();
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      } else {
        http.post("/user", trimmedData)
          .then((res) => {
            console.log("User created:", res.data);
            closeEvent();
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error creating user:", error);
          });
      }
    }
  });

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index][name] = value;
    setAddresses(updatedAddresses);
  };

  // const handleAddAddress = () => {
  //   setAddresses([...addresses, { address: '', city: '', country: '', zipCode: '', isDefault: '' }]);
  // };

  // const handleRemoveAddress = (index) => {
  //   const updatedAddresses = addresses.filter((_, i) => i !== index);
  //   setAddresses(updatedAddresses);
  // };

  const onClose = () => {
    formik.resetForm();
    closeEvent();
    window.location.reload();
  };

  const handleSearchPostalCode = async (index) => {
    if (!postalCode) {
      setError("Please enter a postal code");
      return;
    }

    if (!/^\d{6}$/.test(postalCode)) {
      setError("Postal code must be a 6-digit number");
      return; 
    }

    setLoading(true);
    setError(""); 

    try {
      const authToken = '[YOUR_AUTH_TOKEN]';
      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        const address = data.results[0];
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = {
          ...updatedAddresses[index],
          address: address.ADDRESS,
          city: 'Singapore',
          country: 'Singapore',
          zipCode: postalCode,
        };
        setAddresses(updatedAddresses);
      } else {
        setError("No address found for this postal code");
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
      setError("Failed to fetch address data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      formik.resetForm({ values: { ...formik.initialValues, ...user } });
      setAddresses(user.addresses || []);
    }
    else {
      formik.resetForm();
      setAddresses([{ address: '', city: '', country: '', zipCode: '', isDefault: true }]);
    }
  }, [user]);

  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box className="adduserModal" sx={{ m: 2 , maxHeight: '90vh', overflowY: 'auto' }}>
        <Typography variant="h5" align="center">
          {!user ? "Add" : "Edit"} User
        </Typography>
        <IconButton className="closebutton" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Name"
                name="name"
                variant="outlined"
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ minWidth: "100%" }} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                size="small"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ minWidth: "100%" }} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Mobile Number"
                name="number"
                variant="outlined"
                size="small"
                type="tel"
                value={formik.values.number}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 8 }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.number && Boolean(formik.errors.number)}
                helperText={formik.touched.number && formik.errors.number}
                sx={{ minWidth: "100%" }} />
            </Grid>
            <Grid size={12}>
              {addresses.map((address, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">Address {index + 1}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      ref={textFieldRef}
                      fullWidth
                      label="Search Your Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchPostalCode(index)}
                      error={Boolean(error)}
                      helperText={error || (loading ? "Loading..." : "")}
                      sx={{ borderRadius: '4px 0 0 4px', height: `${textFieldHeight}px` }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#B3D9FF',
                        padding: '0 16px',
                        cursor: 'pointer',
                        borderRadius: '0 4px 4px 0',
                        height: `${textFieldHeight}px`,
                        '&:hover': { backgroundColor: '#9ABADB' },
                      }}
                      onClick={() => handleSearchPostalCode(index)}
                    >
                      <SearchIcon />
                    </Box>
                  </Box>
                  <hr />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Address"
                    name={`addresses[${index}].address`}
                    value={address.address}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="City"
                    name={`addresses[${index}].city`}
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Country"
                    name={`addresses[${index}].country`}
                    value={address.country}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Postal Code"
                    name={`addresses[${index}].zipCode`}
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                  <FormControl component="fieldset" sx={{ mt: 2 }} error={formik.touched.isDefault && Boolean(formik.errors.isDefault)}>
                    <FormLabel component="legend" sx={{ color: formik.touched.isDefault && formik.errors.isDefault ? 'red' : 'inherit' }}>
                      Set as Default Address
                    </FormLabel>
                    <RadioGroup
                      row
                      name={`addresses[${index}].isDefault`}  // Make sure this is for the specific address
                      value={address.isDefault}  // Use the individual address's `isDefault` value
                      onChange={(e) => {
                        const updatedAddresses = [...addresses];
                        updatedAddresses[index].isDefault = e.target.value === 'true';  // Set it as boolean
                        setAddresses(updatedAddresses);  // Update the state with the new address list
                      }}
                    >
                      <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    </RadioGroup>
                  </FormControl>

                </Box>
              ))}
            </Grid>
            <Grid size={12}>
              <Button variant="contained" type="submit" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default Usermodal;
