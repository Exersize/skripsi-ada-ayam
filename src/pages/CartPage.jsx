import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { MinusIcon, PlusIcon, TrashIcon } from '../components/Icons.jsx';
import { ShoppingCartIcon } from '../components/Icons.jsx'; // Import ikon keranjang

function CartPage({ setPage }) {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
            return;
        }
        if (!user.address) {
            alert("Harap lengkapi alamat Anda di halaman Profil sebelum melanjutkan checkout.");
            setPage('profile');
            return;
        }
        setIsCheckingOut(true);
        const cartItems = cart.map(item => ({ id: item.id, quantity: item.quantity }));

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api`, 
                { shippingAddress: user.address, cartItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const snapToken = response.data.token;
            window.snap.pay(snapToken, {
                onSuccess: (result) => { alert("Pembayaran berhasil!"); console.log(result); clearCart(); setPage('home'); },
                onPending: (result) => { alert("Menunggu pembayaran Anda!"); console.log(result); clearCart(); setPage('home'); },
                onError: (result) => { alert("Pembayaran gagal!"); console.log(result); },
                onClose: () => { /* Tidak ada alert saat ditutup */ }
            });
        } catch (error) {
            console.error("Gagal saat checkout:", error);
            alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <ShoppingCartIcon className="h-24 w-24 mx-auto text-gray-300" />
                <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-2">Keranjang Belanja Anda Kosong</h2>
                <p className="text-gray-600 mb-8">Ayo isi dengan produk-produk segar pilihan kami!</p>
                <button onClick={() => setPage('products')} className="bg-amber-500 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-600 transition duration-300">
                    Mulai Belanja
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Keranjang Belanja Anda</h1>
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Daftar Item */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {cart.map((item, index) => (
                                <div key={item.id} className={`flex flex-col md:flex-row items-center justify-between py-4 ${index < cart.length - 1 ? 'border-b' : ''}`}>
                                    <div className="flex items-center mb-4 md:mb-0 w-full md:w-1/2">
                                        <img src={item.imageUrl || 'https://placehold.co/400x400'} alt={item.name} className="h-24 w-24 object-cover rounded-md mr-6"/>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600">Rp {item.pricePerKg.toLocaleString('id-ID')} / kg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 w-full md:w-auto justify-between">
                                        <div className="flex items-center border border-gray-300 rounded-full">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 0.5)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full"><MinusIcon /></button>
                                            <span className="px-4 text-lg font-semibold">{item.quantity} kg</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 0.5)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full"><PlusIcon /></button>
                                        </div>
                                        <p className="font-bold w-32 text-right">Rp {(item.pricePerKg * item.quantity).toLocaleString('id-ID')}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">
                                            <TrashIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ringkasan Belanja */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold border-b pb-4 mb-4">Ringkasan Belanja</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between mb-6 text-gray-600">
                                <span>Biaya Pengiriman</span>
                                <span>Akan dihitung</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-4">
                                <span>Total</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <button 
                                onClick={handleCheckout} 
                                className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
                                disabled={!user || isCheckingOut}
                            >
                                {isCheckingOut ? 'Memproses...' : (user ? 'Lanjut ke Pembayaran' : 'Login untuk Checkout')}
                            </button>
                            {!user && <p className="text-red-500 text-sm text-center mt-2">Anda harus login untuk dapat melakukan checkout.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;