Mikro-Undangan – Catatan Pengembangan API (Sementara)

Tujuan
- Menjelaskan kontrak data minimum yang saat ini dipakai halaman Invitations dan EditInvitation.
- Menjelaskan fallback localStorage untuk fitur yang backend‑nya belum tersedia.

Endpoint yang dipakai
- GET `/invitations`
  - Query: `page`, `limit`, `filter` (JSON string: `{ search, category_id }`)
  - Response: `{ data: Invitation[], pagination: { currentPage, totalPages, totalRows, limit } }`
  - Catatan: Data dimapping di `src/api/invitations/InvitationsModel.jsx#fromBackend`.

- GET `/invitations/:id`
  - Response: `{ data: Invitation }` → dimapping via `fromBackend`.

- POST `/invitations/create-full`
  - Body: hasil `toBackend(invitationData)` (object JSON, bukan FormData).

- DELETE `/invitations/:id`

- GET `/projects/:id`
  - Response: `{ data: { id, template_id, project_data, ... } }`
  - project_data boleh string JSON atau objek. Di‐parse di `src/api/projects/ProjectsModel.jsx#fromBackend`.

- PUT `/projects/:id`
  - Body: hasil `toBackend({ project_data })` → `{ project_data: "<stringified JSON>", template_id? }`
  - Minimal: hanya `project_data` sudah cukup untuk update konten editor.

Fallback localStorage
- Key: `invstudio.project.v1`
- Dipakai di `EditInvitation.jsx` ketika:
  - Gagal GET `/projects/:id` → pakai localStorage, kalau kosong pakai `INITIAL_PROJECT`.
  - Gagal PUT `/projects/:id` (Save) → simpan ke localStorage sebagai fallback.

Kontrak `project_data` untuk Editor
- Bentuk:
  ```json
  {
    "pages": [
      {
        "id": "page-xxx",
        "name": "Halaman 1",
        "card": { "bgType": "solid|gradient|image", "gradient": {"from":"#","to":"#"}, "color": "#ffffff", "bgImage": null, "pattern": "none|dots|grid", "radius": 28, "padding": 32 },
        "music": { "src": null, "autoplay": false, "loop": true, "volume": 0.4 },
        "elements": [ { "id": "text-...", "type": "text|hero|couple|countdown|events|invitation|donation", "x": 0, "y": 0, "w": 100, "h": 50, "data": { /* spesifik tipe */ } } ]
      }
    ]
  }
  ```

Catatan Implementasi Frontend
- Hook `useProjects` sudah ditambah method `getById` dan `update` yang meng‐stringify `project_data` (lihat `ProjectsModel.toBackend`).
- `EditInvitation.jsx`:
  - Memakai `getById` untuk load project (fallback ke localStorage/INITIAL_PROJECT jika gagal).
  - Tombol Save mencoba `update`, jika gagal → simpan ke localStorage.
  - Topbar editor dipisah ke komponen lokal `src/pages/user/invitations/components/EditorTopbar.jsx` agar file lebih ringkas.
- `Invitations.jsx`:
  - Item list undangan dipisah ke komponen `src/pages/user/invitations/components/InvitationCard.jsx` agar lebih mudah dibaca.

Saran Backend (Next)
- Pastikan `/projects/:id` mengembalikan `project_data` sebagai string JSON valid (atau objek) secara konsisten.
- Tambahkan endpoint untuk simpan partial atau autosave bila diperlukan.
- Pertimbangkan field versioning untuk `project_data` agar migrasi skema aman.

Kontak
- Jika ada perubahan kontrak API, update juga `ProjectsModel.jsx` dan `InvitationsModel.jsx` agar mapping tetap konsisten.

