import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidenav_user from '../../components/Sidenav_user';

function AddressFormPage({ existingAddress, onSubmit, onCancel }) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      street: existingAddress?.street || "",
      city: existingAddress?.city || "",
      country: existingAddress?.country || "",
      zipcode: existingAddress?.zipcode || "",
    },
    validationSchema: yup.object({
      street: yup.string().trim().min(3, "Street must be at least 3 characters").required("Street is required"),
      city: yup.string().trim().min(2, "City must be at least 2 characters").required("City is required"),
      country: yup.string().trim().min(2, "Country must be at least 2 characters").required("Country is required"),
      zipcode: yup.string().trim().matches(/^\d+$/, "Zip Code must be a number").required("Zip Code is required"),
    }),
    onSubmit: (data) => {
      onSubmit(data); // Use the onSubmit function passed from the parent
    },
  });

  useEffect(() => {
    if (existingAddress) formik.setValues(existingAddress);
  }, [existingAddress]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {existingAddress ? "Edit Address" : "Add Address"}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
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
          name="zipcode"
          value={formik.values.zipcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
          helperText={formik.touched.zipcode && formik.errors.zipcode}
        />

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
