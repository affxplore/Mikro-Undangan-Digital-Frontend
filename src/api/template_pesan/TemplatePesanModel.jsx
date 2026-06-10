export function fromBackend(template = {}) {
  return {
    id: template.id ?? null,
    categoryId:
      template.kategori_pesan_id ?? template.kategori_pesan?.id ?? null,
    name: template.nama_template ?? "",
    content: template.isi_pesan ?? "",
    category: template.kategori_pesan
      ? {
          id: template.kategori_pesan.id,
          name: template.kategori_pesan.nama_kategori,
        }
      : null,
    createdAt: template.createdAt ?? template.created_at ?? null,
    updatedAt: template.updatedAt ?? template.updated_at ?? null,
  };
}

export function toBackend(template = {}) {
  const payload = {
    kategori_pesan_id:
      template.categoryId ?? template.kategori_pesan_id ?? undefined,
    nama_template: template.name ?? template.nama_template,
    isi_pesan: template.content ?? template.isi_pesan,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );
}
