import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// Komponen Form Produk (untuk Tambah/Edit)
const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', description: '', pricePerKg: '', category: 'FRESH', imageUrl: '', stockKg: '', ...product
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            <form onSubmit={handleSubmit}>
                {/* ... (Isi form akan ditambahkan di sini) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Produk" className="p-2 border rounded" required />
                    <input name="pricePerKg" type="number" value={formData.pricePerKg} onChange={handleChange} placeholder="Harga per Kg" className="p-2 border rounded" required />
                    <input name="stockKg" type="number" step="0.1" value={formData.stockKg} onChange={handleChange} placeholder="Stok (Kg)" className="p-2 border rounded" required />
                    <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
                        <option value="FRESH">Fresh</option>
                        <option value="FROZEN">Frozen</option>
                    </select>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Gambar" className="p-2 border rounded col-span-1 md:col-span-2" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi" className="p-2 border rounded col-span-1 md:col-span-2" />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Batal</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                </div>
            </form>
        </div>
    );
};

// Komponen Utama ProductManager
function ProductManager() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const { token } = useAuth();

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Gagal mengambil produk (admin):", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]);

    const handleSave = async (productData) => {
        const { id, ...data } = productData;
        try {
            if (id) { // Update
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else { // Create
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProducts();
            setEditingProduct(null);
            setIsCreating(false);
        } catch (error) {
            console.error("Gagal menyimpan produk:", error);
            alert('Gagal menyimpan produk. Periksa kembali data Anda.');
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products`, { isActive: !product.isActive }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            console.error("Gagal mengubah status produk:", error);
        }
    };

    return (
        <div>
            {(isCreating || editingProduct) && (
                <ProductForm 
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => { setEditingProduct(null); setIsCreating(false); }}
                />
            )}
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Daftar Produk</h2>
                <button onClick={() => setIsCreating(true)} className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300">
                    + Tambah Produk
                </button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Harga</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">Rp {product.pricePerKg.toLocaleString('id-ID')}</td>
                                <td className="p-4">{product.stockKg} Kg</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleToggleActive(product)} className="text-red-600 hover:underline">
                                        {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductManager;