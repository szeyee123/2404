import React, {useState, useEffect} from 'react';
import { IconButton, Typography, Box, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseIcon from "@mui/icons-material/Close";
import http from '../http';

function Addusermodal({closeEvent}) {

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      number: "",
      address: ""
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
      data.name = data.name.trim();
      data.email = data.email.trim();
      data.number = data.number.trim();
      data.address = data.address.trim();
      http.post("/user", data)
          .then((res) => {
              console.log(res.data);
              // closeEvent();
              
          })
          .catch((error) => {
            console.error("There was an error submitting the data:", error);
          });
  }

  });


  return (
    <>
      <Box sx={{ m: 2}}/>
      <Typography variant="h5" align="center">
          Add User
      </Typography>
      <IconButton className="closebutton" onClick={closeEvent}>
        <CloseIcon/>
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
                    sx={{ minWidth: "100%" }}/>
          </Grid>
          <Grid size ={12}>
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
                    sx={{ minWidth: "100%" }}/>
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
                    sx={{ minWidth: "100%" }}/>
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
                    sx={{ minWidth: "100%" }}/>
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
      
    </>
  )
}

// function Addusermodal({closeEvent}) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [number, setNumber] = useState("");
//   const [address, setAddress] = useState("");

//   const handleNameChange = (event) => {
//     setName(event.target.value);
//   }

//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   }

//   const handleNumberChange = (event) => {
//     setNumber(event.target.value);
//   }

//   const handleAddressChange = (event) => {
//     setAddress(event.target.value);
//   }

//   const createUser = ()=> {

//   }

//   return (
//     <>
//       <Box sx={{ m: 2}}/>
//       <Typography variant="h5" align="center">
//           Add User
//       </Typography>
//       <IconButton className="closebutton" onClick={closeEvent}>
//         <CloseIcon/>
//       </IconButton>
//       <Box height={20}/>
//       <Grid container spacing={2}>
//         <Grid size={12}>
//           <TextField id="outlined-basic" label="Name" variant="outlined" size="small" value={name} onChange={handleNameChange} sx={{ minWidth: "100%" }}/>
//         </Grid>
//         <Grid size ={12}>
//           <TextField id="outlined-basic" label="Email" variant="outlined" size="small" value={email} onChange={handleEmailChange} sx={{ minWidth: "100%" }}/>
//         </Grid>
//         <Grid size={12}>
//           <TextField id="outlined-basic" label="Mobile Number" variant="outlined" size="small" value={number} onChange={handleNumberChange} sx={{ minWidth: "100%" }}/>
//         </Grid>
//         <Grid size={12}>
//           <TextField id="outlined-basic" label="Address" variant="outlined" size="small" value={address} onChange={handleAddressChange} sx={{ minWidth: "100%" }}/>
//         </Grid>
//         <Grid size={12}>
//           <Typography variant="h5" align="center">
//             <Button variant="contained" onClick={createUser}>
//               Submit
//             </Button>
//           </Typography>
//         </Grid>
//       </Grid>
//       <Box sx={{ m: 4}} />
      
//     </>
//   )
// }

export default Addusermodal