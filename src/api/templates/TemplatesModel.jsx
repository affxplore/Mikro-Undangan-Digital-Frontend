const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";
import { buildHTML } from '../../utils/InvitationBuilder';

export function fromBackend(t) {
  console.log("🔧 [TemplatesModel] Input data:", t);
  console.log("🔧 [TemplatesModel] Raw fields: ", {
    previewUrl: t.previewUrl,
    thumbnail_image: t.thumbnail_image,
    thumbnail_file: t.thumbnail_file,
    fileUrl: t.fileUrl,
  });
  
  // Build proper public URLs for preview/file fields.
  // DB may contain paths like '/uploads/...', backend serves static files under '/public'.
  const _relativePreview = t.previewUrl || t.thumbnail_image || t.thumbnail_file || t.fileUrl || "";

  function makePublicUrl(p) {
    if (!p) return "";
    if (p.startsWith('http')) return p;
    const rel = p.startsWith('/') ? p : `/${p}`;
    if (rel.startsWith('/public')) {
      return `${SERVER_URL}${rel}`;
    }
    if (rel.startsWith('/uploads') || rel.startsWith('/assets')) {
      return `${SERVER_URL}/public${rel}`;
    }
    return `${SERVER_URL}${rel}`;
  }

  const result = {
    id: t.id,
    title: t.title,
    label: t.label,
    category: t.category,
    description: t.description,
    category_id: t.category_id,

    // ✅ Backend sudah mengirim full URL via buildPublicUrl()
    previewUrl: makePublicUrl(_relativePreview),
    fileUrl: makePublicUrl(t.fileUrl || t.thumbnail_file || _relativePreview),

    template_data: t.template_data || null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
  
  console.log("🔧 [TemplatesModel] Mapped data:", result);
  return result;
}

// Normalizes frontend -> backend (FormData)
// export function toBackend(templateData) {
//   const formData = new FormData();

// formData.append('title', templateData.title);
//   formData.append('category_id', templateData.category_id);
//   if (templateData.label) formData.append('label', templateData.label);
//   if (templateData.description) formData.append('description', templateData.description);

//   // Lampirkan file (bisa jadi file gambar atau file JSON virtual)
//   // Ini adalah kunci utamanya.
//   if (templateData.thumbnail_file instanceof File) {
//     formData.append('thumbnail_file', templateData.thumbnail_file);
//   }

//   return formData;
// }

export function toBackend(templateData) {
  console.log("📤 [TemplatesModel] toBackend input:", templateData);
  console.log("📤 [TemplatesModel] Input type:", templateData.constructor.name);
  
  // ✅ PERBAIKAN: Cek apakah input sudah FormData atau masih object biasa
  if (templateData instanceof FormData) {
    console.log("📤 [TemplatesModel] Input is already FormData, returning as-is");
    console.log("📤 [TemplatesModel] FormData keys:", Array.from(templateData.keys()));
    return templateData;
  }
  
  // Jika input adalah object biasa, proses seperti biasa
  const formData = new FormData();
  
  // Wajib diisi
  formData.append("title", templateData.title);
  formData.append("category_id", templateData.category_id);
  console.log("📤 [TemplatesModel] Added title:", templateData.title);
  console.log("📤 [TemplatesModel] Added category_id:", templateData.category_id);
  
  // Opsional
  if (templateData.label) {
    formData.append("label", templateData.label);
    console.log("📤 [TemplatesModel] Added label:", templateData.label);
  }
  if (templateData.description) {
    formData.append("description", templateData.description);
    console.log("📤 [TemplatesModel] Added description:", templateData.description);
  }

  // Handle template data dari editor
  if (templateData.template_data) {
    console.log("📤 [TemplatesModel] Processing template_data:", templateData.template_data);
    
    // Simpan seluruh data template sebagai JSON file
    const templateJson = JSON.stringify(templateData.template_data);
    const jsonBlob = new Blob([templateJson], { type: 'application/json' });
    formData.append("thumbnail_file", jsonBlob, "template.json");
    console.log("📤 [TemplatesModel] Added template JSON file");

    // Generate preview HTML dari halaman pertama
    if (templateData.template_data.pages && templateData.template_data.pages.length > 0) {
      const firstPage = templateData.template_data.pages[0];
      const htmlContent = buildHTML([firstPage]);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      formData.append("thumbnail_image", htmlBlob, "preview.html");
      console.log("📤 [TemplatesModel] Added preview HTML file");
    }
  } 
  // Handle upload file langsung
  else {
    if (templateData.thumbnail_file instanceof File) {
      formData.append("thumbnail_file", templateData.thumbnail_file);
      console.log("📤 [TemplatesModel] Added thumbnail_file:", templateData.thumbnail_file.name);
    }
    if (templateData.thumbnail_image instanceof File) {
      formData.append("thumbnail_image", templateData.thumbnail_image);
      console.log("📤 [TemplatesModel] Added thumbnail_image:", templateData.thumbnail_image.name);
    }
  }

  console.log("📤 [TemplatesModel] Final FormData keys:", Array.from(formData.keys()));
  return formData;
}
