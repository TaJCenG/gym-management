import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import LandingPage from './routes/LandingPage';
import Booking from './routes/Booking';
import AdminLogin from './routes/Admin/Login';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import AdminDashboard from './routes/Admin/Dashboard';
import AdminTrainers from './routes/Admin/Trainers';
import AdminClasses from './routes/Admin/gym_class.jsx';
import AdminMemberships from "./routes/Admin/Memberships.jsx";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <Router>
      <AdminAuthProvider>
         <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/trainers" element={<ProtectedAdminRoute><AdminTrainers /></ProtectedAdminRoute>} />
          <Route path="/admin/gym_class" element={<ProtectedAdminRoute><AdminClasses /></ProtectedAdminRoute>} />
          <Route path="/admin/memberships" element={<ProtectedAdminRoute><AdminMemberships /></ProtectedAdminRoute>} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;