// Mapping dari Backend -> Frontend

// userNotificationModel.jsx
export const fromBackend = (data) => ({
  id: data.id,
  // Sesuaikan dengan alias 'systemMessage' (s kecil) dari backend
  title: data.systemMessage?.title || "Tanpa Judul", 
  content: data.systemMessage?.content || "",
  type: data.systemMessage?.type || "info", 
  createdAt: data.createdAt ? new Date(data.createdAt) : null,
  read: data.is_read ?? false,
});

// Mapping dari Frontend -> Backend
export const toBackend = (data) => ({
  title: data.title,
  content: data.content,
  type: data.type,
  read: data.read,
});
