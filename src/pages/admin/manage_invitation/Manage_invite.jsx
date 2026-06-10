// import React, { useState, useEffect } from "react";
// import { FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
// import useInvitations from "../../../api/invitations/useInvitations"; // Correct path if necessary

// const ManageInvite = () => {
//   // Destructure functions from the custom hook
//   const { 
//     data, 
//     loading, 
//     error, 
//     pagination, 
//     getList, 
//     remove 
//   } = useInvitations();

//   const [currentPage, setCurrentPage] = useState(1);  // For pagination
//   const rowsPerPage = 10;  // Rows per page
//   const [search, setSearch] = useState("");  // For search filter
//   const [filterStatus, setFilterStatus] = useState("");  // For status filter

//   // Fetch data on page load or change
//   useEffect(() => {
//     getList({
//       page: currentPage,
//       limit: rowsPerPage,
//       search: search,
//       filterStatus: filterStatus,
//     });
//   }, [getList, currentPage, search, filterStatus]);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);  // Update page number
//   };

//   const handleDeleteInvitation = async (id) => {
//     try {
//       await remove(id);  // Remove invitation
//       getList({ page: currentPage, limit: rowsPerPage });  // Re-fetch data
//     } catch (err) {
//       console.error("Error deleting invitation:", err);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString(); // Format the date to a readable format
//   };

//    const [dropdownOpen, setDropdownOpen] = useState(null); // To control which dropdown is open

//   const toggleDropdown = (id) => {
//     setDropdownOpen(dropdownOpen === id ? null : id); // Toggle the dropdown visibility
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
//       <h2 className="text-xl font-bold mb-1 text-gray-800">📜 Data Invitation</h2>
//       <p className="text-gray-500 mb-6 text-sm">
//         Seluruh data Invitation dari semua pengguna tersedia di sini.
//       </p>

