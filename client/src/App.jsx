import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Shared Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route path="/customer" element={<CustomerDashboard />} />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
