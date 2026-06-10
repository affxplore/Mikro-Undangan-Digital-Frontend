const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";
import { buildHTML } from '../../utils/InvitationBuilder';

export function fromBackend(t) {
  if (!t) return null;

  // Build proper public URLs for preview/file fields.
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

  return {
    id: t.id,
    title: t.title,
    label: t.label,
    category: t.category,
    description: t.description,
    category_id: t.category_id,
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

  return formData;
}
