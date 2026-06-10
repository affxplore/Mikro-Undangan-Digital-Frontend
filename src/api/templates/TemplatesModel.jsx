const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";
import { buildHTML } from '../../utils/InvitationBuilder';

export function fromBackend(t) {
<<<<<<< HEAD
  if (!t) return null;

  // Build proper public URLs for preview/file fields.
=======
  console.log("🔧 [TemplatesModel] Input data:", t);
  console.log("🔧 [TemplatesModel] Raw fields: ", {
    previewUrl: t.previewUrl,
    thumbnail_image: t.thumbnail_image,
    thumbnail_file: t.thumbnail_file,
    fileUrl: t.fileUrl,
  });
  
  // Build proper public URLs for preview/file fields.
  // DB may contain paths like '/uploads/...', backend serves static files under '/public'.
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
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

<<<<<<< HEAD
  return {
=======
  const result = {
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    id: t.id,
    title: t.title,
    label: t.label,
    category: t.category,
    description: t.description,
    category_id: t.category_id,
<<<<<<< HEAD
    template_data: t.schema? (typeof t.schema === 'string' ? JSON.parse(t.schema) : t.schema) : null,
    previewUrl: makePublicUrl(_relativePreview),
    fileUrl: makePublicUrl(t.fileUrl || t.thumbnail_file || _relativePreview),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

/**
 * FIX BUG #5b: fungsi toBackend ditulis ulang — sebelumnya kurung kurawal tidak seimbang
 * menyebabkan label, description, dll. masuk ke dalam blok if(template_data) yang salah
 */
export function toBackend(templateData) {
  // Jika input sudah FormData, kembalikan langsung
  if (templateData instanceof FormData) {
    return templateData;
  }

  const formData = new FormData();

  // Field wajib
  if (templateData.title) formData.append("title", templateData.title);
  if (templateData.category_id) formData.append("category_id", String(templateData.category_id));

  // Field opsional — SELALU diproses, tidak bergantung pada template_data
  if (templateData.label) formData.append("label", templateData.label);
  if (templateData.description) formData.append("description", templateData.description);

  // Data desain dari editor studio
  if (templateData.template_data) {
    const designString = JSON.stringify(templateData.template_data);

    // Kirim sebagai string untuk kolom 'schema' di DB
    formData.append("schema", designString);

    // Buat file JSON untuk disimpan di disk (sebagai thumbnail_file)
    const jsonBlob = new Blob([designString], { type: 'application/json' });
    formData.append("thumbnail_file", jsonBlob, "template.json");

    // Generate preview HTML dari halaman pertama
    if (templateData.template_data.pages?.length > 0) {
      try {
        const firstPage = templateData.template_data.pages[0];
        const htmlContent = buildHTML([firstPage]);
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        formData.append("thumbnail_image", htmlBlob, "preview.html");
      } catch (e) {
        console.warn("[TemplatesModel] Gagal generate HTML preview:", e);
      }
    }
  } else {
    // Upload file langsung (bukan dari editor studio)
    if (templateData.thumbnail_file instanceof File) {
      formData.append("thumbnail_file", templateData.thumbnail_file);
    }
    if (templateData.thumbnail_image instanceof File) {
      formData.append("thumbnail_image", templateData.thumbnail_image);
    }
  }

=======

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
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  return formData;
}
