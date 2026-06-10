// export function fromBackend(u = {}) {
//   return {
//     id: u.id ?? null,
//     invitation_id: u.invitation_id ?? null,
//     invitation: u.invitation ?? null,
//     guest_name: u.guest_name ?? "",
//     notes: u.notes ?? "",
//     attendance_status: u.attendance_status ,
//     created_at: u.created_at ?? null,
//   };
// }

// export function toBackend(u = {}) {
//   return {
//     ...(u.invitation_id && { invitation_id: u.invitation_id }),
//     ...(u.invitation && { invitation: u.invitation }),
//     ...(u.guest_name && { guest_name: u.guest_name }),
//     ...(u.notes && { notes: u.notes }),
//     ...(u.attendance_status && { attendance_status: u.attendance_status }),
//   };
// }

// src/api/ucapanTamu/UcapanTamuModels.jsx

/**
 * Mengubah data DARI backend KE format yang mudah digunakan di frontend.
 * @param {object} u - Objek ucapan tamu dari API backend.
 */
export function fromBackend(u = {}) {
  return {
    id: u.id ?? null,
    invitation_id: u.invitation_id ?? null,
    // Menampilkan nama undangan jika datanya ada (hasil include dari backend)
    invitation_name: u.invitation?.name ?? 'N/A',
    guest_name: u.guest_name ?? "",
    notes: u.notes ?? "",
    attendance_status: u.attendance_status ?? "tidak hadir", // Memberi nilai default
    created_at: u.created_at ?? u.createdAt ?? null, // Backend mungkin mengirim createdAt
  };
}

/**
 * Mengubah data DARI frontend KE format payload untuk backend.
 * @param {object} u - Objek ucapan tamu dari state atau form React.
 */
export function toBackend(u = {}) {
  // Hanya kirim field yang relevan untuk create/update
  // Backend akan menolak field yang tidak dikenal
  const payload = {
    guest_name: u.guest_name,
    notes: u.notes,
    attendance_status: u.attendance_status,
  };

  // invitation_id hanya diperlukan saat membuat data baru
  if (u.invitation_id) {
    payload.invitation_id = u.invitation_id;
  }

  return payload;
}