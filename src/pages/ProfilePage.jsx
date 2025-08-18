import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
    const { user, token, loading: authLoading, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products`, 
                {
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            updateUserProfile(response.data);
            setMessage('Profil berhasil diperbarui!');
            setMessageType('success');
        } catch (error) {
            setMessage('Gagal memperbarui profil. Coba lagi.');
            setMessageType('error');
            console.error("Gagal update profil:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <p className="text-center p-10">Memuat data pengguna...</p>;
    }

    if (!user) {
        return <p className="text-center p-10">Silakan login untuk melihat profil Anda.</p>;
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-150px)] py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h1>
                    <p className="text-gray-500 mb-8">Perbarui informasi pribadi dan alamat Anda di sini.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Nama Lengkap</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email (tidak bisa diubah)</label>
                                <input type="email" name="email" value={formData.email} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">Nomor Telepon</label>
                                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">Alamat</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" rows="3"></textarea>
                            </div>
                        </div>
                        
                        {message && (
                            <div className={`text-center mt-6 p-3 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full mt-8 bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition duration-300 disabled:bg-amber-300">
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
