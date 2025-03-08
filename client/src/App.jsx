import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
// import Addnewuser from "./pages/Addnewuser";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" exact element={<Dashboard/>}></Route>
          <Route path="/Users" exact element={<Users/>}></Route>
          {/* <Route path="/addnewuser" exact element={<Addnewuser/>}></Route> */}
          <Route path="/profile" exact element={<Profile/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App