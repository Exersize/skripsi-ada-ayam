import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import { LeafIcon, TruckIcon, ShieldCheckIcon } from '../components/Icons.jsx';

// Komponen untuk kartu keunggulan
const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4">
            <div className="bg-amber-100 p-4 rounded-full">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

function HomePage({ setPage }) {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api`);
                setFeaturedProducts(response.data.slice(0, 4));
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-amber-50">
                <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                            Ayam Segar & Berkualitas, <br />Langsung dari Peternak Lokal
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Kami menyediakan pilihan ayam segar dan olahan beku terbaik yang dijamin halal, higienis, dan dikirim cepat ke rumah Anda.
                        </p>
                        <button onClick={() => setPage('products')} className="bg-amber-500 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-600 transition duration-300 shadow-lg hover:shadow-xl">
                            Belanja Sekarang
                        </button>
                    </div>
                    <div className="md:w-1/2">
                        <img 
                            src="https://placehold.co/600x400/FBBF24/FFFFFF?text=Ada+Ayam" 
                            alt="Ayam Segar" 
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard icon={<LeafIcon className="h-8 w-8 text-amber-500" />} title="100% Segar">
                            Dipotong di hari yang sama saat pengiriman untuk menjamin kesegaran maksimal.
                        </FeatureCard>
                        <FeatureCard icon={<TruckIcon className="h-8 w-8 text-amber-500" />} title="Pengiriman Cepat">
                            Pesanan Anda kami antar dengan cepat dan aman sampai ke depan pintu rumah Anda.
                        </FeatureCard>
                        <FeatureCard icon={<ShieldCheckIcon className="h-8 w-8 text-amber-500" />} title="Halal & Higienis">
                            Diproses sesuai standar syariat Islam dan kebersihan yang ketat.
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Produk Terlaris Kami</h2>
                    {loading ? (
                        <p className="text-center">Memuat produk...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default HomePage;
