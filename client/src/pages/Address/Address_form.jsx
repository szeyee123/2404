import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputAdornment } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import axios from '../../http';
import SearchIcon from '@mui/icons-material/Search';

function AddressFormPage({ existingAddress, onSubmit, onCancel }) {
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      street: existingAddress?.street || "",
      city: existingAddress?.city || "",
      country: existingAddress?.country || "",
      zipCode: existingAddress?.zipCode || "",
      isDefault: existingAddress?.isDefault || false, 
    },
    validationSchema: yup.object({
      street: yup.string().trim().min(3, "Street must be at least 3 characters").required("Street is required"),
      city: yup.string().trim().min(2, "City must be at least 2 characters").required("City is required"),
      country: yup.string().trim().min(2, "Country must be at least 2 characters").required("Country is required"),
      zipCode: yup.string().trim().matches(/^\d+$/, "Zip Code must be a number").required("Zip Code is required"),
    }),
    onSubmit: async (data) => {
      try {
        const addressData = {
          ...data,
          isDefault: data.isDefault === "true" ? true : false, 
        };

        const userId = 1;

        const url = existingAddress
          ? `/user/${userId}/addresses/${existingAddress.id}` 
          : `/user/${userId}/addresses`;

        // Send the request to the appropriate URL
        const response = await axios[existingAddress ? 'put' : 'post'](url, addressData);
        console.log('API Response:', response.data);
        onSubmit(response.data); 
      } catch (error) {
        console.error('Error creating/updating address:', error);
      }
    },
  });

  // Function to handle search by postal code
  const handleSearchPostalCode = async () => {
    if (!postalCode) return;

    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const authToken = '[mytoken]';
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
        // Set the fetched address to formik values
        formik.setValues({
          ...formik.values,
          street: address.ADDRESS,
          city: 'Singapore',
          country: 'Singapore', 
          zipCode: postalCode, 
        });
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

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {existingAddress ? "Edit Address" : "Add Address"}
      </Typography>

      {/* Search Bar for Postal Code */}
      <TextField
        fullWidth
        label="Search Your Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearchPostalCode()} // Trigger search on Enter key
        margin="normal"
        error={Boolean(error)}
        helperText={error || (loading ? "Loading..." : "")}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon onClick={handleSearchPostalCode} style={{ cursor: 'pointer' }} /> {/* Search icon */}
            </InputAdornment>
          ),
        }}
      />

      <hr></hr>

      <form onSubmit={formik.handleSubmit}>
        {/* Address Fields - User can fill these out */}
        <TextField
          fullWidth
          margin="normal"
          label="Street"
          name="street"
          value={formik.values.street}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.street && Boolean(formik.errors.street)}
          helperText={formik.touched.street && formik.errors.street}
        />

        <TextField
          fullWidth
          margin="normal"
          label="City"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Country"
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Postal Code"
          name="zipCode"
          value={formik.values.zipCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
          helperText={formik.touched.zipCode && formik.errors.zipCode}
        />

        {/* Default Address Radio Button */}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Set as Default Address</FormLabel>
          <RadioGroup
            row
            name="isDefault"
            value={formik.values.isDefault.toString()}
            onChange={(e) => formik.setFieldValue("isDefault", e.target.value)} 
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" type="submit">
            {existingAddress ? "Update Address" : "Add Address"}
          </Button>

          <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddressFormPage;