import { Routes, Route } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import Login from '../Auth/pages/Login';
import Signup from '../Auth/pages/Signup';
import Home from '../Pages/Home';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import PLP from '@/Product/pages/PLP';
import PDP from '@/Product/pages/PDP';
import CartPage from '@/Cart/pages/CartPage';
import CheckoutPage from '@/Cart/pages/CheckoutPage';
import OrderSuccess from '@/Order/pages/OrderSuccess';
import OrderDetails from '@/Order/pages/OrderDetails';
import OrderHistory from '@/Order/pages/OrderHistory';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Public Routes inside Layout */}
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<PLP />} />
                <Route path="/products/:id" element={<PDP />} />

                {/* Authenticated Routes (Any logged in user) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<div className="p-10">User Profile Page</div>} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/order-details/:id" element={<OrderDetails />} />
                    {/* <Route path="/profile" element={<ProfilePage />} /> */}
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