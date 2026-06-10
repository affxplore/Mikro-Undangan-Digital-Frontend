// Mapping dari Backend -> Frontend

<<<<<<< HEAD
export const fromBackend = (data) => ({
  id: data.id,
  title: data.SystemMessage?.title || "Tanpa Judul",
  content: data.SystemMessage?.content || "",
  type: data.SystemMessage?.type || "info", // backend kasih "type"
  createdAt: data.createdAt ? new Date(data.createdAt) : null,
  read: data.is_read ?? false, // backend kasih is_read
=======
// userNotificationModel.jsx
export const fromBackend = (data) => ({
  id: data.id,
  // Sesuaikan dengan alias 'systemMessage' (s kecil) dari backend
  title: data.systemMessage?.title || "Tanpa Judul", 
  content: data.systemMessage?.content || "",
  type: data.systemMessage?.type || "info", 
  createdAt: data.createdAt ? new Date(data.createdAt) : null,
  read: data.is_read ?? false,
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
});

// Mapping dari Frontend -> Backend
export const toBackend = (data) => ({
  title: data.title,
  content: data.content,
  type: data.type,
  read: data.read,
});
