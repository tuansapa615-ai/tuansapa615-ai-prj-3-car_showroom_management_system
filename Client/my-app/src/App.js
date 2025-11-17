import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminRoutes from './routes/routeAdmin.jsx';
import Userroute from './routes/Userroute.jsx';

import Customerroute from './routes/Customerroute.jsx';
// import Login from './view/Auth/login.jsx';
// import Register from './view/Auth/Register.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Customerroute />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<Userroute />} />


        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

      </Routes>
    </Router>
  );
};

export default App;
