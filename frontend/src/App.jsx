import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeDashboard from './pages/HomeDashboard';
import CustomerPortal from './pages/CustomerPortal';
import AgentPortal from './pages/AgentPortal';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/customer" element={<CustomerPortal />} />
              <Route path="/agent" element={<AgentPortal />} />
              <Route path="/admin" element={<AdminPortal />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
