import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';
import apiService from "../../../api/apiService"; 

export default function AffiliatorForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_wa: '', // Sesuaikan dengan nama kolom di model backend
    kode_afiliasi: '',
    // Data tambahan yang tidak ada di model tetap kita simpan di state
    // agar form tidak error saat diketik
    kota: '',
    alamat: '',
    kode_pos: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Tombol ditekan, mengirim data...", formData);
    setLoading(true);
    try {
      const payload = {
        nama: formData.nama,
        email: formData.email,
        no_wa: formData.no_wa,
        kode_afiliasi: formData.kode_afiliasi
      };

      const response = await apiService.post("/afiliasis/register", payload);
    
      // Gunakan response untuk memastikan data benar-benar sukses dari server
      if (response.status === 201 || response.data.success) {
        alert("Selamat! Pendaftaran Partner Berhasil.");
        setIsOpen(false);
        navigate('/dashboard'); 
      }
      } catch (error) {
        console.error("Gagal mendaftar:", error);
        const msg = error.response?.data?.message || "Gagal mendaftar. Cek koneksi.";
        alert("Error: " + msg);
      } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className={`transition-all ${isOpen ? 'filter blur-sm' : ''} w-full max-w-md`}>
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="mr-2 text-3xl text-gray-600 hover:text-gray-900">
            <MdOutlineArrowBack/>
          </button>
          <h2 className="text-xl font-semibold text-center flex-1">Menjadi Afiliator</h2>
        </div>

        <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block font-medium text-sm text-gray-700">Nama Lengkap *</label>
            <input name="nama" value={formData.nama} onChange={handleChange} type="text" placeholder="Masukkan nama..." className="mt-1 block w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700">Email Aktif *</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="email@contoh.com" className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700">WhatsApp *</label>
            <input name="no_wa" value={formData.no_wa} onChange={handleChange} type="text" placeholder="0812..." className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700">Kode Afiliasi Pilihan *</label>
            <input name="kode_afiliasi" value={formData.kode_afiliasi} onChange={handleChange} type="text" placeholder="Min. 4 Karakter" className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          
          <button type="button" onClick={() => setIsOpen(true)} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
            Daftar Sekarang
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-center text-gray-800">Konfirmasi</h3>
            <p className="text-gray-600 text-center mb-6">Apakah data yang Anda masukkan sudah benar?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50" disabled={loading}>Batal</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={loading}>
                {loading ? "Memproses..." : "Ya, Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}