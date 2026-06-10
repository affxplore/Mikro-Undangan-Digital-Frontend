import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // jika pakai react-router
import { MdOutlineArrowBack } from 'react-icons/md';

export default function AffiliatorForm() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate?.();

  const handleClose = () => {
    setIsOpen(false);
    if (navigate) navigate(-1);
  };

  const handleBack = () => {
    if (navigate) navigate(-1);
    else window.history.back(); // fallback kalau tidak pakai react-router
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      {/* Konten utama diblur saat modal terbuka */}
      <div className={`transition-filter ${isOpen ? 'filter blur-sm' : ''} w-full max-w-md`}>
        {/* Header dengan tombol kembali + judul */}
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBack} 
              className="mr-2 text-3xl text-gray-600 hover:text-gray-900"
          >
            <MdOutlineArrowBack/>
          </button>
          <h2 className="text-xl font-semibold text-center flex-1">Menjadi Afilator</h2>
        </div>

        <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          {/* Nama */}
          <div>
            <label className="block font-medium">Nama *</label>
            <input 
              type="text" 
              placeholder="masukkan nama kamu.." 
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Kota */}
          <div>
            <label className="block font-medium">Kota *</label>
            <input 
              type="text" 
              placeholder="Masukkan nama kota kamu"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Alamat */}
          <div>
            <label className="block font-medium">Alamat *</label>
            <textarea 
              placeholder="Masukkan alamat kamu" 
              rows="2"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Kode Pos */}
          <div>
            <label className="block font-medium">Kode Pos *</label>
            <input 
              type="text" 
              placeholder="Masukkan kode pos wilayahmu"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* WhatsApp */}
          <div>
            <label className="block font-medium">WhatsApp Aktif *</label>
            <input 
              type="number" 
              placeholder="0812345678"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Email */}
          <div>
            <label className="block font-medium">E-Mail Aktif *</label>
            <input 
              type="email" 
              placeholder="masukkan e-mail aktif"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Kode Afiliasi */}
          <div>
            <label className="block font-medium">Kode Afiliasi *</label>
            <input 
              type="text" 
              placeholder="Buat kode afiliasi kamu"
              className="mt-1 block w-full border rounded px-3 py-2" 
            />
          </div>
          {/* Submit */}
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          {/* Konten modal */}
          <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            {/* Tombol silang */}
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <span className="text-xl">&times;</span>
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Konfirmasi Pembaruan</h3>
            <p className="mb-6 text-center">Apakah kamu yakin ingin memperbarui profil?</p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={handleClose}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  /* tambahkan logika submit di sini */
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
