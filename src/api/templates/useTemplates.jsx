import { useCallback, useState } from "react";
import apiService from "../apiService"; // <-- 1. GANTI import dari 'axios' ke 'apiService'
import { fromBackend, toBackend } from "./TemplatesModel"; // Sesuaikan nama file jika perlu

// 2. Gunakan path relatif. Base URL sudah ada di apiService.
const API_URL = "/templates";

// Definisikan fungsi API call
const apiTemp = {
  getList: (params) => {
    console.log("🌐 [apiTemp] GET /templates with params:", params);
    return apiService.get(API_URL, { params });
  },
  getById: (id) => {
    console.log("🌐 [apiTemp] GET /templates/" + id);
    return apiService.get(`${API_URL}/${id}`);
  },
  create: (payload) => {
    console.log("🌐 [apiTemp] POST /templates with payload:", payload);
    return apiService.post(API_URL, payload);
  },
  update: (id, payload) => {
    console.log("🌐 [apiTemp] PUT /templates/" + id + " with payload:", payload);
    return apiService.put(`${API_URL}/${id}`, payload);
  },
  remove: (id) => {
    console.log("🌐 [apiTemp] DELETE /templates/" + id);
    return apiService.delete(`${API_URL}/${id}`);
  },
};

// Custom hook 'usePayment'
export default function useTemplates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRows: 0,
    limit: 10,
  });

  // Fungsi untuk mengambil daftar data (tidak ada perubahan signifikan di sini)
  const getList = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const filter = {};
        if (params.search) filter.search = params.search;
        if (params.category_id) filter.category_id = params.category_id;
        if (params.label) filter.label = params.label;
        // ❌ PERBAIKAN: sort tidak masuk ke filter, tapi langsung ke queryParams

        const queryParams = {
          page: params.page || 1,
          limit: params.limit || pagination.limit,
        };

        // ✅ PERBAIKAN: sort langsung sebagai parameter query
        if (params.sort) {
          queryParams.sort = params.sort;
        }

        // ✅ PERBAIKAN: Backend memproses filter sebagai JSON string di req.query.filter
        if (Object.keys(filter).length > 0) {
          queryParams.filter = JSON.stringify(filter);
          console.log("🔬 [useTemplates] Sending filter as JSON string:", queryParams.filter);
        }

        console.log("🚀 [useTemplates] Mengirim parameter ke API:", queryParams);
        console.log("🚀 [useTemplates] Filter object:", filter);
        console.log("🚀 [useTemplates] Sort parameter:", params.sort);
        
        // 🧪 DEBUGGING: Test basic request tanpa filter/sort terlebih dahulu
        let testParams = { page: queryParams.page, limit: queryParams.limit };
        console.log("🧪 [useTemplates] Testing basic request first:", testParams);
        
        try {
          const basicTest = await apiTemp.getList(testParams);
          console.log("✅ [useTemplates] Basic request SUCCESS:", basicTest.status);
          console.log("✅ [useTemplates] Basic response:", basicTest.data);
        } catch (basicError) {
          console.error("❌ [useTemplates] Basic request FAILED:", basicError);
          console.error("❌ [useTemplates] Basic error details:", {
            status: basicError.response?.status,
            message: basicError.message,
            data: basicError.response?.data
          });
          throw basicError; // Stop here if basic request fails
        }
        
        // If basic works, try with current params
        console.log("🧪 [useTemplates] Basic request worked, now testing with full params:", queryParams);
        const res = await apiTemp.getList(queryParams);
        console.log("📡 [useTemplates] Raw API Response:", res);
        console.log("📡 [useTemplates] Response Status:", res.status);
        console.log("📡 [useTemplates] Response Data Structure:", res.data);

        // Cek apakah response valid
        if (!res.data) {
          throw new Error("Invalid response: no data property");
        }

        // Coba berbagai kemungkinan struktur response dari backend
        let listData = [];
        let paginationData = {};

        // Kemungkinan 1: res.data.data (standar dengan successResponse wrapper)
        if (res.data.data) {
          listData = res.data.data;
          paginationData = res.data.pagination || {};
          console.log("� [useTemplates] Using structure: res.data.data");
        }
        // Kemungkinan 2: res.data langsung adalah array (tanpa wrapper)
        else if (Array.isArray(res.data)) {
          listData = res.data;
          paginationData = res.pagination || {};
          console.log("� [useTemplates] Using structure: res.data (direct array)");
        }
        // Kemungkinan 3: ada property lain
        else {
          console.log("📡 [useTemplates] Unknown response structure, trying to detect...");
          console.log("📡 [useTemplates] Available properties:", Object.keys(res.data));
          
          // Coba cari array di properties yang ada
          for (const key of Object.keys(res.data)) {
            if (Array.isArray(res.data[key])) {
              listData = res.data[key];
              console.log(`📡 [useTemplates] Found array in property: ${key}`);
              break;
            }
          }
        }

        console.log("📋 [useTemplates] List Data dari Backend:", listData);
        console.log("📋 [useTemplates] List Data Type:", typeof listData, "Length:", listData?.length);
        
        console.log("📄 [useTemplates] Pagination Data:", paginationData);
        
        // ✅ Backend sudah kirim data yang sudah di-format via templateResponse di GetDataList
        // Jadi tidak perlu mapping lagi dengan fromBackend
        const mappedData = listData; // Data sudah dalam format yang benar
        console.log("🔄 [useTemplates] Data sudah di-format oleh backend, skip mapping");
      
        
        setData(mappedData);
        
        const finalPagination = {
          currentPage: paginationData.currentPage || queryParams.page || 1,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalRows || 0) / queryParams.limit) || 1,
          totalRows: paginationData.totalRows || 0,
          limit: paginationData.limit || queryParams.limit,
        };
        
        console.log("📄 [useTemplates] Final Pagination:", finalPagination);
        setPagination(finalPagination);

      } catch (err) {
        console.error("❌ [useTemplates] Error fetching templates list:", err);
        console.error("❌ [useTemplates] Error details:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
          responseText: err.response?.data
        });
        
        // Log detail error response dari backend
        if (err.response?.data) {
          console.error("❌ [useTemplates] Backend Error Response:", err.response.data);
          console.error("❌ [useTemplates] Backend Error Message:", err.response.data.message);
          console.error("❌ [useTemplates] Backend Error Meta:", err.response.data.meta);
          console.error("❌ [useTemplates] Full Error Object:", JSON.stringify(err.response.data, null, 2));
        }
        
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const getById = useCallback(async (id) => {
    console.log("🔍 [useTemplates] Getting template by ID:", id);
    setLoading(true);
    setError(null);
    try {
      const res = await apiTemp.getById(id);
      console.log("🔍 [useTemplates] GetById response:", res);
      const result = fromBackend(res.data.data);
      console.log("🔍 [useTemplates] GetById mapped result:", result);
      return result; // Kembalikan data yang sudah di-map
    } catch (err) {
      console.error("❌ [useTemplates] Error in getById:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk membuat data baru
const create = useCallback(async (templateData) => {
    console.log("🆕 [useTemplates] Creating template with data:", templateData);
    setLoading(true);
    setError(null);
    const payload = toBackend(templateData);
    console.log("🆕 [useTemplates] Payload after toBackend:", payload);
    try {
      const res = await apiTemp.create(payload); // Menggunakan apiTemp.create
      console.log("🆕 [useTemplates] Create response:", res);
      const result = fromBackend(res.data.data);
      console.log("🆕 [useTemplates] Create mapped result:", result);
      return result;
    } catch (err) {
      console.error("❌ [useTemplates] Error creating template:", err);
      console.error("❌ [useTemplates] Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengupdate data
  const update = useCallback(async (id, templateData) => {
    console.log("✏️ [useTemplates] Updating template ID:", id, "with data:", templateData);
    setLoading(true);
    setError(null);
    const payload = toBackend(templateData);
    console.log("✏️ [useTemplates] Update payload after toBackend:", payload);
    try {
      const res = await apiTemp.update(id, payload); // Menggunakan apiTemp.update
      console.log("✏️ [useTemplates] Update response:", res);
      const result = fromBackend(res.data.data);
      console.log("✏️ [useTemplates] Update mapped result:", result);
      return result;
    } catch (err) {
      console.error("❌ [useTemplates] Error updating template:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk menghapus data
   const remove = useCallback(async (id) => {
    console.log("🗑️ [useTemplates] Removing template ID:", id);
    setLoading(true);
    setError(null);
    try {
      const res = await apiTemp.remove(id); // <-- Gunakan nama yang konsisten
      console.log("🗑️ [useTemplates] Remove response:", res);
    } catch (err) {
      console.error("❌ [useTemplates] Error deleting template:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    getList,
    getById,
    create,
    update,
    remove, // Ganti nama agar tidak konflik dengan keyword 'delete'
  };
}