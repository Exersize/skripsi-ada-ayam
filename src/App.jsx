import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx'; // <-- IMPORT BARU

export default function App() {
  const [page, setPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const renderPage = () => {
    if (page === 'admin_dashboard') {
        if (user && user.role === 'ADMIN') return <AdminDashboard />;
        else return <HomePage setPage={setPage} />; 
    }
    if (page === 'profile') {
        if (user) return <ProfilePage />;
        else return <HomePage setPage={setPage} />;
    }
    if (page === 'order_history') { // <-- TAMBAHKAN RUTE BARU
        if (user) return <OrderHistoryPage />;
        else return <HomePage setPage={setPage} />;
    }

    switch (page) {
      case 'products': return <ProductsPage />;
      case 'about': return <AboutPage />;
      case 'cart': return <CartPage setPage={setPage} />;
      case 'home':
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header setPage={setPage} onLoginClick={() => setIsAuthModalOpen(true)} />
      <main>{renderPage()}</main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}