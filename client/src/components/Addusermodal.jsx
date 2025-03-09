import React, { useState, useEffect } from 'react';
import { IconButton, Typography, Box, TextField, Button, Modal } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseIcon from "@mui/icons-material/Close";
import http from '../http';

function Addusermodal({ closeEvent, open, user }) {

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      number: user?.number || "",
      address: user?.address || ""
    },
    validationSchema: yup.object({
      name: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters')
        .required('Name is required'),
      email: yup.string().trim()
        .min(3, 'Email must be at least 3 characters')
        .max(500, 'Email must be at most 500 characters')
        .required('Email is required'),
      number: yup.string()
        .matches(/^\d+$/)
        .length(8, "Mobile number must be 8 digits")
        .test("len", "Mobile number must be 8 digits", (val) => val && val.toString().length === 8)
        .required('Mobile number is required'),
      address: yup.string().trim()
        .min(3, 'Address must be at least 3 characters')
        .max(500, 'Address must be at most 500 characters')
        .required('Address is required')
    }),
    onSubmit: (data) => {
      const trimmedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        number: data.number.trim(),
        address: data.address.trim()
      };
  
      if (user?.id) {
        http.put(`/user/${user.id}`, trimmedData) //Send PUT request
          .then((res) => {
            console.log("User updated:", res.data);
            closeEvent();
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      } else {
        http.post("/user", trimmedData) //Send POST request
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
  
  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      formik.resetForm({ values: { ...formik.initialValues, ...user } });
    }
  }, [user]);
  
  const onClose = () => {
    formik.resetForm({ values: formik.initialValues });
    closeEvent();
  };  

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="adduserModal" sx={{ m: 2 }}>
          <Typography variant="h5" align="center">
            {!user ? "Add" : "Edit"} User
          </Typography>
          <IconButton className="closebutton" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Box height="flex" component="form" sx={{ p: 2 }} onSubmit={formik.handleSubmit} >
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  id="outlined-basic"
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
                  id="outlined-basic"
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
                  id="outlined-basic"
                  label="Mobile Number"
                  name="number"
                  variant="outlined"
                  size="small"
                  type="tel"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 8 }}
                  value={formik.values.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    formik.setFieldValue("number", value); // Update only with numbers
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.number && Boolean(formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                  sx={{ minWidth: "100%" }} />
              </Grid>
              <Grid size={12}>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  name="address"
                  variant="outlined"
                  size="small"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  sx={{ minWidth: "100%" }} />
              </Grid>
              <Grid size={12}>
                <Typography variant="h5" align="center">
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  )
}


export default Addusermodal