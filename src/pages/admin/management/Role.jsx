
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRole from "../../../api/role/useRole";
import { toast } from "react-toastify"; // Impor toast
import { Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react"; // Ganti ikon string dengan Lucide
import apiService from "../../../api/apiService"; // Impor apiService untuk fetch access levels

import AlertConfirmation from "../../../components/AlertConfirmation";

// File: src/pages/admin/management/Role.jsx

const menus = [
  // Grup Utama
  "Dashboard",
  "Website",
  "Invitation",
  "Template",
  "User",
  "Affiliate",
  "Report",
  "System Setting",

  // Grup Data Master (Pecahan)
  "Kategori",
  "Diskon",
  "Payment",
  "Subscription",
  "Role Access",
  "System Content",

  // Grup Fitur Tambahan (Baru ditambahkan)
  "Kata Ucapan",
  "Project",
  "Receive Inv",
  "Sebar Undangan",
  "Transaksi",
];

// Kunci Aksi: R -> read, C -> create, U -> update, D -> delete
const accessCodeMapping = {
  // Dashboard (DB)
  DB_R: { menu: "Dashboard", action: "read" },
  DB_C: { menu: "Dashboard", action: "create" },
  DB_U: { menu: "Dashboard", action: "update" },
  DB_D: { menu: "Dashboard", action: "delete" },

  // Website (WS)
  WS_R: { menu: "Website", action: "read" },
  WS_C: { menu: "Website", action: "create" },
  WS_U: { menu: "Website", action: "update" },
  WS_D: { menu: "Website", action: "delete" },

  // Affiliate (AF)
  AF_R: { menu: "Affiliate", action: "read" },
  AF_C: { menu: "Affiliate", action: "create" },
  AF_U: { menu: "Affiliate", action: "update" },
  AF_D: { menu: "Affiliate", action: "delete" },

  // Report (RP)
  RP_R: { menu: "Report", action: "read" },
  RP_C: { menu: "Report", action: "create" },
  RP_U: { menu: "Report", action: "update" },
  RP_D: { menu: "Report", action: "delete" },

  // System Setting (SS)
  SS_R: { menu: "System Setting", action: "read" },
  SS_C: { menu: "System Setting", action: "create" },
  SS_U: { menu: "System Setting", action: "update" },
  SS_D: { menu: "System Setting", action: "delete" },

  // Kategori (CA)
  CA_R: { menu: "Kategori", action: "read" },
  CA_C: { menu: "Kategori", action: "create" },
  CA_U: { menu: "Kategori", action: "update" },
  CA_D: { menu: "Kategori", action: "delete" },

  // Diskon (DC)
  DC_R: { menu: "Diskon", action: "read" },
  DC_C: { menu: "Diskon", action: "create" },
  DC_U: { menu: "Diskon", action: "update" },
  DC_D: { menu: "Diskon", action: "delete" },

  // Invitation (IV)
  IV_R: { menu: "Invitation", action: "read" },
  IV_C: { menu: "Invitation", action: "create" },
  IV_U: { menu: "Invitation", action: "update" },
  IV_D: { menu: "Invitation", action: "delete" },

  // Kata Ucapan (KU)
  KU_R: { menu: "Kata Ucapan", action: "read" },
  KU_C: { menu: "Kata Ucapan", action: "create" },
  KU_U: { menu: "Kata Ucapan", action: "update" },
  KU_D: { menu: "Kata Ucapan", action: "delete" },

  // Payment (PY)
  PY_R: { menu: "Payment", action: "read" },
  PY_C: { menu: "Payment", action: "create" },
  PY_U: { menu: "Payment", action: "update" },
  PY_D: { menu: "Payment", action: "delete" },

  // Project (PJ)
  PJ_R: { menu: "Project", action: "read" },
  PJ_C: { menu: "Project", action: "create" },
  PJ_U: { menu: "Project", action: "update" },
  PJ_D: { menu: "Project", action: "delete" },

  // Receive Invitation (RI)
  RI_R: { menu: "Receive Inv", action: "read" },
  RI_C: { menu: "Receive Inv", action: "create" },
  RI_U: { menu: "Receive Inv", action: "update" },
  RI_D: { menu: "Receive Inv", action: "delete" },

  // Role Access (RL)
  RL_R: { menu: "Role Access", action: "read" },
  RL_C: { menu: "Role Access", action: "create" },
  RL_U: { menu: "Role Access", action: "update" },
  RL_D: { menu: "Role Access", action: "delete" },

  // Sebar Undangan (SU)
  SU_R: { menu: "Sebar Undangan", action: "read" },
  SU_C: { menu: "Sebar Undangan", action: "create" },
  SU_U: { menu: "Sebar Undangan", action: "update" },
  SU_D: { menu: "Sebar Undangan", action: "delete" },

  // Subscription (SB)
  SB_R: { menu: "Subscription", action: "read" },
  SB_C: { menu: "Subscription", action: "create" },
  SB_U: { menu: "Subscription", action: "update" },
  SB_D: { menu: "Subscription", action: "delete" },

  // System Content (SC)
  SC_R: { menu: "System Content", action: "read" },
  SC_C: { menu: "System Content", action: "create" },
  SC_U: { menu: "System Content", action: "update" },
  SC_D: { menu: "System Content", action: "delete" },

  // Template (TM)
  TM_R: { menu: "Template", action: "read" },
  TM_C: { menu: "Template", action: "create" },
  TM_U: { menu: "Template", action: "update" },
  TM_D: { menu: "Template", action: "delete" },

  // User (US)
  US_R: { menu: "User", action: "read" },
  US_C: { menu: "User", action: "create" },
  US_U: { menu: "User", action: "update" },
  US_D: { menu: "User", action: "delete" },

  // Transaksi (TR)
  TR_R: { menu: "Transaksi", action: "read" },
  TR_C: { menu: "Transaksi", action: "create" },
};

// Fungsi untuk membuat struktur data permission default (tidak berubah)
const createDefaultPermissions = () => {
  return menus.reduce((acc, menu) => {
    // Sesuaikan aksi default berdasarkan kebutuhan menu tersebut
    // Contoh: Dashboard mungkin hanya punya 'read'
    acc[menu] = { read: false, create: false, update: false, delete: false };
    return acc;
  }, {});
};

const findPermissionCode = (menuName, actionName, mapping) => {
  return Object.keys(mapping).find(
    (key) =>
      mapping[key].menu === menuName && mapping[key].action === actionName
  );
};

// --- Komponen Utama ---
export default function Role() {
  const navigate = useNavigate();
  const { rolesData, rolesLoading, createRole, updateRole, deleteRole } =
    useRole();

  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState(createDefaultPermissions());
  const [search, setSearch] = useState("");
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [roleEditData, setRoleEditData] = useState({
    name: "",
    description: "",
  });

  const [newRoleData, setNewRoleData] = useState({ name: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, role: null });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // State baru untuk menyimpan master data access levels dari backend
  const [allAccessLevels, setAllAccessLevels] = useState([]);

  // --- Fetch Master Data Access Levels ---
  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        const response = await apiService.get("/access-levels");
        setAllAccessLevels(response.data.data || []);
      } catch (error) {
        toast.error("Gagal memuat master data hak akses.");
      }
    };
    fetchAccessLevels();
  }, []);

  // --- Sinkronisasi State Saat Role Dipilih ---
