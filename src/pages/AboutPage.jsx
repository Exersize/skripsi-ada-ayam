import React from 'react';
import { LeafIcon } from '../components/Icons.jsx'; 

function AboutPage() {
    return (
        <div className="bg-gray-50 py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-amber-100 p-4 rounded-full">
                            <LeafIcon className="h-10 w-10 text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Tentang Ada Ayam</h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                        Ada Ayam lahir dari keinginan untuk menyediakan sumber protein hewani yang berkualitas, sehat, dan halal bagi setiap keluarga di Indonesia. Kami berkomitmen untuk menjaga kualitas produk kami mulai dari peternakan hingga sampai di meja makan Anda.
                    </p>

                
                    <div className="border-t pt-8 mt-8 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Alamat Kami</h3>
                            <p className="text-gray-600">
                                Jl. Ketapang No.1711, RT.9/RW.16, Serua, Kec. Ciputat, Kota Tangerang Selatan, Banten 15414
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Jam Operasional</h3>
                            <p className="text-gray-600">
                                Senin - Minggu: <strong>08:00 - 17:00 WIB</strong>
                            </p>
                            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Hubungi Kami</h3>
                            <p className="text-gray-600">
                                WhatsApp: <strong>0877-7418-1602</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;