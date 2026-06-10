// src/utils/InvitationBuilder.jsx
import React from 'react';

export const CANVAS = { width: 900, height: 1600 };
const Fonts = {
  inter:
    "Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
  serif: "ui-serif,Georgia,Cambria,Times New Roman,Times,serif",
  mono: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
};
// Live countdown component used in REGISTRY.Render
function CountdownRender({ targetISO, label }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(targetISO).getTime();
  const diff = Math.max(0, target - now);
  const total = Math.floor(diff / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const z = (n) => String(n).padStart(2, '0');
  const Box = (n, t) => (
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
      <div className="text-2xl font-extrabold tabular-nums">{n}</div>
      <div className="text-[10px] text-gray-500">{t}</div>
    </div>
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white/70 p-4 shadow-lg ring-1 ring-black/5">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="mt-2 grid w-full max-w-md grid-cols-4 gap-2">
        {Box(d, 'Hari')}
        {Box(z(h), 'Jam')}
        {Box(z(m), 'Menit')}
        {Box(z(s), 'Detik')}
      </div>
    </div>
  );
}

export const ALL_REGISTRY = {
  text: {
    label: "Text",
    category: "small", 
    minSize: { w: 120, h: 40 },
    defaultData: {
      text: "Teks baru",
      fontFamily: Fonts.inter,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 0,
      color: "#0f172a", 
      align: "left",
      uppercase: false,
      whiteSpace: "pre-wrap",
    },
    schema: [
      { type: 'text', path: 'text', label: 'Text Content' },
      { type: 'select', path: 'fontFamily', label: 'Font', options: [
        { value: Fonts.inter, label: 'Sans Serif' },
        { value: Fonts.serif, label: 'Serif' },
        { value: Fonts.mono, label: 'Monospace' }
      ]},
      { type: 'number', path: 'fontSize', label: 'Size', min: 8, max: 120, step: 1, suffix: 'px' },
      { type: 'select', path: 'fontWeight', label: 'Weight', options: [
        { value: 400, label: 'Regular' },
        { value: 500, label: 'Medium' },
        { value: 600, label: 'SemiBold' },
        { value: 700, label: 'Bold' },
        { value: 800, label: 'ExtraBold' }
      ]},
      { type: 'number', path: 'letterSpacing', label: 'Letter Spacing', min: -10, max: 30, step: 0.1, suffix: 'px' },
      { type: 'color', path: 'color', label: 'Color' },
      { type: 'select', path: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' }, 
        { value: 'right', label: 'Right' }
      ]},
      { type: 'toggle', path: 'uppercase', label: 'All Caps' },
      { type: 'select', path: 'whiteSpace', label: 'Text Wrap', options: [
        { value: 'pre-wrap', label: 'Wrap' },
        { value: 'nowrap', label: 'Single Line' }
      ]}
    ],
    Render: ({ el, editing, updateInline }) => (
      <div
        contentEditable={editing}
        suppressContentEditableWarning
        className="h-full w-full outline-none"
        style={{
          fontFamily: el.data.fontFamily,
          fontSize: el.data.fontSize,
          fontWeight: el.data.fontWeight,
          letterSpacing: el.data.letterSpacing,
          color: el.data.color,
          textTransform: el.data.uppercase ? "uppercase" : "none",
          textAlign: el.data.align,
          lineHeight: 1.25,
          userSelect: editing ? "text" : "none",
          whiteSpace: el.data.whiteSpace,
        }}
        onInput={(e) =>
          editing &&
          updateInline({
            data: { ...el.data, text: e.currentTarget.textContent || "" },
          })
        }
      >
        {el.data.text}
      </div>
    ),
    html: (el) =>
      `<div style="font-family:${el.data.fontFamily};font-size:${
        el.data.fontSize
      }px;font-weight:${el.data.fontWeight};letter-spacing:${
        el.data.letterSpacing
      }px;color:${el.data.color};text-transform:${
        el.data.uppercase ? "uppercase" : "none"
      };text-align:${el.data.align};line-height:1.25;white-space:${
        el.data.whiteSpace
      }">${escapeHtml(el.data.text)}</div>`,
  },
  image: {
    label: "Image",
    category: "small",
    minSize: { w: 160, h: 110 },
    defaultData: { src: null, radius: 24, shadow: true, fit: "cover" },
    schema: [
      { type: 'image', path: 'src', label: 'Upload Image' },
      { type: 'number', path: 'radius', label: 'Corner Radius', min: 0, max: 100, step: 1, suffix: 'px' },
      { type: 'toggle', path: 'shadow', label: 'Show Shadow' },
      { type: 'select', path: 'fit', label: 'Image Fit', options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' }
      ]}
    ],
    Render: ({ el }) => (
      <div
        className="h-full w-full overflow-hidden bg-white/40 backdrop-blur-sm"
        style={{
          borderRadius: el.data.radius,
          boxShadow: el.data.shadow ? "0 12px 30px rgba(2,6,23,0.18)" : "none",
        }}
      >
        {el.data.src ? (
          <img
            src={el.data.src}
            alt="img"
            className="h-full w-full"
            style={{ objectFit: el.data.fit }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            Upload gambar
          </div>
        )}
      </div>
    ),
    html: (el) =>
      `<div style="overflow:hidden;border-radius:${el.data.radius}px;${ 
        el.data.shadow
          ? "box-shadow:0 12px 30px rgba(2,6,23,0.18);background:rgba(255,255,255,.4);backdrop-filter:saturate(1.2) blur(2px);"
          : ""
      }"><img src="${ 
        el.data.src || "data:image/svg+xml;base64,PHN2Zy8+" 
      }" style="width:100%;height:100%;object-fit:${ 
        el.data.fit
      };display:block"/></div>`,
  },
  hero: {
    label: "Hero",
    category: "large",
    minSize: { w: 640, h: 300 },
    defaultData: {
      title: "Ayu & Bima",
      subtitle: "The Wedding of",
      color: "#0f172a",
      align: "center",
      bgImage: null,
      overlay: true,
    },
    schema: [
      { type: 'text', path: 'title', label: 'Title' },
      { type: 'text', path: 'subtitle', label: 'Subtitle' }, 
      { type: 'color', path: 'color', label: 'Text Color' },
      { type: 'select', path: 'align', label: 'Alignment', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]},
      { type: 'image', path: 'bgImage', label: 'Background Image' },
      { type: 'toggle', path: 'overlay', label: 'Show Overlay Gradient' }
    ],
    Render: ({ el }) => (
      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
        {el.data.bgImage ? (
          <img
            src={el.data.bgImage}
            className="absolute inset-0 h-full w-full object-cover"
            alt="bg"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white" />
        )}
        {el.data.overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/10" />
        )}
        <div
          className="relative flex h-full w-full items-center justify-center px-6 text-center"
          style={{ color: el.data.color, textAlign: el.data.align }}
        >
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-700/80">
              {el.data.subtitle}
            </div>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
            <div className="mt-4 text-6xl font-extrabold leading-none">
              {el.data.title}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-indigo-200/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-pink-200/40 blur-2xl" />
      </div>
    ),
    html: (el) => {
      const bg = el.data.bgImage
        ? `<img src="${el.data.bgImage}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>`
        : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#eef2ff,#fff)"></div>`;
      const ov = el.data.overlay
        ? `<div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(255,255,255,.8), rgba(255,255,255,.4), rgba(255,255,255,.1))"></div>`
        : "";
      return `<div style="position:relative;width:100%;height:100%;border-radius:20px;overflow:hidden;box-shadow:0 16px 40px rgba(2,6,23,.12)">${bg}${ov}<div style="position:relative;display:flex;align-items:center;justify-content:center;height:100%;text-align:${
        el.data.align
      };color:${ 
        el.data.color
      }"><div><div style="letter-spacing:.3em;text-transform:uppercase;opacity:.8;font-size:12px">${escapeHtml(
        el.data.subtitle
      )}</div><div style="margin:12px auto 0;height:4px;width:64px;border-radius:9999px;background:linear-gradient(90deg,#60a5fa,#f472b6)"></div><div style="margin-top:14px;font-weight:800;font-size:64px;line-height:1">${escapeHtml(
        el.data.title
      )}</div></div></div></div>`;
    },
  },
  couple: {
    label: "Couple",
    category: "large",
    minSize: { w: 640, h: 260 },
    defaultData: {
      brideName: "Ayu",
      groomName: "Bima", 
      bridePhoto: null,
      groomPhoto: null,
      accent: "#4f46e5",
      textColor: "#374151",
    },
    schema: [
      { type: 'text', path: 'brideName', label: 'Bride Name' },
      { type: 'text', path: 'groomName', label: 'Groom Name' },
      { type: 'image', path: 'bridePhoto', label: 'Bride Photo' },
      { type: 'image', path: 'groomPhoto', label: 'Groom Photo' },
      { type: 'color', path: 'accent', label: 'Accent Color' },
      { type: 'color', path: 'textColor', label: 'Text Color' }
    ],
    Render: ({ el }) => (
      <div className="grid h-full w-full grid-cols-3 items-center gap-4 rounded-2xl bg-white/70 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        <div className="col-span-1 flex items-center justify-center">
          {el.data.bridePhoto ? (
            <img
              src={el.data.bridePhoto}
              className="h-44 w-44 rounded-full object-cover ring-4 ring-white shadow"
              alt="bride"
            />
          ) : (
            <div className="h-44 w-44 rounded-full bg-gray-100" />
          )}
        </div>
        <div className="col-span-1 text-center">
          <div className="text-3xl font-bold" style={{ color: el.data.accent }}>
            {el.data.brideName} &amp; {el.data.groomName}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: el.data.textColor }}>
            Together with their families
          </div>
          <div className="mx-auto mt-3 h-0.5 w-24 rounded bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          {el.data.groomPhoto ? (
            <img
              src={el.data.groomPhoto}
              className="h-44 w-44 rounded-full object-cover ring-4 ring-white shadow"
              alt="groom"
            />
          ) : (
            <div className="h-44 w-44 rounded-full bg-gray-100" />
          )}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;background:rgba(255,255,255,.7);border-radius:20px;padding:20px;box-shadow:0 16px 40px rgba(2,6,23,.12);backdrop-filter:saturate(1.2) blur(2px)"><div style="display:flex;align-items:center;justify-content:center">${ 
        el.data.bridePhoto
          ? `<img src="${el.data.bridePhoto}" style="width:176px;height:176px;border-radius:9999px;object-fit:cover;border:4px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.14)"/>`
          : `<div style="width:176px;height:176px;border-radius:9999px;background:#f3f4f6"></div>`
      }</div><div style="text-align:center"><div style="font-size:32px;font-weight:800;color:${ 
        el.data.accent
      }">${escapeHtml(el.data.brideName)} &amp; ${escapeHtml(
        el.data.groomName
      )}</div><div style="margin-top:4px;font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:${el.data.textColor}">Together with their families</div><div style="margin:12px auto 0;height:2px;width:96px;background:linear-gradient(90deg,#60a5fa,#f472b6);border-radius:9999px"></div></div><div style="display:flex;align-items:center;justify-content:center">${ 
        el.data.groomPhoto
          ? `<img src="${el.data.groomPhoto}" style="width:176px;height:176px;border-radius:9999px;object-fit:cover;border:4px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.14)"/>`
          : `<div style="width:176px;height:176px;border-radius:9999px;background:#f3f4f6"></div>`
      }</div></div>`,
  },
  countdown: {
    label: "Countdown",
    category: "large", 
    minSize: { w: 460, h: 160 },
    defaultData: {
      targetISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      label: "Menuju hari bahagia",
    },
    schema: [
      { type: 'text', path: 'targetISO', label: 'Target Date (ISO format)' },
      { type: 'text', path: 'label', label: 'Label Text' }
    ],
    Render: ({ el }) => (
      <CountdownRender targetISO={el.data.targetISO} label={el.data.label} />
    ),
    // NOTE: gunakan data-cd="d|h|m|s" agar script preview/HTML bisa update tiap unit
    html: (el) =>
      `<div data-countdown data-target="${ 
        el.data.targetISO
      }" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,.7);border-radius:16px;box-shadow:0 12px 30px rgba(2,6,23,.1);padding:10px"><div style="font-size:12px;color:#374151">${escapeHtml(
        el.data.label
      )}</div><div class="cd-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px"><div class="cd-box" style="padding:10px;border-radius:12px;background:#fff;border:1px solid #e5e7eb;text-align:center"><div data-cd="d" style="font-weight:800;font-size:20px">00</div><div style="font-size:10px;color:#6b7280">Hari</div></div><div class="cd-box" style="padding:10px;border-radius:12px;background:#fff;border:1px solid #e5e7eb;text-align:center"><div data-cd="h" style="font-weight:800;font-size:20px">00</div><div style="font-size:10px;color:#6b7280">Jam</div></div><div class="cd-box" style="padding:10px;border-radius:12px;background:#fff;border:1px solid #e5e7eb;text-align:center"><div data-cd="m" style="font-weight:800;font-size:20px">00</div><div style="font-size:10px;color:#6b7280">Menit</div></div><div class="cd-box" style="padding:10px;border-radius:12px;background:#fff;border:1px solid #e5e7eb;text-align:center"><div data-cd="s" style="font-weight:800;font-size:20px">00</div><div style="font-size:10px;color:#6b7280">Detik</div></div></div></div>`,
  },
  events: {
    label: "Events",
    category: "large",
    minSize: { w: 600, h: 240 },
    defaultData: {
      items: [
        { time: "10:00", title: "Akad Nikah", location: "Masjid Agung" },
        { time: "12:00", title: "Resepsi", location: "Gedung Serbaguna" },
      ],
    },
    schema: [
      {
        type: 'array',
        path: 'items',
        label: 'Event List',
        addItem: { time: "", title: "", location: "" },
        itemSchema: [
          { type: 'text', key: 'time', label: 'Time' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'location', label: 'Location' }
        ]
      }
    ],
    Render: ({ el }) => (
      <div className="h-full w-full rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-700">
          Rangkaian Acara
        </div>
        <div className="mt-3 grid gap-3">
          {el.data.items.map((it, idx) => (
            <div
              key={idx}
              className="relative grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-gray-200/70 bg-white p-4"
            >
              <div className="absolute left-[-9px] top-5 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
              <div>
                <div className="text-base font-semibold text-gray-900">
                  {it.title}
                </div>
                <div className="text-xs text-gray-600">{it.location}</div>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {it.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="background:rgba(255,255,255,.8);border-radius:16px;padding:16px;box-shadow:0 12px 30px rgba(2,6,23,.1);"><div style="font-weight:600;font-size:12px;color:#374151">Rangkaian Acara</div>${el.data.items
        .map(
          (it) =>
            `<div style="position:relative;display:grid;grid-template-columns:1fr auto;gap:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px;margin-top:12px"><div style="position:absolute;left:-9px;top:20px;width:8px;height:8px;border-radius:9999px;background:linear-gradient(90deg,#60a5fa,#f472b6)"></div><div><div style="font-weight:700;color:#111827">${escapeHtml(
              it.title
            )}</div><div style="font-size:12px;color:#6b7280">${escapeHtml(
              it.location
            )}</div></div><div style="font-weight:700;color:#374151">${escapeHtml(
              it.time
            )}</div></div>`
        )
        .join("")}
      </div>`,
  },
  qna: {
    label: "Q&A",
    category: "large",
    minSize: { w: 560, h: 240 },
    defaultData: {
      items: [
        { q: "Dresscode?", a: "Batik / semi-formal" },
        { q: "Bawa amplop?", a: "Boleh 😊" },
      ],
    },
    schema: [
      {
        type: 'array',
        path: 'items',
        label: 'Q&A List',
        addItem: { q: "", a: "" },
        itemSchema: [
          { type: 'text', key: 'q', label: 'Question' },
          { type: 'text', key: 'a', label: 'Answer' }
        ]
      }
    ],
    Render: ({ el }) => (
      <div className="h-full w-full rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-700">Q & A</div>
        <div className="mt-3 space-y-3">
          {el.data.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200/70 bg-white p-4"
            >
              <div className="font-semibold">{it.q}</div>
              <div className="mt-1 text-sm text-gray-600">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="background:rgba(255,255,255,.8);border-radius:16px;padding:16px;box-shadow:0 12px 30px rgba(2,6,23,.1)"><div style="font-weight:600;font-size:12px;color:#374151">Q & A</div>${el.data.items
        .map(
          (it) =>
            `<div style="border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px;margin-top:12px"><div style="font-weight:700;color:#111827">${escapeHtml(
              it.q
            )}</div><div style="font-size:14px;color:#6b7280">${escapeHtml(
              it.a
            )}</div></div>`
        )
        .join("")}
      </div>`,
  },
  invitation: {
    label: "Invitation",
    category: "large",
    minSize: { w: 560, h: 180 },
    defaultData: {
      greet: "Kepada Yth.",
      toName: "Bapak/Ibu/Saudara/i",
      body: "Dengan hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami.",
    },
    schema: [
      { type: 'text', path: 'greet', label: 'Greeting' },
      { type: 'text', path: 'toName', label: 'To Name' },
      { type: 'textarea', path: 'body', label: 'Message Body' }
    ],
    Render: ({ el }) => (
      <div className="h-full w-full rounded-2xl bg-white/70 p-6 text-center shadow-lg ring-1 ring-black/5">
        <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
          {el.data.greet}
        </div>
        <div className="mt-1 text-3xl font-extrabold">{el.data.toName}</div>
        <div className="mx-auto mt-3 h-0.5 w-24 rounded bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
        <div className="mt-3 text-sm text-gray-700">{el.data.body}</div>
      </div>
    ),
    html: (el) =>
      `<div style="text-align:center;background:rgba(255,255,255,.7);border-radius:16px;padding:18px;box-shadow:0 12px 30px rgba(2,6,23,.1)"><div style="font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:#6b7280">${escapeHtml(
        el.data.greet
      )}</div><div style="margin-top:4px;font-size:28px;font-weight:800;color:#111827">${escapeHtml(
        el.data.toName
      )}</div><div style="margin:10px auto 0;height:2px;width:96px;background:linear-gradient(90deg,#60a5fa,#f472b6);border-radius:9999px"></div><div style="margin-top:10px;font-size:14px;color:#374151">${escapeHtml(
        el.data.body
      )}</div></div>`,
  },
  comments: {
    label: "Comments",
    category: "large",
    minSize: { w: 600, h: 240 },
    defaultData: {
      items: [
        { name: "Rani", message: "Selamat yaa!" },
        { name: "Dika", message: "Sukses selalu 💐" },
      ],
    },
    schema: [
      {
        type: 'array',
        path: 'items',
        label: 'Comments List',
        addItem: { name: "", message: "" },
        itemSchema: [
          { type: 'text', key: 'name', label: 'Name' },
          { type: 'text', key: 'message', label: 'Message' }
        ]
      }
    ],
    Render: ({ el }) => (
      <div className="h-full w-full rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-700">Ucapan</div>
        <div className="mt-3 space-y-3">
          {el.data.items.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-200/70 bg-white p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {c.name?.charAt(0) || "?"}
              </div>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-700">{c.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="background:rgba(255,255,255,.8);border-radius:16px;padding:16px;box-shadow:0 12px 30px rgba(2,6,23,.1)"><div style="font-weight:600;font-size:12px;color:#374151">Ucapan</div>${el.data.items
        .map(
          (c) =>
            `<div style="display:flex;align-items:flex-start;gap:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px;margin-top:12px"><div style="width:40px;height:40px;border-radius:9999px;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-weight:700">${escapeHtml(
              (c.name || "?").charAt(0)
            )}</div><div><div style="font-weight:600;color:#111827">${escapeHtml(
              c.name
            )}</div><div style="font-size:14px;color:#111827">${escapeHtml(
              c.message
            )}</div></div></div>`
        )
        .join("")}
      </div>`,
  },
  donation: {
    label: "Donation",
    category: "large",
    minSize: { w: 560, h: 220 },
    defaultData: {
      title: "Kado Digital",
      bank: "BCA",
      accountName: "Ayu Bima",
      accountNumber: "1234567890",
      qrSrc: null,
    },
    schema: [
      { type: 'text', path: 'title', label: 'Title' },
      { type: 'text', path: 'bank', label: 'Bank Name' },
      { type: 'text', path: 'accountName', label: 'Account Name' },
      { type: 'text', path: 'accountNumber', label: 'Account Number' },
      { type: 'image', path: 'qrSrc', label: 'QR Code Image' }
    ],
    Render: ({ el }) => (
      <div className="flex h-full w-full items-center justify-between gap-5 rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-black/5">
        <div>
          <div className="text-sm font-semibold text-gray-700">
            {el.data.title}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {el.data.bank} —{" "}
            <span
              className="cursor-pointer rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-700 hover:bg-indigo-100"
              onClick={() =>
                navigator.clipboard?.writeText?.(el.data.accountNumber)
              }
              title="Klik untuk copy"
            >
              {el.data.accountNumber}
            </span>
          </div>
          <div className="text-xs text-gray-500">a.n {el.data.accountName}</div>
        </div>
        <div className="h-32 w-32 overflow-hidden rounded-xl border bg-white shadow">
          {el.data.qrSrc ? (
            <img
              src={el.data.qrSrc}
              className="h-full w-full object-cover"
              alt="qr"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              QR
            </div>
          )}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;background:rgba(255,255,255,.8);border-radius:16px;padding:16px;box-shadow:0 12px 30px rgba(2,6,23,.1)"><div><div style="font-weight:600;font-size:12px;color:#374151">${escapeHtml(
        el.data.title
      )}</div><div style="margin-top:8px;color:#374151">${escapeHtml(
        el.data.bank
      )} — <b>${escapeHtml(
        el.data.accountNumber
      )}</b></div><div style="font-size:12px;color:#6b7280">a.n ${escapeHtml(
        el.data.accountName
      )}</div></div><div style="width:128px;height:128px;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;background:#fff">${ 
        el.data.qrSrc
          ? `<img src="${el.data.qrSrc}" style="width:100%;height:100%;object-fit:cover"/>`
          : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:12px;color:#9ca3af">QR</div>`
      }</div></div>`,
  },
  location: {
    label: "Location",
    category: "large",
    minSize: { w: 600, h: 260 },
    defaultData: {
      title: "Lokasi",
      address: "Hotel Savoy Homann, Bandung",
      mapEmbedUrl: "",
    },
    schema: [
      { type: 'text', path: 'title', label: 'Title' },
      { type: 'textarea', path: 'address', label: 'Address' },
      { type: 'text', path: 'mapEmbedUrl', label: 'Map Embed URL' }
    ],
    Render: ({ el }) => (
      <div className="h-full w-full overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-black/5">
        <div className="p-4 text-sm font-semibold text-gray-700">
          {el.data.title}
        </div>
        {el.data.mapEmbedUrl ? (
          <iframe
            title="map"
            src={el.data.mapEmbedUrl}
            className="mx-4 mb-3 h-[65%] w-[calc(100%-2rem)] rounded-xl border"
            loading="lazy"
          />
        ) : (
          <div className="mx-4 mb-3 flex h-[65%] w-[calc(100%-2rem)] items-center justify-center rounded-xl border bg-gray-100 text-gray-500">
            Set embed URL peta
          </div>
        )}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-700">
          <div>{el.data.address}</div>
          {el.data.mapEmbedUrl && (
            <a
              href={el.data.mapEmbedUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Buka Maps
            </a>
          )}
        </div>
      </div>
    ),
    html: (el) =>
      `<div style="background:rgba(255,255,255,.8);border-radius:16px;overflow:hidden;box-shadow:0 12px 30px rgba(2,6,23,.1)"><div style="padding:12px;font-size:12px;font-weight:600;color:#374151">${escapeHtml(
        el.data.title
      )}</div>${ 
        el.data.mapEmbedUrl
          ? `<iframe src="${escapeHtml(
              el.data.mapEmbedUrl
            )}" style="width:calc(100% - 32px);height:65%;margin:0 16px 12px;border-radius:12px;border:1px solid #e5e7eb" loading="lazy"></iframe>`
          : `<div style="display:flex;align-items:center;justify-content:center;height:65%;margin:0 16px 12px;border-radius:12px;border:1px solid #e5e7eb;background:#f3f4f6;color:#6b7280">Set embed URL peta</div>`
      }<div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e5e7eb;padding:12px;color:#374151">${escapeHtml(
        el.data.address
      )}${ 
        el.data.mapEmbedUrl
          ? `<a href="${escapeHtml(
              el.data.mapEmbedUrl
            )}" style="background:#4f46e5;color:#fff;padding:6px 10px;border-radius:9999px;text-decoration:none;font-size:12px">Buka Maps</a>`
          : ""
      }</div></div>`,
  },
  
};
function escapeHtml(t) {
  return (t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const COVER_REGISTRY = Object.fromEntries(
  Object.entries(ALL_REGISTRY).filter(
    ([key]) => !['comments', 'qna', 'donation', 'events'].includes(key)
  )
);

export const PAGES_REGISTRY = Object.fromEntries(
  Object.entries(ALL_REGISTRY).filter(
    ([key, def]) => def.category === 'small' || def.category === 'large'
  )
);

function buildElementHTML(el) {
  const reg = ALL_REGISTRY[el.type];
  const base = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.w}px;height:${el.h}px;`;
  if (!reg || !reg.html) return `<div style="${base}">Unknown: ${escapeHtml(el.type)}</div>`;
  return `<div style="${base}">${reg.html(el)}</div>`;
}

