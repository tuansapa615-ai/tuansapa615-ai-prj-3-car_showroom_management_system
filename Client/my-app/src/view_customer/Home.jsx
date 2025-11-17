// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom'; // Import useLocation
// import Container from 'react-bootstrap/Container';

// import VehicleList from './Vehicle-List.jsx';
// import CustomNavbar from './NavbarCustomer.jsx';
// import Header from './header.jsx';
// import Footer from './Footer.jsx';
// import VehicleDetails from './VehicleDetails.jsx';
// import Login from '../view/Auth/login.jsx';
// import Contact from './Contact.jsx';
// import ABOUTUS from './ABOUTUS.jsx';
// function Home() {
//   const [selectedVehicleCondition, setSelectedVehicleCondition] = useState(null);
//   const MainLayout = () => (
//     <>
//       <Header />
//       <VehicleList selectedVehicleCondition={selectedVehicleCondition} />
//       <Footer />
//     </>
//   );
//   return (
//     <>
//       <CustomNavbar setSelectedVehicleCondition={setSelectedVehicleCondition} />
//       <Container className="mt-4">
//         <Routes>
//           <Route path="/vehicle/:id" element={<VehicleDetails />} />
//           <Route path="/" element={<MainLayout />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/Contact" element={<Contact />} />
//           <Route path="/ABOUT-US" element={<ABOUTUS />} />
//         </Routes>
//       </Container>
//     </>
//   );
// }

// export default Home;
