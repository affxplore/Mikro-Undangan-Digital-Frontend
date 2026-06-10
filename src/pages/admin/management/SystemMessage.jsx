import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import AlertConfirmation from "../../../components/AlertConfirmation";
import useSystemMessage from "../../../api/system_message/useSystemMessage";

const SystemMessagePage = () => {
  const { data, loading, error, getList, create, update, remove } = useSystemMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: null });
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getList();
  }, [getList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      await update(editData.id, form);
    } else {
      await create(form);
    }
    setIsOpen(false);
    setEditData(null);
    setForm({ title: "", content: "" });
  };

  const openDeleteConfirmation = (message) => {
    setConfirmDialog({ open: true, message });
  };

  const closeDeleteConfirmation = () => {
    if (confirmLoading) return;
    setConfirmDialog({ open: false, message: null });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.message) return;

    setConfirmLoading(true);
    try {
      await remove(confirmDialog.message.id);
      toast.success("Pesan sistem berhasil dihapus.");
      await getList();
      setConfirmDialog({ open: false, message: null });
    } catch (error) {
      toast.error("Gagal menghapus pesan sistem.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const confirmMessage = confirmDialog.message;
  const confirmHighlight = confirmMessage ? (
    <div className="space-y-2 text-left">
      <p className="text-sm font-semibold text-neutral-900">{confirmMessage.title}</p>
      <p className="text-xs text-neutral-600">{confirmMessage.content}</p>
    </div>
  ) : null;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
            <FiArrowLeft className="text-gray-700 text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">System Messages</h1>
            <p className="text-gray-500 text-sm mt-0.5">Kelola pesan sistem untuk pengguna.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => { setEditData(null); setForm({ title: "", content: "" }); setIsOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm font-medium">
            <FiPlus />
            Tambah Pesan
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Terjadi kesalahan saat fetch data</p>}

      <table className="w-full border-collapse border border-slate-200">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-200 px-4 py-2 text-left">Judul</th>
            <th className="border border-slate-200 px-4 py-2 text-left">Konten</th>
            <th className="border border-slate-200 px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((msg) => (
            <tr key={msg.id}>
              <td className="border border-slate-200 px-4 py-2">{msg.title}</td>
              <td className="border border-slate-200 px-4 py-2">{msg.content}</td>
              <td className="border border-slate-200 px-4 py-2">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditData(msg);
                      setForm({ title: msg.title, content: msg.content });
                      setIsOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => openDeleteConfirmation(msg)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && !loading && (
            <tr>
              <td colSpan={3} className="text-center text-slate-500 py-4">
                Belum ada system message.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit System Message" : "Tambah System Message"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konten</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setEditData(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AlertConfirmation
        open={confirmDialog.open}
        icon={FiTrash2}
        variant="danger"
        title="Hapus Pesan Sistem"
        description="Pesan akan dihapus secara permanen dan tidak dapat dipulihkan."
        highlight={confirmHighlight}
        meta="Penghapusan pesan"
        confirmText="Ya, hapus"
        cancelText="Batal"
        onCancel={closeDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
      />
    </div>
  );
};

export default SystemMessagePage;
