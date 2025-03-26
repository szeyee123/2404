import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Sidenav from '../components/Sidenav_user';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit'; // Import the icon for address editing
import axios from '../http'; 
import dog from "../image/dog.jpg";

function ProfileUser() {
  const [defaultAddress, setDefaultAddress] = useState('Loading...');
  const navigate = useNavigate(); // For routing

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data and default address
  const fetchUserData = async () => {
    try {
      const userId = 1;
      const response = await axios.get(`/user/${userId}/addresses`);
      const defaultAddr = response.data.find(addr => addr.isDefault === true);
      setDefaultAddress(defaultAddr ? `${defaultAddr.street}` : 'No default address found.');
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      setDefaultAddress('Error fetching address');
    }
  };

  // Function to navigate to the address management page
  const handleAddressManagement = () => {
    navigate('/Address');
  };

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
          <Card sx={{ p: 2, backgroundColor: '#6E6E6E', boxShadow: 5 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 , color: "white"}}>
                <Avatar sx={{ width: 300, height: 300 }} src={dog} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Full Name</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.4rem', marginBottom: '16px'}}>Sammy</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Email</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.4rem' , marginBottom: '16px'}}>Sammy@example.com</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    Address <IconButton 
                      onClick={handleAddressManagement} 
                      sx={{ color: "white"}}
                    >
                      <EditIcon />
                    </IconButton>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontSize: '1.4rem' }}>{defaultAddress} (Default)</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ p: 2, marginTop:"16px"}}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Descriptions</Typography>
          <Typography variant="body1" sx={{ fontSize: '1.4rem', marginBottom: '16px'}}>
          Sammy is a skilled and compassionate professional dog groomer with extensive experience in the pet care industry. 
          His expertise spans a wide range of grooming services, including haircuts, bathing, nail trimming, and skin treatments, 
          tailored to meet the specific needs of each dog. Sammy is well-versed in working with various breeds, understanding their
           unique grooming requirements, and ensuring that every pet is treated with the utmost care and attention. His gentle 
           approach creates a calm and comfortable environment, making grooming sessions an enjoyable experience for the dogs he 
           works with.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.4rem', marginBottom: '16px'}}>
          In addition to his technical skills, Sammy’s love for animals is evident in everything he does. He takes pride in building 
          strong relationships with both pets and their owners, ensuring clear communication and satisfaction with every grooming 
          session. Sammy’s professional demeanor, paired with his dedication to keeping dogs healthy and looking their best, has 
          earned him a loyal client base. His commitment to quality care, combined with his passion for animals, makes him a trusted 
          choice for pet grooming services.
          </Typography>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default ProfileUser;