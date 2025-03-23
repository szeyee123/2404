import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
                <Button variant="contained" component="label">
                  Upload New Photo
                  <input hidden accept="image/*" type="file" />
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Full Name" defaultValue="John Doe" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" defaultValue="johndoe@example.com" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Bio" multiline rows={3} defaultValue="Web developer and tech enthusiast." />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary">
                    Save Changes
                  </Button>
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