useEffect(() => {
  if (selectedRole) {
    // Bagian 1: Logika untuk menghitung state checkbox permission (dari File 2)
    const newPermissions = createDefaultPermissions();
    const roleAccessCodes =
      selectedRole.accessLevels?.map((al) => al.code) || [];

    roleAccessCodes.forEach((code) => {
      const mapping = accessCodeMapping[code];
      if (mapping) {
        const { menu, action } = mapping;
        if (newPermissions[menu]) {
          newPermissions[menu][action] = true;
        }
      }
    });

    // Bagian 2: Logika untuk data inline edit (dari File 1)
    setRoleEditData({
      name: selectedRole.name,
      description: selectedRole.description || "",
    });
    setIsEditingInline(false);

    // --- PERBAIKAN: Terapkan state permission yang sudah dihitung ---
    setPermissions(newPermissions); // <-- Baris ini yang hilang di File 1

  } else {
    // Reset kedua state jika tidak ada role yang dipilih
    setPermissions(createDefaultPermissions());
    setRoleEditData({ name: "", description: "" });
  }
}, [selectedRole]); // Dependensi sudah benar


  
  // --- HANDLER UNTUK CHECKBOX ---
  const togglePermission = (menu, action) => {
    setPermissions((prev) => ({
      ...prev,
      [menu]: { ...prev[menu], [action]: !prev[menu][action] },
    }));
  };

  // --- FUNGSI CRUD ---

  // 1. Konversi state frontend ke array access_lv_ids untuk backend
  const prepareSavePayload = () => {
  const access_lv_ids = [];
  for (const menuName in permissions) {
    for (const actionName in permissions[menuName]) {
      if (permissions[menuName][actionName]) {
        const codeToFind = Object.keys(accessCodeMapping).find(
          (key) =>
            accessCodeMapping[key].menu === menuName &&
            accessCodeMapping[key].action === actionName
        );
        if (codeToFind) {
          const matchingAccessLevel = allAccessLevels.find(
            (al) => al.code === codeToFind
          );
          if (matchingAccessLevel) {
            access_lv_ids.push(matchingAccessLevel.id);
          }
        }
      }
    }
  }
  return access_lv_ids; // Kembalikan array ID
};

