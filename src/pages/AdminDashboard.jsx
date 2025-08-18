import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import ProductManager from '../components/ProductManager.jsx';
import OrderManager from '../components/OrderManager.jsx';
import { PackageIcon, ClipboardListIcon } from '../components/Icons.jsx';

// Komponen Kartu Statistik
const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const [stats, setStats] = useState({ productCount: 0, orderCount: 0 });
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                // Mengambil data produk dan pesanan secara bersamaan
                const [productRes, orderRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats({
                    productCount: productRes.data.length,
                    orderCount: orderRes.data.length
                });
            } catch (error) {
                console.error("Gagal mengambil data statistik:", error);
            }
        };
        fetchStats();
    }, [token]);

    return (
        <div className="bg-gray-100 min-h-[calc(100vh-68px)]">
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
                
                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={<PackageIcon className="h-6 w-6 text-blue-800" />}
                        title="Total Produk"
                        value={stats.productCount}
                        color="bg-blue-100"
                    />
                    <StatCard 
                        icon={<ClipboardListIcon className="h-6 w-6 text-green-800" />}
                        title="Total Pesanan"
                        value={stats.orderCount}
                        color="bg-green-100"
                    />
                    {/* Anda bisa menambahkan kartu statistik lain di sini */}
                </div>

                {/* Konten Utama dengan Tab */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="border-b mb-6">
                        <nav className="flex space-x-6">
                            <button 
                                onClick={() => setActiveTab('products')}
                                className={`py-2 px-1 font-semibold transition-colors duration-200 ${activeTab === 'products' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500 hover:text-amber-600'}`}
                            >
                                Manajemen Produk
                            </button>
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`py-2 px-1 font-semibold transition-colors duration-200 ${activeTab === 'orders' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500 hover:text-amber-600'}`}
                            >
                                Manajemen Pesanan
                            </button>
                        </nav>
                    </div>

                    <div>
                        {activeTab === 'products' && <ProductManager />}
                        {activeTab === 'orders' && <OrderManager />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
