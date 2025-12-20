import React from 'react';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import VerifyPage from './pages/VerifyPage';
import FAQ from './pages/FAQ';
import History from './pages/History';
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Users from './admin/pages/Users';
import Reports from './admin/pages/Reports';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/verify" element={<PrivateRoute><VerifyPage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="/faq" element={<FAQ />} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