// 2. Handler Simpan (Update Role) - Panggil helper di sini
const handleSave = async () => {
  if (!selectedRole) {
    toast.warn("Silakan pilih role terlebih dahulu.");
    return;
  }
  if (allAccessLevels.length === 0) {
    toast.error("Master data hak akses belum dimuat. Coba refresh halaman.");
    return;
  }

  // Panggil fungsi konversi data
  const access_lv_ids = prepareSavePayload(); 
  
const payload = {
    name: roleEditData.name, // <-- Ambil dari roleEditData
    description: roleEditData.description, // <-- Ambil dari roleEditData
    access_lv_ids: access_lv_ids,
  };
  
  // Validasi nama tidak boleh kosong saat edit
  if (!payload.name.trim()) {
      toast.error("Nama role tidak boleh kosong.");
      return;
  }

  try {
    await updateRole(selectedRole.id, payload);
    setIsEditingInline(false); // Kembali ke mode lihat setelah sukses menyimpan
  } catch (error) {
    // Biarkan error ditangani oleh hook, toast error akan muncul dari sana
  }
};

  // 3. Handler Tambah Role Baru
  const handleAddRole = async () => {
    if (!newRoleData.name.trim()) {
      // Validasi menggunakan state objek baru
      toast.error("Nama role wajib diisi!");
      return;
    }
    try {
      await createRole({
        name: newRoleData.name,
        description: newRoleData.description, // Kirim deskripsi dari state objek
        access_lv_ids: [],
      });
      setIsModalOpen(false);
      setNewRoleData({ name: "", description: "" }); // Reset state objek
    } catch (error) {
      // Error handling (toast sudah ada di hook)
    }
  };

  // 4. Handler Hapus Role
  const closeDeleteDialog = useCallback(() => {
    if (confirmLoading) return;
    setConfirmDialog({ open: false, role: null });
  }, [confirmLoading]);

  const openDeleteDialog = (role) => {
    setConfirmDialog({ open: true, role });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.role) return;

    setConfirmLoading(true);
    const { id } = confirmDialog.role;

    try {
      await deleteRole(id);
      if (selectedRole?.id === id) {
        setSelectedRole(null);
      }
      toast.success("Role berhasil dihapus.");
      setConfirmDialog({ open: false, role: null });
    } catch (error) {
      toast.error("Gagal menghapus role.");
    } finally {
      setConfirmLoading(false);
    }
  };

  // --- Render Logic ---
  const confirmRole = confirmDialog.role;
  const confirmHighlight = confirmRole ? (
    <div className="space-y-2 text-left">
      <p className="text-base font-semibold text-neutral-900">{confirmRole.name}</p>
      {confirmRole.description ? (
        <p className="text-xs text-neutral-600">{confirmRole.description}</p>
      ) : null}
    </div>
  ) : null;

  const filteredRoles = rolesData.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      (role.description || "").toLowerCase().includes(search.toLowerCase())
  );

  // Auto-select role pertama saat data pertama kali dimuat
  useEffect(() => {
    if (!selectedRole && rolesData.length > 0) {
      setSelectedRole(rolesData[0]);
    }
  }, [rolesData, selectedRole]);

  // --- RENDER JSX ---
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
          <ArrowLeft className="text-gray-700" size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Role & Hak Akses</h1>
          <p className="text-gray-500 text-sm mt-0.5">Atur role dan hak akses untuk pengguna sistem.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Kolom Kiri: Daftar Role */}
        <div className="md:col-span-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Cari role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="p-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150"
            >
              <Plus size={18} /> Tambah Role Baru
            </button>
          </div>
          <ul className="space-y-1 p-2 max-h-[60vh] overflow-y-auto">
            {rolesLoading && (
              <li className="p-3 text-center text-gray-500">
                Loading roles...
              </li>
            )}
            {filteredRoles.map((role) => (
              <li key={role.id}>
                <button
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedRole?.id === role.id
                      ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300"
                      : "hover:bg-gray-50 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      {/* --- TAMBAHAN INFORMASI ID DI SINI --- */}
                      <p className="font-semibold text-gray-900">
                        {role.name}
                        <span className="ml-2 text-xs font-mono text-gray-400">
                          (ID: {role.id})
                        </span>
                      </p>
                      {/* --- AKHIR TAMBAHAN --- */}{" "}
                      <p className="text-sm text-gray-500">
                        {role.description || "Tanpa deskripsi"}
                      </p>
                    </div>
                    <Trash2
                      size={18}
                      className="text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(role);
                      }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom Kanan: Detail Hak Akses */}
        <div className="md:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {selectedRole ? (
            <>
              <div className="p-5 border-b flex justify-between items-start">
                <div>
                  {isEditingInline ? (
                    // --- MODE EDIT ---
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={roleEditData.name}
                        onChange={(e) =>
                          setRoleEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-xl font-bold text-gray-900 border border-indigo-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <textarea
                        value={roleEditData.description}
                        onChange={(e) =>
                          setRoleEditData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="text-sm text-gray-600 border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={2}
                        placeholder="Deskripsi role..."
                      />
                    </div>
                  ) : (
                    // --- MODE LIHAT (VIEW MODE) ---
                    <div
                      onDoubleClick={() => setIsEditingInline(true)}
                      title="Double-click untuk edit"
                    >
                      <h2 className="text-xl font-bold text-gray-900 cursor-pointer">
                        {roleEditData.name}
                      </h2>
                      <p className="text-gray-600 cursor-pointer">
                        {roleEditData.description ||
                          "Klik ganda untuk menambah deskripsi."}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-150 flex items-center gap-2 flex-shrink-0"
                >
                  <Save size={18} /> Simpan Perubahan
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-600 border-b">
                        Menu
                      </th>
                      <th className="p-3 text-center font-semibold text-gray-600 border-b w-20">
                        Baca
                      </th>
                      <th className="p-3 text-center font-semibold text-gray-600 border-b w-20">
                        Tambah
                      </th>
                      <th className="p-3 text-center font-semibold text-gray-600 border-b w-20">
                        Ubah
                      </th>
                      <th className="p-3 text-center font-semibold text-gray-600 border-b w-20">
                        Hapus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu) => {
                      // Cek ketersediaan aksi untuk menu ini
                      const hasReadAction = findPermissionCode(
                        menu,
                        "read",
                        accessCodeMapping
                      );
                      const hasCreateAction = findPermissionCode(
                        menu,
                        "create",
                        accessCodeMapping
                      );
                      const hasUpdateAction = findPermissionCode(
                        menu,
                        "update",
                        accessCodeMapping
                      );
                      const hasDeleteAction = findPermissionCode(
                        menu,
                        "delete",
                        accessCodeMapping
                      );

                      return (
                        <tr
                          key={menu}
                          className="border-b hover:bg-gray-50 transition duration-100"
                        >
                          <td className="p-3 font-medium text-gray-800 border-r">
                            {menu}
                          </td>

                          {/* Kolom Baca */}
                          <td className="p-3 text-center border-r">
                            {hasReadAction && ( // Hanya render jika izin 'read' ada untuk menu ini
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={permissions[menu]?.read || false}
                                onChange={() => togglePermission(menu, "read")}
                              />
                            )}
                          </td>

                          {/* Kolom Tambah */}
                          <td className="p-3 text-center border-r">
                            {hasCreateAction && ( // Hanya render jika izin 'create' ada untuk menu ini
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={permissions[menu]?.create || false}
                                onChange={() =>
                                  togglePermission(menu, "create")
                                }
                              />
                            )}
                          </td>

                          {/* Kolom Ubah */}
                          <td className="p-3 text-center border-r">
                            {hasUpdateAction && ( // Hanya render jika izin 'update' ada untuk menu ini
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={permissions[menu]?.update || false}
                                onChange={() =>
                                  togglePermission(menu, "update")
                                }
                              />
                            )}
                          </td>

                          {/* Kolom Hapus */}
                          <td className="p-3 text-center">
                            {hasDeleteAction && ( // Hanya render jika izin 'delete' ada untuk menu ini
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={permissions[menu]?.delete || false}
                                onChange={() =>
                                  togglePermission(menu, "delete")
                                }
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-6 flex items-center justify-center h-full text-gray-500">
              Pilih role untuk melihat detail hak akses.
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Role */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Tambah Role Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Role
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Content Creator"
                  value={newRoleData.name}
                  onChange={(e) =>
                    setNewRoleData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* --- TAMBAHAN INPUT DESKRIPSI --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Penjelasan singkat mengenai role ini"
                  value={newRoleData.description}
                  onChange={(e) =>
                    setNewRoleData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* --- AKHIR TAMBAHAN --- */}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Simpan Role
              </button>
            </div>
          </div>
        </div>
      )}
      <AlertConfirmation
        open={confirmDialog.open}
        icon={Trash2}
        variant="danger"
        title="Hapus Role"
        description="Role akan dihapus secara permanen dari sistem."
        highlight={confirmHighlight}
        meta="Penghapusan role"
        confirmText="Ya, hapus"
        cancelText="Batal"
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
      />
    </div>
  );
}
