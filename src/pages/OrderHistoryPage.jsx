import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            };
            try {
                const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Gagal mengambil riwayat pesanan:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const getStatusChip = (status) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
            case 'COMPLETED': return 'bg-purple-100 text-purple-800';
            case 'PENDING_PAYMENT': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <p className="text-center p-10">Memuat riwayat pesanan...</p>;
    }
    
    if (!user) {
        return <p className="text-center p-10">Silakan login untuk melihat riwayat pesanan Anda.</p>;
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-150px)] py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Riwayat Pesanan Saya</h1>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {orders.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">Anda belum memiliki riwayat pesanan.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID Pesanan</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                        <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-500 font-mono">...{order.midtransOrderId.slice(-12)}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-800">{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                            <td className="p-4 whitespace-nowrap text-sm text-gray-800 font-semibold">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusChip(order.status)}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderHistoryPage;
