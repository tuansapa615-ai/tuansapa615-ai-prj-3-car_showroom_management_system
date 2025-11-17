import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import VehicleList from '../view_customer/Vehicle-List.jsx';
import ColorSchemesExample from '../view_customer/NavbarCustomer.jsx';
import Header from '../view_customer/header.jsx';
import Footer from '../view_customer/Footer.jsx';
import VehicleDetails from '../view_customer/VehicleDetails.jsx';
import Contact from '../view_customer/Contact.jsx';
import AboutUs from '../view_customer/About.jsx';
import Login from '../view/Auth/login.jsx';
import Register from '../view/Auth/Register.jsx';


function Customerroute() {
  const [selectedVehicleCondition, setSelectedVehicleCondition] = useState(null);

  const MainLayout = () => (
    <>
      <Header />
      <VehicleList selectedVehicleCondition={selectedVehicleCondition} />
      <Footer />
    </>
  );

  return (
    <>
      <ColorSchemesExample setSelectedVehicleCondition={setSelectedVehicleCondition} />
      <Container className="mt-4">
        <Routes>
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          
          <Route path="/" element={<MainLayout />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </Container>
    </>
  );
}

export default Customerroute;
