// Mapping dari Backend -> Frontend

export const fromBackend = (data) => ({
  id: data.id,
  title: data.SystemMessage?.title || "Tanpa Judul",
  content: data.SystemMessage?.content || "",
  type: data.SystemMessage?.type || "info", // backend kasih "type"
  createdAt: data.createdAt ? new Date(data.createdAt) : null,
  read: data.is_read ?? false, // backend kasih is_read
});

// Mapping dari Frontend -> Backend
export const toBackend = (data) => ({
  title: data.title,
  content: data.content,
  type: data.type,
  read: data.read,
});
