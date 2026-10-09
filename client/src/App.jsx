import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { DeviceAiBotModal, AiBotLauncherButton } from './components/DeviceAiBot';

import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import PaymentList from './pages/PaymentList';
import CustomerList from './pages/CustomerList';
import AgentList from './pages/AgentList';
import Profile from './pages/Profile';

import AdminLogin from './pages/AdminLogin';
import AgentLogin from './pages/AgentLogin';
import ApplyAsAgent from './pages/ApplyAsAgent';

function AppContent() {
  const [isAiBotOpen, setIsAiBotOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onOpenAiBot={() => setIsAiBotOpen(true)} />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard onOpenAiBot={() => setIsAiBotOpen(true)} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/agent" element={<AgentLogin />} />
          <Route path="/apply-as-agent" element={<ApplyAsAgent />} />

          {/* Protected Shared Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer" element={<CustomerDashboard onOpenAiBot={() => setIsAiBotOpen(true)} />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-products" element={<ProductList />} />
          </Route>

          {/* Protected Agent Routes */}
          <Route element={<ProtectedRoute allowedRoles={['agent', 'admin']} />}>
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/agent-products" element={<ProductList />} />
            <Route path="/update-status" element={<PaymentList />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<CustomerList />} />
            <Route path="/admin/agents" element={<AgentList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/payments" element={<PaymentList />} />
          </Route>
        </Routes>
      </main>

      {/* Global EcoBot AI Floating Button & Modal */}
      <AiBotLauncherButton onClick={() => setIsAiBotOpen(true)} />
      <DeviceAiBotModal isOpen={isAiBotOpen} onClose={() => setIsAiBotOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
