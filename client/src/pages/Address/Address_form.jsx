import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import axios from '../../http'; // Make sure to import axios instance with the correct base URL

function AddressFormPage({ existingAddress, onSubmit, onCancel }) {
  const formik = useFormik({
    initialValues: {
      street: existingAddress?.street || "",
      city: existingAddress?.city || "",
      country: existingAddress?.country || "",
      zipCode: existingAddress?.zipCode || "",
      isDefault: existingAddress?.isDefault || false, // This will be boolean
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
          isDefault: data.isDefault === "true" ? true : false, // Ensure it's a boolean
        };

        const userId = 1; // Replace with the actual user ID if needed
        // Choose the correct method (POST for adding, PUT for updating)
        const url = existingAddress
          ? `/user/${userId}/addresses/${existingAddress.id}` // URL for updating address, including address ID
          : `/user/${userId}/addresses`; // URL for adding a new address, no ID needed

        // Send the request to the appropriate URL
        const response = await axios[existingAddress ? 'put' : 'post'](url, addressData);
        console.log('API Response:', response.data);
        onSubmit(response.data); // Handle the response
      } catch (error) {
        console.error('Error creating/updating address:', error);
      }
    },
  });

  useEffect(() => {
    if (existingAddress) formik.setValues({ ...formik.values, ...existingAddress });
  }, [existingAddress]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {existingAddress ? "Edit Address" : "Add Address"}
      </Typography>

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
          label="Zip Code"
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
