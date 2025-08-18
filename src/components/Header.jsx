import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ShoppingCartIcon, UserIcon } from './Icons.jsx';

function Header({ setPage, onLoginClick }) {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();

  const renderAuthSection = () => {
    if (loading) return <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>;

    if (user) {
      return (
        <div className="flex items-center space-x-4">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); }} className="text-gray-600 hover:text-amber-500 font-medium">Profil</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('order_history'); }} className="text-gray-600 hover:text-amber-500 font-medium">Pesanan</a>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 font-semibold">Logout</button>
        </div>
      );
    }

    return (
      <button onClick={onLoginClick} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center space-x-2 font-semibold">
          <UserIcon className="h-5 w-5"/>
          <span>Login / Daftar</span>
      </button>
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => setPage('home')}>
          Ada Ayam
        </div>
        {/* 3. PERBAIKAN PADA TAUTAN NAVIGASI */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-base font-semibold text-gray-600 hover:text-amber-600 transition-colors duration-300" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Home</a>
          <a href="#" className="text-base font-semibold text-gray-600 hover:text-amber-600 transition-colors duration-300" onClick={(e) => { e.preventDefault(); setPage('products'); }}>Produk</a>
          <a href="#" className="text-base font-semibold text-gray-600 hover:text-amber-600 transition-colors duration-300" onClick={(e) => { e.preventDefault(); setPage('about'); }}>Tentang Kami</a>
          {user && user.role === 'ADMIN' && (
            <a href="#" className="text-base font-bold text-blue-600 hover:text-blue-800" onClick={(e) => { e.preventDefault(); setPage('admin_dashboard'); }}>Dashboard</a>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer" onClick={() => setPage('cart')}>
            <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
          {renderAuthSection()}
        </div>
      </nav>
    </header>
  );
}

export default Header;