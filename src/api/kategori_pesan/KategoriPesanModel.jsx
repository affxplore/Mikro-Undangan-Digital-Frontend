export function fromBackend(kategori = {}) {
  return {
    id: kategori.id ?? null,
    name: kategori.nama_kategori ?? "",
    createdAt: kategori.createdAt ?? kategori.created_at ?? null,
    updatedAt: kategori.updatedAt ?? kategori.updated_at ?? null,
  };
}

export function toBackend(kategori = {}) {
  const payload = {
    nama_kategori: kategori.name ?? kategori.nama_kategori,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );
}
