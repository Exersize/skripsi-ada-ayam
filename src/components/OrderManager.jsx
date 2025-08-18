import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Gagal mengambil data pesanan:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!confirm(`Anda yakin ingin mengubah status pesanan ini menjadi "${newStatus}"?`)) return;
        
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (error) {
            console.error("Gagal update status:", error);
            alert("Gagal memperbarui status pesanan.");
        }
    };

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

    const renderActionButtons = (order) => {
        switch (order.status) {
            case 'PAID':
                return <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')} className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Proses Pesanan</button>;
            case 'PROCESSING':
                return <button onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="text-sm bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600">Kirim Pesanan</button>;
            case 'SHIPPED':
                return <button onClick={() => handleUpdateStatus(order.id, 'COMPLETED')} className="text-sm bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600">Selesaikan</button>;
            default:
                return null;
        }
    };

    if (loading) return <p>Memuat pesanan...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Daftar Pesanan</h2>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Pelanggan</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Alamat Kirim</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 align-top whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="p-4 align-top">{order.user.fullName}</td>
                                <td className="p-4 align-top text-sm">{order.shippingAddress}</td>
                                <td className="p-4 align-top whitespace-nowrap">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                                <td className="p-4 align-top">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusChip(order.status)}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 align-top">{renderActionButtons(order)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderManager;
