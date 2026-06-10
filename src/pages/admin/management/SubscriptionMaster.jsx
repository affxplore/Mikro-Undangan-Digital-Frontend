// src/pages/admin/management/SubscriptionMaster.jsx (atau nama file Anda)

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useSubscription from "../../../api/subscription/useSubscription";
import useSubscriptionWithPrices from "../../../api/subscription/useSubscriptionWithPrices";
import usePrices from "../../../api/price/usePrice";

// --- Komponen Modal (Diperbarui untuk menangani data real) ---
const SubscriptionModal = ({ isOpen, initialData, onSave, onCancel, refreshList, updateWithPrices }) => {
  const [form, setForm] = useState({
    slug: "", 
    name: "", 
    description: "", 
    invitation_limit: 1, 
    allow_branding_removal: false, 
    prices: [],
    ...initialData
  });
  const { loading: priceLoading } = usePrices();
  const [newPrice, setNewPrice] = useState({ 
    amount: '', 
    interval: 'month',
    monthlyPrice: '',
    yearlyPrice: ''
  });

  // Update form jika initialData berubah (saat membuka modal yang berbeda)
  useEffect(() => {
    if (initialData) {
      console.log('Setting form with initialData:', initialData); // Debug log
      setForm({
        id: initialData.id, // Tambahkan id field
        slug: initialData.slug || "", 
        name: initialData.name || "", 
        description: initialData.description || "", 
        invitation_limit: Number(initialData.invitation_limit) || 1, 
        allow_branding_removal: Boolean(initialData.allow_branding_removal),
        prices: Array.isArray(initialData.prices) ? [...initialData.prices] : []
      });
      console.log('Form prices loaded:', initialData.prices); // Debug log
    } else {
      setForm({
        slug: "", 
        name: "", 
        description: "", 
        invitation_limit: 1, 
        allow_branding_removal: false,
        prices: []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSave(form, newPrice); // Passing newPrice state to parent
  };

  const handleAddPrice = async () => {
    try {
      if (!initialData?.id || !newPrice.amount) {
        toast.error("Harga harus diisi."); 
        return;
      }

      // Validasi input
      const amount = Number(newPrice.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Harga harus berupa angka positif");
        return;
      }

      // Validasi interval yang sama
      const existingPriceWithInterval = form.prices.find(p => p.interval === newPrice.interval);
      if (existingPriceWithInterval) {
        toast.error(`Harga untuk periode ${newPrice.interval === 'month' ? 'bulanan' : 'tahunan'} sudah ada`);
        return;
      }

      // Update prices lokal
      const updatedPrices = [
        ...form.prices,
        {
          amount: amount,
          interval: newPrice.interval
        }
      ];

      // Update subscription dengan prices baru
      await updateWithPrices(initialData.id, {
        ...form,
        prices: updatedPrices
      });

      // Reset form harga
      setNewPrice({ amount: '', interval: 'month' });
      
      // Refresh data
      await refreshList();
      
      toast.success("Harga berhasil ditambahkan!");
    } catch (error) {
      console.error('Error adding price:', error);
      toast.error(error.response?.data?.message || "Gagal menambah harga");
    }
  };

  const handleDeletePrice = async (priceId) => {
    try {
      const result = await Swal.fire({
        title: 'Hapus Harga?',
        text: 'Yakin ingin menghapus harga ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        // Filter out the price to delete
        const updatedPrices = form.prices.filter(p => p.id !== priceId);

        // Update subscription dengan prices yang sudah difilter
        await updateWithPrices(initialData.id, {
          ...form,
          prices: updatedPrices
        });

        await refreshList();
        toast.success("Harga berhasil dihapus!");
      }
    } catch (error) {
      console.error('Error deleting price:', error);
      toast.error(error.response?.data?.message || "Gagal menghapus harga");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{initialData && initialData.id ? "Edit Paket Langganan" : "Tambah Paket Baru"}</h3>
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-200"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Paket (e.g., Pro)" className="w-full p-2 border rounded" required />
          <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug (e.g., pro)" className="w-full p-2 border rounded" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi Paket" className="w-full p-2 border rounded" rows="3" required />
          <input name="invitation_limit" type="number" value={form.invitation_limit} onChange={handleChange} placeholder="Batas Undangan Aktif" className="w-full p-2 border rounded" required />
          <label className="flex items-center gap-2">
            <input name="allow_branding_removal" type="checkbox" checked={form.allow_branding_removal} onChange={handleChange} />
            Izinkan Hapus Branding
          </label>
          
          <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2">Manajemen Harga</h4>
              {initialData && initialData.id ? (
                // Mode Edit: Tampilkan daftar harga yang ada
                <>
                  {form.prices?.length > 0 ? (
                    form.prices.map(price => (
                      <div key={price.id} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                        <span>{price.interval === 'month' ? 'Bulanan' : 'Tahunan'}: Rp {Number(price.amount).toLocaleString('id-ID')}</span>
                        <button type="button" onClick={() => handleDeletePrice(price.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><FaTrash size={14}/></button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Belum ada harga untuk paket ini.</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <input type="number" value={newPrice.amount} onChange={(e) => setNewPrice({...newPrice, amount: e.target.value})} placeholder="Harga Baru" className="flex-grow p-2 border rounded" />
                    <select value={newPrice.interval} onChange={(e) => setNewPrice({...newPrice, interval: e.target.value})} className="p-2 border rounded">
                      <option value="month">Bulanan</option>
                      <option value="year">Tahunan</option>
                    </select>
                    <button type="button" onClick={handleAddPrice} disabled={priceLoading} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"><FaPlus /></button>
                  </div>
                </>
              ) : (
                // Mode Add: Tampilkan form harga baru
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Masukkan harga paket (minimal satu harga):</p>
                  <div className="flex gap-2">
                    <input type="number" 
                           name="monthlyPrice"
                           value={newPrice.monthlyPrice || ''} 
                           onChange={(e) => setNewPrice({...newPrice, monthlyPrice: e.target.value})} 
                           placeholder="Harga Bulanan (Rp)" 
                           className="flex-grow p-2 border rounded" />
                  </div>
                  <div className="flex gap-2">
                    <input type="number" 
                           name="yearlyPrice"
                           value={newPrice.yearlyPrice || ''} 
                           onChange={(e) => setNewPrice({...newPrice, yearlyPrice: e.target.value})} 
                           placeholder="Harga Tahunan (Rp)" 
                           className="flex-grow p-2 border rounded" />
                  </div>
                </div>
              )}
            </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Simpan Paket</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Komponen Halaman Utama ---
export default function SubscriptionPage() {
  const { data: subscriptions, loading, getList, remove } = useSubscription();
  const navigate = useNavigate();
  const { createWithPrices, updateWithPrices } = useSubscriptionWithPrices();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getList();
  }, [getList]);

  // Set 'selected' ke item pertama saat data pertama kali dimuat
  // Hapus useEffect yang otomatis memilih item pertama
  // Biarkan user memilih sendiri paket yang ingin diedit

  const handleSave = async (subData, priceData) => {
    try {
      // Validasi data dasar subscription
      if (!subData.slug || !subData.slug.trim()) {
        toast.error("Slug tidak boleh kosong");
        return;
      }

      if (!subData.name || !subData.name.trim()) {
        toast.error("Nama paket tidak boleh kosong");
        return;
      }

      if (!subData.description || !subData.description.trim()) {
        toast.error("Deskripsi tidak boleh kosong");
        return;
      }

      const invitationLimit = parseInt(subData.invitation_limit, 10);
      if (isNaN(invitationLimit) || invitationLimit < 1) {
        toast.error("Batas undangan harus berupa angka positif");
        return;
      }

      // Bersihkan dan validasi data subscription
      const cleanData = {
        slug: subData.slug.trim(),
        name: subData.name.trim(),
        description: subData.description.trim(),
        invitation_limit: invitationLimit,
        allow_branding_removal: Boolean(subData.allow_branding_removal)
      };

      // Untuk mode add, validasi dan siapkan data harga
      let prices = [];
      if (!subData.id) {
        // Mode create: Validasi harga bulanan dan tahunan
        const monthlyPrice = parseFloat(priceData.monthlyPrice);
        const yearlyPrice = parseFloat(priceData.yearlyPrice);

        if (isNaN(monthlyPrice) || monthlyPrice <= 0) {
          toast.error("Harga bulanan harus diisi dengan nilai positif");
          return;
        }

        if (isNaN(yearlyPrice) || yearlyPrice <= 0) {
          toast.error("Harga tahunan harus diisi dengan nilai positif");
          return;
        }

        prices = [
          { amount: monthlyPrice, interval: 'month' },
          { amount: yearlyPrice, interval: 'year' }
        ];
      } else {
        // Untuk mode edit, gunakan prices yang ada
        prices = subData.prices || [];
      }

      // Siapkan payload final dengan prices
      const payload = {
        ...cleanData,
        prices: prices
      };

      let savedData;
      if (subData.id) {
        // Mode update: Update subscription dengan prices
        console.log('Updating subscription with prices:', subData.id, payload);
        savedData = await updateWithPrices(subData.id, payload);
      } else {
        // Mode create: Buat subscription dengan prices
        console.log('Creating subscription with prices:', payload);
        savedData = await createWithPrices(payload);
      }
      
      setShowModal(false);
      await getList(); // Refresh daftar
      
      // Update selected item jika sedang dalam mode edit
      if (subData.id) {
        setSelected(savedData);
      }
      
      toast.success(subData.id ? "Paket berhasil diperbarui!" : "Paket baru berhasil dibuat!");
    } catch (error) {
      console.error('Error saving subscription:', error);
      
      // Handle different types of errors
      let errorMessage = "Gagal menyimpan paket. Silakan coba lagi.";
      
      if (error.message) {
        // Custom validation errors or processed backend errors
        errorMessage = error.message;
      } else if (error.response?.data) {
        // Backend API errors
        if (error.response.data.meta?.message) {
          errorMessage = error.response.data.meta.message;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          // Handle HTML error responses
          if (error.response.data.includes('Transaction cannot be rolled back')) {
            errorMessage = "Terjadi kesalahan pada database. Silakan coba lagi atau hubungi administrator.";
          }
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    
    try {
      const result = await Swal.fire({
        title: 'Hapus Paket?',
        text: `Yakin ingin menghapus paket "${selected.name}"? Semua harga terkait juga akan dihapus.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await remove(selected.id);
        toast.success("Paket berhasil dihapus!");
        await getList();
        setSelected(null);
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error(error.response?.data?.message || "Gagal menghapus paket");
    }
  };

  const openModalForNew = () => {
    setSelected(null); // Reset selected item
    setShowModal(true);
  };

  const openModalForEdit = () => {
    if (!selected) {
      toast.error("Pilih paket terlebih dahulu");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Subscription</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola Data List Paket Subscription di website.</p>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-10rem)] pb-5">
        {/* Sidebar List */}
        <div className="w-1/3 bg-white rounded-2xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Paket Subscription</h2>
          <div className="space-y-2 overflow-y-auto flex-grow">
            {loading && <p>Loading...</p>}
            
            {/* --- PERUBAHAN DI SINI --- */}
            {subscriptions
              .slice() // Buat salinan array agar tidak mengubah state asli
              .sort((a, b) => a.id - b.id) // Urutkan berdasarkan ID dari kecil ke besar
              .map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelected(plan)}
                  className={`p-3 rounded-xl cursor-pointer border ${
                    selected?.id === plan.id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
                  }`}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="space-y-1">
                    {plan.slug.toLowerCase() === 'free' || plan.name.toLowerCase().includes('free') ? (
                      <p className="text-sm font-medium text-gray-600">Free</p>
                    ) : (
                      <>
                        {/* Harga Bulanan - Selalu di atas */}
                        {plan.prices.find(p => p.interval === 'month') && (
                          <p className="text-sm font-medium text-green-600">
                            Rp {Number(plan.prices.find(p => p.interval === 'month').amount).toLocaleString("id-ID")} / bulan
                          </p>
                        )}
                        {/* Harga Tahunan - Selalu di bawah */}
                        {plan.prices.find(p => p.interval === 'year') && (
                          <p className="text-sm font-medium text-blue-600">
                            Rp {Number(plan.prices.find(p => p.interval === 'year').amount).toLocaleString("id-ID")} / tahun
                          </p>
                        )}
                        {!plan.prices.find(p => p.interval === 'month') && !plan.prices.find(p => p.interval === 'year') && (
                          <p className="text-sm text-gray-500">Belum ada harga</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            {/* --- AKHIR PERUBAHAN --- */}
          </div>
          <div className="pt-4 border-t mt-4 flex gap-2">
            <button onClick={openModalForNew} className="w-full bg-blue-500 text-white py-2 rounded-xl">Tambah Paket</button>
            <button onClick={handleDelete} disabled={!selected} className="w-full bg-red-500 text-white py-2 rounded-xl disabled:bg-gray-300">Hapus</button>
          </div>
        </div>

        {/* Detail View */}
        <div className="w-2/3 ml-6 bg-white rounded-2xl shadow p-6 overflow-y-auto">
          {selected ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <button onClick={openModalForEdit} className="px-3 py-1 bg-blue-500 text-white rounded-lg">Edit</button>
              </div>
              <p className="text-gray-500 mb-2">{selected.description}</p>
              
              <div className="space-y-1 mb-4">
                {selected.slug.toLowerCase() === 'free' || selected.name.toLowerCase().includes('free') ? (
                  <p className="text-lg font-semibold text-gray-600">Free</p>
                ) : (
                  <>
                    {/* Harga Bulanan - Selalu di atas */}
                    {selected.prices.find(p => p.interval === 'month') && (
                      <p className="text-lg font-semibold text-green-600">
                        Rp {Number(selected.prices.find(p => p.interval === 'month').amount).toLocaleString("id-ID")} / bulan
                      </p>
                    )}
                    {/* Harga Tahunan - Selalu di bawah */}
                    {selected.prices.find(p => p.interval === 'year') && (
                      <p className="text-lg font-semibold text-blue-600">
                        Rp {Number(selected.prices.find(p => p.interval === 'year').amount).toLocaleString("id-ID")} / tahun
                      </p>
                    )}
                  </>
                )}
              </div>

              <h3 className="mt-4 font-semibold">Detail Paket:</h3>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>Batas Undangan Aktif: <strong>{selected.invitation_limit}</strong></li>
                <li>Boleh Hapus Branding: <strong>{selected.allow_branding_removal ? 'Ya' : 'Tidak'}</strong></li>
              </ul>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Pilih paket di sebelah kiri untuk melihat detail.</div>
          )}
        </div>
      </div>
      
      {showModal && (
        <SubscriptionModal
          isOpen={showModal}
          initialData={selected}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          refreshList={getList}
          updateWithPrices={updateWithPrices}
        />
      )}
    </div>
  );
}