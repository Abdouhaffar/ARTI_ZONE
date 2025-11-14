import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import ArtisanDetails from './pages/ArtisanDetails';
import RegisterArtisan from './pages/RegisterArtisan';
import VIP from './pages/VIP';
import AdminLogin from './pages/AdminLogin';
import './styles/index.css';

function App() {
  return (
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
