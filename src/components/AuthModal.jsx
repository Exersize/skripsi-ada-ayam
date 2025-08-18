import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Ikon X untuk tombol close
const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

function AuthModal({ isOpen, onClose }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(fullName, email, password);
                alert('Registrasi berhasil! Silakan login.');
                setIsLoginView(true); // Arahkan ke tab login setelah registrasi sukses
            }
            onClose(); // Tutup modal jika sukses
        } catch (err) {
            setError(err.response?.data?.msg || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <XIcon className="h-6 w-6" />
                </button>
                
                <div className="flex border-b mb-6">
                    <button 
                        onClick={() => setIsLoginView(true)}
                        className={`w-1/2 py-3 text-center font-semibold ${isLoginView ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setIsLoginView(false)}
                        className={`w-1/2 py-3 text-center font-semibold ${!isLoginView ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-500'}`}
                    >
                        Daftar
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {isLoginView ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="fullName">Nama Lengkap</label>
                            <input 
                                type="text" 
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                                required 
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required 
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 disabled:bg-amber-300"
                    >
                        {loading ? 'Memproses...' : (isLoginView ? 'Login' : 'Daftar')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;