//       {/* Search and Filter */}
//       <div className="flex flex-wrap gap-3 mb-5">
//         <input
//           type="text"
//           placeholder="🔍 Cari berdasarkan judul atau user..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 rounded-lg flex-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border p-2 rounded-lg shadow-sm"
//         >
//           <option value="">📌 Semua Status</option>
//           <option value="active">✅ Aktif</option>
//           <option value="expired">⏳ Kedaluwarsa</option>
//           <option value="draft">📝 Draft</option>
//         </select>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading...</p>  // Show loading state
//       ) : error ? (
//         <p>Error loading invitations</p>  // Show error message
//       ) : data && data.length > 0 ? (
//         <table className="min-w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-blue-50 text-gray-700">
//               <th className="border px-4 py-2">#</th>
//               <th className="border px-4 py-2">Event Name</th>
//               <th className="border px-4 py-2">Event Date</th>
//               <th className="border px-4 py-2">Place</th>
//               <th className="border px-4 py-2">Owner 1</th>
//               <th className="border px-4 py-2">Owner 2</th>
//               <th className="border px-4 py-2">Template</th>
//               {/* <th className="border px-4 py-2">RSVP</th> */}
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((invitation, index) => (
//               <tr key={invitation.id} className="hover:bg-gray-50 transition">
//                 <td className="border px-4 py-2">{index + 1}</td>
//                 <td className="border px-4 py-2 font-medium">{invitation.name}</td>
//                 <td className="border px-4 py-2">{formatDate(invitation.acara)}</td>
//                 <td className="border px-4 py-2">{invitation.place}</td>
//                 <td className="border px-4 py-2">{invitation.owner_1}</td>
//                 <td className="border px-4 py-2">{invitation.owner_2}</td>
//                 <td className="border px-4 py-2">{invitation.template?.title}</td>
//                 {/* <td className="border px-4 py-2">{invitation.rsvp}</td> */}
//                 <td className="border px-4 py-2 relative">
                 
//                   {/* Actions: Edit, View, Delete */}
//                   <div className="relative">
//                     <button
//                     className="text-lg font-bold px-2 py-1 hover:bg-gray-200 rounded-full"
//                     onClick={() => toggleDropdown(invitation.id)} // Toggle dropdown
//                   >
//                     ⋮
//                   </button>
                    
                   
//                   {/* Dropdown content */}
//                   {dropdownOpen === invitation.id && (
//                     <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40">
//                       <button
//                         onClick={() => handleEditInvitation(invitation)}
//                         className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
//                       >
//                         <FiEdit className="mr-2" /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleViewDetails(invitation)}
//                         className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
//                       >
//                         <FiEye className="mr-2" /> View Details
//                       </button>
//                       <button
//                         onClick={() => handleDeleteInvitation(invitation.id)}
//                         className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                       >
//                         <FiTrash2 className="mr-2" /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <div>No invitations available</div>  // Empty state if no data is fetched
//       )}

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 p-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//           >
//             Prev
//           </button>
//           <span>
//             {currentPage} of {pagination.totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageInvite;









import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import useInvitations from "../../../api/invitations/useInvitations";
import useProjects from "../../../api/projects/useProjects";
import useTemplates from "../../../api/templates/useTemplates";
import { toast } from "react-toastify";

const ManageInvite = () => {
  const {
    data: invitations,
    loading,
    error,
    pagination,
    getList,
    remove,
  } = useInvitations();
  const { data: projects, getList: getProjects } = useProjects();
  const { data: templates, getList: getTemplates } = useTemplates();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [mergedData, setMergedData] = useState([]);

  const navigate = useNavigate();
  const handleEdit = (inv) => {
    // Coba ambil project_id dari field langsung, fallback ke inv.project.id
    const projectId = inv.project_id || inv.project?.id;
    if (!projectId) {
      console.error("project_id tidak ada!");
      return;
    }
    // Route /invitations/edit/:id menggunakan project_id sebagai :id
    navigate(`/invitations/edit/${inv.project_id}`);
  };

  const handleView = (inv) => {
    if (!inv.id) {
      console.error("inv_id tidak ada untuk view!");
      return;
    }
    // Route /preview/:invId
    navigate(`/preview/${inv.id}`);
  };

  // fetch invitations + projects + templates
  useEffect(() => {
    getList({
      page: currentPage,
      limit: rowsPerPage,
      search,
      filterStatus,
    });
    getProjects({ limit: 100 });
    getTemplates({ limit: 100 });
  }, [getList, getProjects, getTemplates, currentPage, search, filterStatus]);

  // merge data when all ready
  useEffect(() => {
    if (invitations?.length && projects?.length && templates?.length) {
      const mapped = invitations.map((inv) => {
        const project = projects.find((p) => p.id === inv.project_id);
        const template = templates.find((t) => t.id === project?.template_id);
        return {
          ...inv,
          project,
          template,
        };
      });
      setMergedData(mapped);
    }
  }, [invitations, projects, templates]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteInvitation = async (id) => {
    try {
      await remove(id);
      getList({ page: currentPage, limit: rowsPerPage });
    } catch (err) {
      console.error("Error deleting invitation:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-xl rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
        📜 Manage Invitations
      </h2>
      <p className="text-gray-500 mb-8 text-sm">
        Semua undangan pengguna bisa lo kelola di sini.
      </p>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan judul atau user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-xl flex-1 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
        >
          <option value="">📌 Semua Status</option>
          <option value="active">✅ Aktif</option>
          <option value="inactive">🔴 Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-6 text-center text-red-500">
            Error loading invitations
          </p>
        ) : mergedData.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Event Name</th>
                <th className="px-4 py-3 font-semibold">Event Date</th>
                <th className="px-4 py-3 font-semibold">Place</th>
                <th className="px-4 py-3 font-semibold">Owner 1</th>
                <th className="px-4 py-3 font-semibold">Owner 2</th>
                <th className="px-4 py-3 font-semibold">Template</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mergedData.map((inv, index) => (
                <tr
                  key={inv.id}
                  className="border-t hover:bg-purple-50/40 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {inv.name}
                  </td>
                  <td className="px-4 py-3">{formatDate(inv.acara)}</td>
                  <td className="px-4 py-3">{inv.place}</td>
                  <td className="px-4 py-3">{inv.owner_1}</td>
                  <td className="px-4 py-3">{inv.owner_2}</td>
                  <td className="px-4 py-3">{inv.template?.title || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <button
                      onClick={() => handleEdit(inv)}
                      className="px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-100 flex items-center gap-1 text-sm transition">
                        <FiEdit /> Edit
                      </button>
                      
                      <button
                      onClick={() => handleView(inv)} className="px-3 py-1.5 rounded-lg text-green-600 hover:bg-green-100 flex items-center gap-1 text-sm transition">
                        <FiEye /> View
                      </button>
                      <button
                        onClick={() => handleDeleteInvitation(inv.id)}
                        className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-100 flex items-center gap-1 text-sm transition"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            🚫 Tidak ada undangan tersedia
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageInvite;

