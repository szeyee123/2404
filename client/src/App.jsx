import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar';
import Login from './components/login'; 
import Address from './pages/Address/Address_main';
import Profileuser from "./pages/profile_user";
import Addressform from "./pages/Address/Address_form";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Address" element={<Address />} />
        <Route path="/profile_user" element={<Profileuser />} />
        <Route path="/Addressform" element={<Addressform />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;