function buildCardHTML(pg) {
  const styleBg = (function () {
    if (pg.card.bgType === "image" && pg.card.bgImage) {
      return `background-image:url('${pg.card.bgImage}');background-size:cover;background-position:center;`;
    }
    if (pg.card.bgType === "gradient") {
      return `background-image:linear-gradient(180deg, ${pg.card.gradient.from}, ${pg.card.gradient.to});`;
    }
    return `background:${pg.card.color};`;
  })();

  const patternCss =
    pg.card.pattern === "dots"
      ? `background-image:radial-gradient(${pg.snap.dotColor || 'rgba(0,0,0,0.06)'} ${pg.snap.dotSize || 1}px, transparent ${pg.snap.dotSize || 1}px);background-size:${pg.snap.dotSpacing || 12}px ${pg.snap.dotSpacing || 12}px;`
      : pg.card.pattern === "grid"
      ? `background-image:linear-gradient(to right, ${pg.snap.color || 'rgba(0,0,0,0.06)'} ${pg.snap.lineSize || 1}px, transparent ${pg.snap.lineSize || 1}px), linear-gradient(to bottom, ${pg.snap.color || 'rgba(0,0,0,0.06)'} ${pg.snap.lineSize || 1}px, transparent ${pg.snap.lineSize || 1}px);background-size:${pg.snap.size || 25}px ${pg.snap.size || 25}px;`
      : "";

  const els = pg.elements.map((el) => buildElementHTML(el)).join("");
  return `<div class="frame">
    <div class="card" style="${styleBg}">
      <div class="pad" style="padding:${pg.card.padding}px">
        <div style="position:absolute;inset:0;${patternCss}"></div>
        ${els}
      </div>
    </div>
  </div>`;
}


