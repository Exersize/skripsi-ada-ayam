import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { MinusIcon, PlusIcon } from './Icons.jsx';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    const isOutOfStock = product.stockKg <= 0;

    // PERBAIKAN: Pastikan kuantitas tidak melebihi stok saat pertama kali render
    useEffect(() => {
        if (quantity > product.stockKg) {
            setQuantity(product.stockKg);
        }
    }, [product.stockKg, quantity]);


    const handleAddToCart = () => {
        if (isOutOfStock) return;
        // Pastikan kuantitas yang ditambahkan tidak melebihi stok
        const qtyToAdd = Math.min(quantity, product.stockKg);
        if (qtyToAdd <= 0) return;
        
        addToCart(product, qtyToAdd);
        alert(`${qtyToAdd} kg ${product.name} ditambahkan ke keranjang!`);
        setQuantity(1);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prevQty => {
            let newQty = prevQty + amount;
            // Batasi kuantitas maksimal sesuai sisa stok
            if (newQty > product.stockKg) {
                newQty = product.stockKg;
            }
            // Batasi kuantitas minimal
            if (newQty < 0.5) {
                newQty = 0.5;
            }
            return newQty;
        });
    };

    if (!product || typeof product.pricePerKg === 'undefined') {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl group">
            <div className="relative">
                <img src={product.imageUrl || 'https://placehold.co/400x400/FBBF24/333333?text=Gambar+Produk'} alt={product.name} className="w-full h-48 object-cover"/>
                
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-md">Stok Habis</span>
                    </div>
                )}

                <span className={`absolute top-3 right-3 inline-block px-3 py-1 text-sm font-semibold rounded-full ${product.category === 'FRESH' ? 'bg-amber-200 text-amber-800' : 'bg-sky-200 text-sky-800'}`}>
                    {product.category}
                </span>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                <p className="text-lg font-semibold text-amber-600">
                    Rp {product.pricePerKg.toLocaleString('id-ID')} / kg
                </p>
                {!isOutOfStock && (
                    <p className="text-sm text-gray-500 mb-4">Sisa Stok: {product.stockKg} Kg</p>
                )}
                <div className="flex items-center justify-center mb-4">
                     <div className="flex items-center border border-gray-300 rounded-full">
                        <button disabled={isOutOfStock} onClick={() => handleQuantityChange(-0.5)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full disabled:cursor-not-allowed disabled:text-gray-300"><MinusIcon /></button>
                        <span className="px-4 text-lg font-semibold">{quantity}</span>
                        <button disabled={isOutOfStock} onClick={() => handleQuantityChange(0.5)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full disabled:cursor-not-allowed disabled:text-gray-300"><PlusIcon /></button>
                    </div>
                </div>
                <button 
                    disabled={isOutOfStock} 
                    onClick={handleAddToCart} 
                    className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-full hover:bg-amber-600 transition duration-300 group-hover:bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isOutOfStock ? 'Stok Habis' : '+ Tambah ke Keranjang'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
