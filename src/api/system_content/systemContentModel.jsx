// export function fromBackend(c) {
//   return {
//     id: c.id,
//     key: c.key,
//     title: c.title,
//     type: c.type,
//     isActive: c.active ?? c.isActive ?? (c.status === 'active'),
//     content: c.content,
//     config: c.config,
//     updatedAt: c.updatedAt || c.updated_at || null,
//   };
// }

// export function toBackend(c) {
//   // System content does not upload files; send JSON body
//   return {
//     key: c.key,
//     title: c.title,
//     type: c.type,
//     active: c.active ?? c.isActive ?? (c.status === 'active'),
//     content: c.content,
//     config: c.config,
//   };
// }

// src/api/system-content/systemContentModel.jsx

export function fromBackend(c) {
  return {
    id: c.id,
    key: c.key,
    title: c.title,
    type: c.type,
    isActive: c.isActive, // Langsung gunakan field dari backend
    content: c.content,
    config: c.config,
    createdAt: c.createdAt || c.created_at || null,
    updatedAt: c.updatedAt || c.updated_at || null,
  };
}

export function toBackend(c) {
  // Hanya kirim field yang bisa diubah oleh pengguna
  return {
    key: c.key,
    title: c.title,
    type: c.type,
    isActive: c.isActive,
    content: c.content,
    config: JSON.stringify(c.config || {}), // Ubah objek config menjadi string JSON
  };
}