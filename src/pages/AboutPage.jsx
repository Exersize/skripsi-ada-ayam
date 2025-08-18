import React from 'react';

function AboutPage() {
    return (
        <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Tentang Ada Ayam</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Ada Ayam lahir dari keinginan untuk menyediakan sumber protein hewani yang berkualitas, sehat, dan halal bagi setiap keluarga di Indonesia. Kami berkomitmen untuk menjaga kualitas produk kami mulai dari peternakan hingga sampai di meja makan Anda.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Kami bekerja sama dengan peternak lokal yang menerapkan standar kesejahteraan hewan dan pakan alami. Semua produk kami diproses di rumah potong modern yang higienis dan bersertifikasi untuk menjamin kesegaran dan keamanannya.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Visi kami adalah menjadi pilihan utama keluarga Indonesia untuk kebutuhan ayam segar dan olahan. Misi kami adalah memberikan pelayanan terbaik, produk berkualitas, dan harga yang kompetitif.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;