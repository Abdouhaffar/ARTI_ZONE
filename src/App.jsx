import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import ArtisanDetails from './pages/ArtisanDetails';
import RegisterArtisan from './pages/RegisterArtisan';
import VIP from './pages/VIP';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import AdminRoute from './components/admin/AdminRoute';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/artisan/:id" element={<ArtisanDetails />} />
                <Route path="/register" element={<RegisterArtisan />} />
                <Route path="/vip" element={<VIP />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;