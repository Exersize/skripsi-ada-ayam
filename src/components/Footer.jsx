import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-6 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} Ada Ayam.</p>
            </div>
        </footer>
    );
}

export default Footer;