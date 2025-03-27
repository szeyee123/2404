import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useRef, useEffect } from "react";
import axios from '../../http';
import SearchIcon from '@mui/icons-material/Search';

function AddressFormPage({ existingAddress, onSubmit, onCancel }) {
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [duplicateSnackbar, setDuplicateSnackbar] = useState(false); // For duplicate address alert

  const textFieldRef = useRef(null);
  const [textFieldHeight, setTextFieldHeight] = useState(56);

  useEffect(() => {
    if (textFieldRef.current) {
      setTextFieldHeight(textFieldRef.current.offsetHeight);
    }
  }, [postalCode, error, loading]);

  // Fetch the list of addresses from the database
  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/user/1/addresses");
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();  // Fetch addresses when component mounts
  }, []);

  const formik = useFormik({
    initialValues: {
      address: existingAddress?.address || "",
      city: existingAddress?.city || "",
      country: existingAddress?.country || "",
      zipCode: existingAddress?.zipCode || "",
      isDefault: null, // Set initial value to null (no preselection)
    },
    validationSchema: yup.object({
      address: yup.string().trim().min(3, "Address must be at least 3 characters").required("Address is required"),
      city: yup.string().trim().min(2, "City must be at least 2 characters").required("City is required"),
      country: yup.string().trim().min(2, "Country must be at least 2 characters").required("Country is required"),
      zipCode: yup.string()
        .trim()
        .matches(/^\d{6}$/, "Zip Code must be a 6-digit number")
        .required("Zip Code is required"),
      isDefault: yup.boolean().required("Please select if this is your default address"),
    }),

    onSubmit: async (data) => {
      // Check if the address already exists in the database
      const duplicateAddress = addresses.find(
        (address) =>
          address.zipCode === data.zipCode &&
          address.address === data.address
      );

      if (duplicateAddress) {
        // Show the duplicate address warning popup
        setDuplicateSnackbar(true);
        return;
      }

      try {
        if (addresses.length === 0) {
          data.isDefault = true;
        } else {
          if (data.isDefault === "true") {
            const updateAddresses = addresses.map((address) => ({
              ...address,
              isDefault: false,
            }));
            for (const address of updateAddresses) {
              await axios.put(`/user/1/addresses/${address.id}`, address);
            }
          }
        }

        const addressData = {
          ...data,
          isDefault: data.isDefault === "true",
        };

        const userId = 1;
        const url = existingAddress
          ? `/user/${userId}/addresses/${existingAddress.id}`
          : `/user/${userId}/addresses`;

        const response = await axios[existingAddress ? 'put' : 'post'](url, addressData);
        console.log('API Response:', response.data);
        onSubmit(response.data); 
      } catch (error) {
        console.error('Error creating/updating address:', error);
      }
    }
  });

  const handleSearchPostalCode = async () => {
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
      const authToken = '[eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaW50ZXJuYWwtYWxiLW9tLXByZGV6aXQtaXQtbmV3LTE2MzM3OTk1NDIuYXAtc291dGhlYXN0LTEuZWxiLmFtYXpvbmF3cy5jb20vYXBpL3YyL3VzZXIvcGFzc3dvcmQiLCJpYXQiOjE3NDI5OTQ1MTAsImV4cCI6MTc0MzI1MzcxMCwibmJmIjoxNzQyOTk0NTEwLCJqdGkiOiJnOWtIUEVYZ0IwN1J3ZGUyIiwic3ViIjoiMTc5YjYwNDljYWU5OWJmNWJhYmUzMGZmMzAyOTZiYzMiLCJ1c2VyX2lkIjo2NTUxLCJmb3JldmVyIjpmYWxzZX0.AkJzuBS4_t1YPSySqTpHqLb3ZSB8FjzhU63XPXZkftM]';
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
        formik.setValues({
          ...formik.values,
          address: address.ADDRESS,
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

  const handleCancel = () => {
    if (addresses.length === 0) {
      setOpenSnackbar(true);
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [openSnackbar]);

  // Close duplicate address alert after 3 seconds
  useEffect(() => {
    if (duplicateSnackbar) {
      const timer = setTimeout(() => {
        setDuplicateSnackbar(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [duplicateSnackbar]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {existingAddress ? "Edit Address" : "Add Address"}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          ref={textFieldRef}
          fullWidth
          label="Search Your Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchPostalCode()}
          error={Boolean(error)}
          helperText={error || (loading ? "Loading..." : "")}
          sx={{
            borderRadius: '4px 0 0 4px',
            height: `${textFieldHeight}px`,
            marginBottom: error ? '24px' : '0',
          }}
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
            marginBottom: error ? '24px' : '0',
            '&:hover': {
              backgroundColor: '#9ABADB',
            },
          }}
          onClick={handleSearchPostalCode}
        >
          <SearchIcon
            style={{
              color: 'gray',
              transition: 'color 0.3s, transform 0.3s',
            }}
          />
        </Box>
      </Box>

      <hr />

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
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

        <FormControl component="fieldset" sx={{ mt: 2 }} error={formik.touched.isDefault && Boolean(formik.errors.isDefault)}>
          <FormLabel component="legend" sx={{ color: formik.touched.isDefault && formik.errors.isDefault ? 'red' : 'inherit' }}>
            Set as Default Address
          </FormLabel>
          <RadioGroup
            row
            name="isDefault"
            value={formik.values.isDefault}
            onChange={(e) => formik.setFieldValue("isDefault", e.target.value)} 
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
          {formik.touched.isDefault && formik.errors.isDefault && (
            <Typography color="error" variant="body2">{formik.errors.isDefault}</Typography>
          )}
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" type="submit">
            {existingAddress ? "Update Address" : "Add Address"}
          </Button>

          <Button variant="outlined" onClick={handleCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </form>

      {/* Snackbar for cancel alert */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{
          position: 'fixed',
          top: '50%', 
          left: '56%', 
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Alert severity="warning" >
          You need to set a default address. Please add one.
        </Alert>
      </Snackbar>

      {/* Snackbar for duplicate address alert */}
      <Snackbar
        open={duplicateSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{
          position: 'fixed',
          top: '50%', 
          left: '56%', 
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Alert severity="error" >
          This address already exists. Please change the address.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddressFormPage;
