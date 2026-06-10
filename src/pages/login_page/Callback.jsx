import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/auth/useAuth';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // Kita akan buat fungsi ini

    useEffect(() => {
        const token = searchParams.get('token');
         console.log("Callback Page: Token dari URL adalah:", token);

        if (token) {
            // Panggil fungsi di useAuth untuk menyimpan token dan data user
            loginWithToken(token);
        } else {
              console.error("Callback Page: Tidak ada token di URL, kembali ke login.");
       
            // Jika tidak ada token, kembali ke halaman login
            navigate('/login');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Memproses otentikasi...</p>
        </div>
    );
};

export default AuthCallbackPage;