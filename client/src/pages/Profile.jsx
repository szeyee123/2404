import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

function Profile() {
  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>

          <Card sx={{ maxWidth: 600, p: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80 }} src="https://via.placeholder.com/80" />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Full Name:</Typography>
                  <Typography variant="body1">Admin</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Email:</Typography>
                  <Typography variant="body1">admin@gmail.com</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Description:</Typography>
                  <Typography variant="body1">This is the admin account</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
