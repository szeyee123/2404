import React from 'react';
import Sidenav from '../components/Sidenav_user';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import dog from "../image/dog.jpg"

function profile_user() {
  return (
    <>
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Card sx={{ maxWidth: 1200, p: 2, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Avatar sx={{ width: 300, height: 300 }} src={dog} />

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' , fontSize: '1.5rem'}}>Full Name:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.4rem' }} >Sammy</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' , fontSize: '1.5rem'}}>Email:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.4rem' }}>Sammy@gamil.com</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' , fontSize: '1.5rem'}}>Deafult Address:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.4rem' }}>[ Insert Address ]</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default profile_user;
