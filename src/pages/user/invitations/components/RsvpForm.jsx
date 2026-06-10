import React, { useState, useEffect } from 'react';
import useUcapanTamu from '../../../../api/ucapan_tamu/useUcapanTamu';
import useReceiveInvs from '../../../../api/receive-inv/useReceiveInvs';
import { toast } from 'react-toastify';

export default function RsvpForm({ invitationId, guestCode }) {
  // --- KUNCI LOGIKA DI SINI ---
  if (!guestCode) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-md">
        <h3 className="font-bold text-yellow-800">
          Tidak Bisa Mengisi Buku Tamu
        </h3>
        <p className="text-sm text-yellow-700 mt-1">
          Untuk mengisi buku tamu dan konfirmasi kehadiran, silakan gunakan link
          unik yang telah dikirimkan kepada Anda melalui WhatsApp atau Email.
        </p>
      </div>
    );
  }
  // --- AKHIR LOGIKA ---
  const { create: createUcapan, loading } = useUcapanTamu();
  const { getGuestByCode } = useReceiveInvs();
  
  const [formData, setFormData] = useState({
    guest_name: '',
    notes: '',
    attendance_status: 'hadir',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Efek untuk mengisi nama tamu secara otomatis dari database
  useEffect(() => {
    if (guestCode) {
      getGuestByCode(guestCode)
        .then(guest => {
          if (guest && guest.recipient) {
            setFormData(prev => ({ ...prev, guest_name: guest.recipient }));
          }
        })
        .catch(err => {
          console.error("Gagal mengambil nama tamu berdasarkan kode:", err);
        });
    }
  }, [guestCode, getGuestByCode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guest_name) {
      toast.error("Nama wajib diisi.");
      return;
    }
    try {
      const payload = {
        ...formData,
        invitation_id: invitationId,
        guest_code: guestCode, // Kirim guest_code ke backend untuk menautkan data
      };
      await createUcapan(payload);
      setIsSubmitted(true);
      toast.success("Terima kasih, ucapan Anda telah kami terima!");
    } catch (err) {
      toast.error("Gagal mengirim ucapan.");
    }
  };
=======
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const payload = {
      invitation_id: Number(invitationId), // Pastikan ini angka
      guest_name: formData.guest_name,
      notes: formData.notes,
      attendance_status: formData.attendance_status.toLowerCase(), // Paksa jadi huruf kecil
    };

    console.log("Payload Final:", payload);

    await createUcapan(payload);
    setIsSubmitted(true);
    toast.success("Ucapan terkirim!");
  } catch (err) {
    // Trik sakti: Lihat pesan error asli dari database di console
    console.error("Pesan Error Backend:", err.response?.data);
    toast.error(err.response?.data?.message || "Gagal mengirim ucapan.");
  }
};
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">Terima Kasih!</h2>
        <p className="mt-2 text-gray-700">Kehadiran dan doa restu Anda adalah anugerah terindah bagi kami.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Buku Tamu & Konfirmasi Kehadiran</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Anda</label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>
        <div className="flex gap-4">
            <label className="flex items-center gap-2">
                <input type="radio" name="attendance_status" value="hadir" checked={formData.attendance_status === 'hadir'} onChange={handleChange} /> Hadir
            </label>
            <label className="flex items-center gap-2">
                <input type="radio" name="attendance_status" value="tidak hadir" checked={formData.attendance_status === 'tidak hadir'} onChange={handleChange} /> Tidak Hadir
            </label>
        </div>
        <div>
          <label className="block font-medium">Tulis Ucapan & Doa</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>
    </div>
  );
}