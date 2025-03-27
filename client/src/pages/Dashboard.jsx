import React, { useState, useEffect } from 'react';
import http from '../http';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid2';
import Barchart from '../components/Barchart';
import Linechart from '../components/Linechart';
import Doughnutchart from '../components/Doughnutchart';
import { Card, CardContent, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import DashboardMap from '../components/Dashboardmap';

function Dashboard() {
   const [totalUsers, setTotalUsers] = useState(0);
   const [currentMonthUsers, setCurrentMonthUsers] = useState(0);
   const [recentUsers, setRecentUsers] = useState([]);
  
    useEffect(() => {
      http.get('/user/recent-users')
      .then((res) => {
        setRecentUsers(res.data);
      })
      .catch((error) => {
        console.error('Error fetching recent users:', error);
      });

      http.get('/user/count')
      .then((res) => {
        setTotalUsers(res.data.total);
        setCurrentMonthUsers(res.data.currentMonth); 
      })
      .catch((error) => {
        console.error('Error fetching user counts:', error);
      });
    }, []);

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex", flex: 1, minHeight: "100vh" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}>
          <h1>Dashboard</h1>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={6} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <h5>Total Users Created This Month</h5>
                  <h2>{currentMonthUsers}</h2>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6}  sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <h5>Total Users</h5>
                  <h2>{totalUsers}</h2>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <h5>Recent Signups This Month</h5>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Name</b></TableCell>
                          <TableCell><b>Email</b></TableCell>
                          <TableCell><b>Created at</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentUsers.map((user, index) => (
                          <TableRow key={index}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={8} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Linechart />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={8} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Barchart />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Doughnutchart />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={12} sx={{ display: "flex" }}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <DashboardMap />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;