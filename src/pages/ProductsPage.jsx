import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => filter === 'All' || p.category === filter);

    return (
        <div>
            {/* Page Header */}
            <section className="bg-white py-12 shadow-sm">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Semua Produk Kami</h1>
                    <p className="text-gray-600 mt-2">Temukan pilihan ayam segar dan olahan beku favorit Anda.</p>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12">
                {/* Filter Buttons */}
                <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-12">
                    <button onClick={() => setFilter('All')} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${filter === 'All' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        Semua
                    </button>
                    <button onClick={() => setFilter('FRESH')} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${filter === 'FRESH' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        Ayam Fresh
                    </button>
                    <button onClick={() => setFilter('FROZEN')} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${filter === 'FROZEN' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        Ayam Frozen
                    </button>
                </div>
                
                {/* Product Grid */}
                {loading ? (
                    <p className="text-center text-gray-600">Memuat produk...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
