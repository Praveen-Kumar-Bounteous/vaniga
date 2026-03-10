import { Routes, Route } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import Login from '../Auth/pages/Login';
import Signup from '../Auth/pages/Signup';
import Home from '../Pages/Home';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Public Routes inside Layout */}
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />

                {/* Authenticated Routes (Any logged in user) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<div className="p-10">User Profile Page</div>} />
                    <Route path="/cart" element={<div className="p-10">Cart Page</div>} />
                </Route>

                {/* Seller Only Routes */}
                <Route element={<RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
                    <Route path="/admin/dashboard" element={<div className="p-10">Seller Dashboard</div>} />
                </Route>

                {/* Admin Only Routes */}
                <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/manage-users" element={<div className="p-10">Admin User Management</div>} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;