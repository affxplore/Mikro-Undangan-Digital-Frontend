import React from 'react';
import { FaHome, FaQuoteRight, FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaEnvelopeOpenText, FaGift, FaThumbsUp } from 'react-icons/fa';

// Mapping sederhana dari nama halaman (bisa disesuaikan) ke ikon
const iconMap = {
    opening: FaHome,
    quotes: FaQuoteRight,
    mempelai: FaHeart,
    acara: FaCalendarAlt,
    maps: FaMapMarkerAlt,
    rsvp: FaEnvelopeOpenText,
    gift: FaGift,
    thanks: FaThumbsUp,
};

const AdminBottomNav = ({ pages, onNavigate }) => {
    return (
        <div className="sticky bottom-0 z-50 w-full flex justify-center p-2">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-full flex items-center gap-2 px-4 py-2">
                {pages.map((page, index) => {
                    // Coba tebak ikon dari nama halaman
                    const pageName = page.name?.toLowerCase().split(' ')[0] || `page${index}`;
                    const Icon = iconMap[pageName] || FaHome;
                    
                    return (
                        <button 
                            key={page.id || index}
                            onClick={() => onNavigate(index)}
                            className="flex flex-col items-center justify-center w-16 h-16 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            title={page.name || `Halaman ${index + 1}`}
                        >
                            <Icon className="text-xl text-gray-700" />
                            <span className="text-xs mt-1 text-gray-600 capitalize">{pageName}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default AdminBottomNav;