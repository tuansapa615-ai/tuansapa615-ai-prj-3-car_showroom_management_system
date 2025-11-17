import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ColorSchemesExample from '../user/NavbarUser.jsx';
// import NavbarAdmin from '../Admin/NavbarAdmin.jsx'; // Đảm bảo rằng NavbarAdmin đã được import

// Import các component quản lý
import VehicleManager from '../view/vehicle/VehicleManager.jsx';
import AddVehicle from '../view/vehicle/AddVehicle.jsx';
import EditVehicle from '../view/vehicle/EditVehicle.jsx';

import OrderManager from '../view/order/OrderManager.jsx';
import EditOrder from '../view/order/EditOrder.jsx';
import AddOrder from '../view/order/AddOrder.jsx';

import CustomerManagement from '../view/customer/CustomerManagement.jsx';
import AddCustomer from '../view/customer/AddCustomer.jsx';
import EditCustomer from '../view/customer/EditCustomer.jsx';

import EmployeeManager from '../view/employee/EmployeeManager.jsx';
import AddEmployee from '../view/employee/AddEmployee.jsx';
import EditEmployee from '../view/employee/EditEmployee.jsx';

import BrandManager from '../view/brand/BrandManager.jsx';
import EditBrand from '../view/brand/EditBrand.jsx';

import SalesManager from '../view/sales/SalesManager.jsx';
import EditSales from '../view/sales/EditSales.jsx';
import AddSales from '../view/sales/AddSales.jsx';

import WaitingListManager from '../view/waitinglist/WaitingListManager.jsx';
import EditWaitingList from '../view/waitinglist/EditWaitingList.jsx';
import AddWaitingList from '../view/waitinglist/AddWaitingList.jsx';

import EditService from '../view/services/EditServices.jsx';
import AddServices from '../view/services/AddServices.jsx';

import BillingManager from '../view/billing/BillingManager.jsx';
import AddBilling from '../view/billing/AddBilling.jsx';
import EditBilling from '../view/billing/EditBilling.jsx';

import Register from '../view/Auth/Register.jsx';
import Registion from '../view/vehicle/registrationPage.jsx';
import EditRegistion from '../view/vehicle/add-editRegistion.jsx';

const Userroute = () => {
    return (
        <>
            <ColorSchemesExample />
            <Container>
                <Routes>
                <Route path='/' element={<VehicleManager />} />

                    <Route path='/' element={<VehicleManager />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/viewRegistration" element={<Registion />} />
                    <Route path="/add-editRegistration/:id" element={<EditRegistion />} />

                    <Route path="/add-vehicle" element={<AddVehicle />} />
                    <Route path="/edit-vehicle/:id" element={<EditVehicle />} />

                    <Route path="/order-list" element={<OrderManager />} />
                    <Route path="/edit-order/:id" element={<EditOrder />} />
                    <Route path="/add-order" element={<AddOrder />} />

                    <Route path="/customer" element={<CustomerManagement />} />
                    <Route path="/edit-customer/:id" element={<EditCustomer />} />
                    <Route path="/add-customer" element={<AddCustomer />} />

                    <Route path="/employee-list" element={<EmployeeManager />} />
                    <Route path="/add-employee" element={<AddEmployee />} />
                    <Route path="/edit-employee/:id" element={<EditEmployee />} />

                    <Route path="/brand-list" element={<BrandManager />} />
                    <Route path="/edit-brand/:id" element={<EditBrand />} />

                    <Route path="/sales&&service-list" element={<SalesManager />} />
                    <Route path="/edit-sales/:id" element={<EditSales />} />
                    <Route path="/add-sales" element={<AddSales />} />

                    <Route path="/waiting-list" element={<WaitingListManager />} />
                    <Route path="/edit-waitinglist/:id" element={<EditWaitingList />} />
                    <Route path="/add-waitinglist" element={<AddWaitingList />} />

                    <Route path="/edit-service/:id" element={<EditService />} />
                    <Route path="/add-service" element={<AddServices />} />

                    <Route path="/billing-list" element={<BillingManager />} />
                    <Route path="/edit-billing/:id" element={<EditBilling />} />
                    <Route path="/add-billing" element={<AddBilling />} />
                </Routes>
            </Container>
        </>
    );
};

export default Userroute;
