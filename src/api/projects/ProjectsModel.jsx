/**
 * Mengubah data DARI backend KE format frontend.
 * Fungsi ini akan mem-parsing string project_data menjadi objek.
 * @param {object} p - Data project mentah dari API.
 */
export function fromBackend(p) {
  let parsedData = {};
  try {
    // Coba parsing string JSON menjadi objek
    if (typeof p.project_data === 'string') {
      parsedData = JSON.parse(p.project_data);
    } else {
      parsedData = p.project_data; // Gunakan langsung jika sudah berupa objek
    }
  } catch (error) {
    console.error("Gagal mem-parsing project_data JSON:", error);
    parsedData = { error: "Invalid JSON format" }; // Fallback jika JSON tidak valid
  }

  return {
    id: p.id,
    template_id: p.template_id,
    project_data: parsedData, // Sekarang ini adalah objek, bukan string
    creator: p.creator,
    updater: p.updater,
    template: p.template,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    invitation: p.invitation ?? null,
    invitation_id: p.invitation_id ?? p.invitationId ?? p.invitation?.id ?? null,
    with_branding: p.with_branding ?? p.invitation?.with_branding ?? p.invitation?.withBranding ?? null,
    showBranding: p.showBranding ?? p.invitation?.showBranding ?? null,
  };
}

/**
 * Mengubah data DARI frontend KE format payload untuk backend.
 * Fungsi ini akan mengubah objek project_data menjadi string JSON.
 * @param {object} projectData - Data project dari form atau state React.
 */
export function toBackend(projectData) {
  const payload = {
    template_id: projectData.template_id,
    // Pastikan project_data dikirim sebagai string JSON
    project_data: JSON.stringify(projectData.project_data || {}),
  };
  return payload;
}