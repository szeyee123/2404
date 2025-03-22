import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Active vs Blocked',
    },
  },
};

const barLabels = ['Status'];

const barData = {
  labels: barLabels,
  datasets: [
    {
      label: 'Active',
      data: [2],
      backgroundColor: 'rgba(61, 247, 247, 0.5)',
    },
    {
      label: 'Blocked',
      data: [1],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

function Dashboard() {
  return (
    <>
    <Navbar />
      <Box height={30}/>
      <Box sx={{ display: "flex"}}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
          <h1>Dashboard</h1>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 6 }}>
              <Item>
                {barData && barOptions ? <Bar options={barOptions} data={barData} /> : <p>Loading Chart...</p>}    
              </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }}>
              <Item>
                xs=6 md=4
              </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }}>
              <Item>
                xs=6 md=4
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
    </>
  )
}

export default Dashboard