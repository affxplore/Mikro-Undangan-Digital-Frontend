// Lokasi: src/pages/forgot_password/ResetPassword.jsx (buat file baru)

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiService from '../../api/apiService';


const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
 const token = searchParams.get('token');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Password tidak cocok!");
            return;
        }
        setError('');
        setLoading(true);

        try {
            // Karena 'token' sekarang sudah terisi dengan benar,
            // URL yang dikirim ke backend akan menjadi benar juga.
            const response = await apiService.post(`/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 1500); // Redirect ke login setelah 1.5 detik
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mereset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
         <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/pict/BG-v1.jpg')" }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Atur Password Baru</h2>
                {message ? (
                    <p className="text-center text-green-600">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Password Baru"
                            required
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Konfirmasi Password Baru"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 text-white py-2 rounded">
                            {loading ? 'Menyimpan...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;