// Ekspor fungsi utama
export function buildHTML(pages) {
  const cards = pages.map((pg) => buildCardHTML(pg)).join("\n");
  return `<!DOCTYPE html><html lang="id"><head>
<meta charset="utf-8"/>
<title>Undangan</title>
<style>
  :root{ --card-w:${CANVAS.width}px; --card-h:${CANVAS.height}px; --s:1; }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#f5f7fb;font-family:Inter,system-ui,Arial,sans-serif;overflow-x:hidden}
  .stack{display:flex;flex-direction:column;align-items:center;gap:28px;padding:20px 0}
  /* Bingkai responsif: di-scale oleh --s (di-set via JS) */
  .frame{
    width: calc(var(--card-w) * var(--s));
    height: calc(var(--card-h) * var(--s));
    position: relative; overflow:hidden; border-radius:28px;
    box-shadow:0 10px 30px rgba(2,6,23,.08); background:#fff;
  }
  .card{
    position:absolute; inset:0;
    width:var(--card-w); height:var(--card-h);
    transform:scale(var(--s)); transform-origin:top left;
    border-radius:28px; overflow:hidden; background:#fff;
  }
  .pad{position:absolute;inset:0}
</style>
</head><body>
<div class="stack">
${cards}
</div>

<script>
// --- Fit ke lebar viewport, TANPA <meta viewport>, dan tanpa overflow horizontal ---
(function(){
  var CW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-w'));
  function fit(){
    var vw = document.documentElement.clientWidth || window.innerWidth || 980; // iOS default 980
    var s = Math.min(1, vw / CW);
    document.documentElement.style.setProperty('--s', String(s));
  }
  window.addEventListener('resize', fit, {passive:true});
  fit();
})();

// --- Countdown updater ---
(function(){
  var els=document.querySelectorAll('[data-countdown]');
  function tick(){
    els.forEach(function(e){
      var iso=e.getAttribute('data-target');
      var target=new Date(iso).getTime(), now=Date.now();
      var diff=Math.max(0,target-now), s=Math.floor(diff/1000),
          d=Math.floor(s/86400), h=Math.floor((s%86400)/3600),
          m=Math.floor((s%3600)/60), ss=s%60;
      var z=n=>('0'+n).slice(-2);
      var set=function(k,v){ var n=e.querySelector('[data-cd="'+k+'"]'); if(n) n.textContent=v; };
      set('d', d); set('h', z(h)); set('m', z(m)); set('s', z(ss));
    });
  }
  setInterval(tick,1000); tick();
})();
</script>
</body></html>`;
}