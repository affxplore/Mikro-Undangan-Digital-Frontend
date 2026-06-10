
// Mengubah data DARI backend KE format frontend
export function fromBackend(i) {
  let projectData = {};
  try {
    // Parsing project_data jika ada dan berupa string
    if (i.project && typeof i.project.project_data === 'string') {
      projectData = JSON.parse(i.project.project_data);
    } else if (i.project) {
      projectData = i.project.project_data;
    }
  } catch (e) {
    console.error("Gagal parsing project_data:", e);
  }

  return {
    id: i.id,
    name: i.name,
    acara: i.acara,
    place: i.place,
    owner_1: i.owner_1,
    owner_2: i.owner_2,
    status: i.status,
    with_branding: i.with_branding, 
    showBranding: i.showBranding,
    project_id: i.project?.id, 
    
    project: {
      id: i.project?.id,
      template: i.project?.template,
      data: projectData,
    },
    createdAt: i.createdAt,
  };
}

// Mengubah data DARI frontend KE format payload backend (objek JSON)
export function toBackend(invitationData) {
  // Menghasilkan objek JavaScript biasa, bukan FormData
  const payload = {
    name: invitationData.name,
    status: invitationData.status,
    acara: invitationData.acara,
    place: invitationData.place,
    owner_1: invitationData.owner_1,
    owner_2: invitationData.owner_2,
    no_hp: invitationData.no_hp,
    template_id: invitationData.template_id, // Untuk endpoint create-full
    // Properti lain yang mungkin diperlukan oleh endpoint Anda
    project_data: invitationData.project_data, // <--- TAMBAHKAN INI
  };
   Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  
  return payload;
}






