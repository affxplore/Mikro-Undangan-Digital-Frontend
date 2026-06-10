import React from "react";
import { ALL_REGISTRY, CANVAS } from "../../../../../utils/InvitationBuilder";
import AdminCoverEditor from "./AdminCoverEditor";
import { FaPlay, FaPause, FaUpload } from "react-icons/fa";

// Util & helpers (diambil dari V2 dan disederhanakan)
const deepClone = (v) => JSON.parse(JSON.stringify(v));
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const setByPath = (obj, path, value) => {
  const keys = path.split(".");
  const last = keys.pop();
  let cur = obj;
  for (const k of keys) {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[last] = value;
  return obj;
};
const getByPath = (obj, path, fallback) =>
  path
    .split(".")
    .reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), obj) ??
  fallback;

function useDebounced(fn, ms = 150) {
  const t = React.useRef();
  return React.useCallback(
    (...args) => {
      clearTimeout(t.current);
      t.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}

// Kecil-kecil UI fields
const Label = ({ children, className = "" }) => (
  <div className={`text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </div>
);
const Row = ({ children, className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>{children}</div>
);
const Field = ({ label, children }) => (
  <div className="flex w-full flex-col gap-1 text-sm">
    <span className="text-gray-600">{label}</span>
    {children}
  </div>
);
const Button = ({ className = "", type = "button", ...p }) => (
  <button
    type={type}
    {...p}
    className={`rounded border px-2.5 py-1.5 text-sm ${className}`}
  />
);
const ColorField = ({ label, value, onChange }) => (
  <Field label={label}>
    <Row>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 rounded border px-2 py-1"
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 rounded border"
      />
    </Row>
  </Field>
);

function TextFieldFast({ label, value, onChange, placeholder = "" }) {
  const [v, setV] = React.useState(value ?? "");
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (document.activeElement !== ref.current) setV(value ?? "");
  }, [value]);
  const deb = useDebounced(onChange, 120);
  return (
    <Field label={label}>
      <input
        className="w-full rounded border p-2"
        value={v}
        ref={ref}
        placeholder={placeholder}
        onChange={(e) => {
          const nv = e.target.value;
          setV(nv);
          deb(nv);
        }}
        onBlur={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function TextareaFieldFast({ label, value, onChange, placeholder = "" }) {
  const [v, setV] = React.useState(value ?? "");
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (document.activeElement !== ref.current) setV(value ?? "");
  }, [value]);
  const deb = useDebounced(onChange, 120);
  return (
    <Field label={label}>
      <textarea
        className="min-h-[72px] w-full rounded border p-2"
        value={v}
        ref={ref}
        placeholder={placeholder}
        onChange={(e) => {
          const nv = e.target.value;
          setV(nv);
          deb(nv);
        }}
        onBlur={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  scrub = true,
  className = "",
  suffix = "",
}) {
  const [str, setStr] = React.useState(String(value ?? 0));
  React.useEffect(() => setStr(String(value ?? 0)), [value]);

  const commit = React.useCallback(
    (v) => {
      let n = Number(v);
      if (Number.isNaN(n)) n = Number(value) || 0;
      n = clamp(n, min, max);
      onChange(n);
    },
    [min, max, onChange, value]
  );
  const debCommit = useDebounced(commit, 120);

  function bump(delta) {
    const mult = window.event && window.event.shiftKey ? 10 : 1;
    commit((Number(value) || 0) + delta * step * mult);
  }

  function startScrub(e) {
    if (!scrub) return;
    e.preventDefault();
    const startX = e.clientX;
    const startVal = Number(value) || 0;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const inc = Math.round(dx / 2); // 2px = 1 step
      commit(startVal + inc * step);
      document.body.style.cursor = "ew-resize";
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.body.style.cursor = "";
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
  }

  return (
    <label
      className={`flex w-full items-center justify-between gap-2 text-sm ${className}`}
    >
      <span
        onPointerDown={startScrub}
        className="select-none text-gray-600 hover:text-gray-900"
        title="Drag kiri/kanan untuk scrub"
      >
        {label}
      </span>
      <div className="flex items-stretch overflow-hidden rounded-md border">
        <button
          type="button"
          onClick={() => bump(-1)}
          className="px-2 hover:bg-gray-50 active:scale-95"
        >
          −
        </button>
        <input
          inputMode="decimal"
          className="w-24 px-2 py-1 text-right outline-none"
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            debCommit(e.target.value);
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit(str);
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              setStr(String(value));
              e.currentTarget.blur();
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              bump(+1);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              bump(-1);
            }
          }}
          onWheel={(e) => {
            if (document.activeElement !== e.currentTarget) return;
            e.preventDefault();
            bump(e.deltaY < 0 ? +1 : -1);
          }}
        />
        {suffix && <span className="px-2 py-1 text-gray-500">{suffix}</span>}
        <button
          type="button"
          onClick={() => bump(+1)}
          className="px-2 hover:bg-gray-50 active:scale-95"
        >
          +
        </button>
      </div>
    </label>
  );
}

function SliderField({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="tabular-nums text-gray-700">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// Skema editor elemen (disederhanakan dari V2)
const Fonts = {
  inter:
    "Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
  serif: "ui-serif,Georgia,Cambria,Times New Roman,Times,serif",
  mono: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
};

function schemaOf(el) {
  switch (el.type) {
    case "text":
      return [
        { type: "textarea", label: "Teks", path: "text" },
        {
          type: "select",
          label: "Font",
          path: "fontFamily",
          options: [
            { label: "Inter", value: Fonts.inter },
            { label: "Serif", value: Fonts.serif },
            { label: "Mono", value: Fonts.mono },
          ],
        },
        { type: "number", label: "Ukuran", path: "fontSize" },
        { type: "number", label: "Weight", path: "fontWeight" },
        { type: "number", label: "Letter Spc", path: "letterSpacing" },
        { type: "color", label: "Warna", path: "color" },
        {
          type: "select",
          label: "Align",
          path: "align",
          options: ["left", "center", "right"],
        },
        { type: "toggle", label: "Uppercase", path: "uppercase" },
      ];
    case "image":
      return [
        { type: "image", label: "Gambar", path: "src" },
        { type: "number", label: "Radius", path: "radius" },
        { type: "toggle", label: "Bayangan", path: "shadow" },
        {
          type: "select",
          label: "Object Fit",
          path: "fit",
          options: ["cover", "contain", "fill", "none", "scale-down"],
        },
      ];
    case "hero":
      return [
        { type: "image", label: "BG Image", path: "bgImage" },
        { type: "text", label: "Subtitle", path: "subtitle" },
        { type: "text", label: "Title", path: "title" },
        { type: "color", label: "Warna", path: "color" },
        {
          type: "select",
          label: "Align",
          path: "align",
          options: ["left", "center", "right"],
        },
        { type: "toggle", label: "Overlay", path: "overlay" },
      ];
    case "couple":
      return [
        { type: "text", label: "Nama Mempelai Wanita", path: "brideName" },
        { type: "text", label: "Nama Mempelai Pria", path: "groomName" },
        { type: "image", label: "Foto Wanita", path: "bridePhoto" },
        { type: "image", label: "Foto Pria", path: "groomPhoto" },
        { type: "color", label: "Aksen", path: "accent" },
      ];
    case "countdown":
      return [
        { type: "text", label: "Target (ISO)", path: "targetISO" },
        { type: "text", label: "Label", path: "label" },
      ];
    case "events":
      return [
        {
          type: "array",
          label: "Daftar Acara",
          path: "items",
          addItem: { time: "", title: "", location: "", description: "" },
          itemSchema: [
            { type: "text", label: "Waktu", key: "time" },
            { type: "text", label: "Judul", key: "title" },
            { type: "text", label: "Lokasi", key: "location" },
            { type: "textarea", label: "Deskripsi", key: "description" },
          ],
        },
      ];
    case "qna":
      return [
        {
          type: "array",
          label: "Q&A",
          path: "items",
          addItem: { q: "", a: "" },
          itemSchema: [
            { type: "text", label: "Pertanyaan", key: "q" },
            { type: "textarea", label: "Jawaban", key: "a" },
          ],
        },
      ];
    case "invitation":
      return [
        { type: "text", label: "Sapa", path: "greet" },
        { type: "text", label: "Kepada", path: "toName" },
        { type: "textarea", label: "Isi", path: "body" },
      ];
    case "comments":
      return [
        {
          type: "array",
          label: "Ucapan",
          path: "items",
          addItem: { name: "", message: "" },
          itemSchema: [
            { type: "text", label: "Nama", key: "name" },
            { type: "textarea", label: "Ucapan", key: "message" },
          ],
        },
      ];
    case "donation":
      return [
        { type: "text", label: "Judul", path: "title" },
        { type: "text", label: "Bank", path: "bank" },
        { type: "text", label: "No. Rekening", path: "accountNumber" },
        { type: "text", label: "Atas Nama", path: "accountName" },
        { type: "image", label: "QR Image", path: "qrSrc" },
      ];
    case "location":
      return [
        { type: "text", label: "Judul", path: "title" },
        { type: "textarea", label: "Alamat", path: "address" },
        { type: "text", label: "Map Embed URL", path: "mapEmbedUrl" },
      ];
    default:
      return [];
  }
}

function InspectorFields({ schema, el, onChange }) {
  if (!el) return null;
  const get = (p, fb) => getByPath(el.data, p, fb);

  return (
    <div className="space-y-2">
      {schema.map((f, idx) => {
        const key = `${el.id}:${f.path}:${idx}`;
        if (f.type === "text") {
          return (
            <TextFieldFast
              key={key}
              label={f.label}
              value={get(f.path, "")}
              onChange={(v) => onChange(f.path, v)}
            />
          );
        }
        if (f.type === "textarea") {
          return (
            <TextareaFieldFast
              key={key}
              label={f.label}
              value={get(f.path, "")}
              onChange={(v) => onChange(f.path, v)}
            />
          );
        }
        if (f.type === "number") {
          return (
            <NumberField
              key={key}
              label={f.label}
              value={get(f.path, 0)}
              onChange={(n) => onChange(f.path, n)}
            />
          );
        }
        if (f.type === "color") {
          return (
            <ColorField
              key={key}
              label={f.label}
              value={get(f.path, "#000000")}
              onChange={(v) => onChange(f.path, v)}
            />
          );
        }
        if (f.type === "select") {
          return (
            <Field key={key} label={f.label}>
              <select
                className="w-full rounded border p-2"
                value={get(f.path, f.options?.[0]?.value)}
                onChange={(e) => onChange(f.path, e.target.value)}
              >
                {f.options.map((opt) => (
                  <option key={opt.value ?? opt} value={opt.value ?? opt}>
                    {opt.label ?? opt}
                  </option>
                ))}
              </select>
            </Field>
          );
        }
        if (f.type === "toggle") {
          return (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={!!get(f.path, false)}
                onChange={(e) => onChange(f.path, e.target.checked)}
              />{" "}
              {f.label}
            </label>
          );
        }
        if (f.type === "image") {
          return (
            <Field key={key} label={f.label}>
              <Row>
                <input
                  readOnly
                  className="flex-1 rounded border px-2 py-1 text-gray-500"
                  value={get(f.path, "") || ""}
                />
                <label className="cursor-pointer rounded border px-2 py-1 hover:border-indigo-400">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const r = new FileReader();
                      r.onload = () => onChange(f.path, r.result);
                      r.readAsDataURL(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </Row>
            </Field>
          );
        }
        if (f.type === "array") {
          const arr = get(f.path, []);
          return (
            <div key={key} className="space-y-2">
              <Label>{f.label}</Label>
              {arr.map((item, i) => (
                <div
                  key={`${key}:${i}`}
                  className="rounded border bg-white/70 p-2"
                >
                  {f.itemSchema.map((sf, j) => {
                    const itemKey = `${key}:${i}:${sf.key}:${j}`;
                    if (sf.type === "text") {
                      return (
                        <TextFieldFast
                          key={itemKey}
                          label={sf.label}
                          value={item[sf.key] ?? ""}
                          onChange={(v) => {
                            const next = [...arr];
                            next[i] = { ...next[i], [sf.key]: v };
                            onChange(f.path, next);
                          }}
                        />
                      );
                    }
                    if (sf.type === "textarea") {
                      return (
                        <TextareaFieldFast
                          key={itemKey}
                          label={sf.label}
                          value={item[sf.key] ?? ""}
                          onChange={(v) => {
                            const next = [...arr];
                            next[i] = { ...next[i], [sf.key]: v };
                            onChange(f.path, next);
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                  <div className="mt-2 flex justify-end">
                    <Button
                      className="border-gray-300 bg-white hover:border-indigo-400"
                      onClick={() => {
                        const next = [...arr];
                        next.splice(i, 1);
                        onChange(f.path, next);
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                className="border-gray-300 bg-white hover:border-indigo-400"
                onClick={() => {
                  const next = [...arr];
                  next.push(deepClone(f.addItem));
                  onChange(f.path, next);
                }}
              >
                + Tambah
              </Button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ALL_REGISTRY & CANVAS kini diambil dari utils agar tidak duplikasi

const AdminEditorSidebar = ({ editor }) => {
  const { page, selectedElement, updatePage, activeView, liveElement } = editor;
  const isCover = activeView === "cover";
  const [stepSize, setStepSize] = React.useState("1");
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

  const displayElement = selectedElement 
    ? (liveElement && liveElement.id === selectedElement.id ? liveElement : selectedElement)
    : null;

  // Safeguards for missing card/music in legacy data
  const card = React.useMemo(() => {
    const base = {
      bgType: "gradient",
      gradient: { from: "#eef2ff", to: "#ffffff" },
      color: "#ffffff",
      bgImage: null,
      pattern: "none",
      radius: 28,
      padding: 32,
    };
    const c = { ...base, ...(page?.card || {}) };
    c.gradient = { ...base.gradient, ...(page?.card?.gradient || {}) };
    return c;
  }, [page?.card]);

  const music = React.useMemo(
    () => ({
      src: null,
      autoplay: false,
      loop: true,
      volume: 0.4,
      ...(page?.music || {}),
    }),
    [page?.music]
  );
  const snap = React.useMemo(
    () => ({
      enabled: page?.snap?.enabled ?? true,
      size: page?.snap?.size ?? 25, // Default size 25
      color: page?.snap?.color ?? 'rgba(0,0,0,0.08)', // Default color
      lineSize: page?.snap?.lineSize ?? 1, // Default line size
    }),
    [page?.snap]
  );

  // Card & Music updater
  function updateCard(part) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const current = draft.card || {};
      draft.card = { ...current, ...part };
      return draft;
    });
  }
  function updateMusic(part) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const current = draft.music || {};
      draft.music = { ...current, ...part };
      return draft;
    });
  }
  function updateSnap(part) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const current = draft.snap || { enabled: true, size: 25, color: 'rgba(0,0,0,0.08)', lineSize: 1 };
      draft.snap = { ...current, ...part };
      return draft;
    });
  }

  // Element operations (pos/size/attr)
  function setElementPos(id, x, y) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      );
      return draft;
    });
  }
  function setElementSize(id, w, h) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.map((el) =>
        el.id === id ? { ...el, w, h } : el
      );
      return draft;
    });
  }
  function updateElementDataPath(id, path, value) {
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const el = elements.find((e) => e.id === id);
      if (!el) return draft;
      setByPath(el, `data.${path}`, value);
      draft.elements = elements.map((item) => (item.id === id ? el : item));
      return draft;
    });
  }

  // Add/Remove/Duplicate/Z-order
  function addElement(type) {
    const def = ALL_REGISTRY[type];
    if (!def) return null;
    const w = def.minSize.w;
    const h = def.minSize.h;
    const el = {
      id: `el-${Math.random().toString(36).slice(2, 9)}`,
      type,
      x: 40,
      y: 40,
      w,
      h,
      data: deepClone(def.defaultData),
    };

    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = [...elements, el];
      return draft;
    });
    
    return el;
  }
  function removeSelected() {
    if (!selectedElement) return;
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.filter((e) => e.id !== selectedElement.id);
      return draft;
    });
  }
  function duplicateSelected() {
    if (!selectedElement) return;
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const elementToDuplicate = elements.find(
        (e) => e.id === selectedElement.id
      );
      if (!elementToDuplicate) return draft;
      const n = deepClone(elementToDuplicate);
      n.id = `el-${Math.random().toString(36).slice(2, 9)}`;
      n.x = clamp(n.x + 20, 0, CANVAS.width - n.w);
      n.y = clamp(n.y + 20, 0, CANVAS.height - n.h);
      draft.elements = [...elements, n];
      return draft;
    });
  }
  function bringToFront() {
    if (!selectedElement) return;
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const others = elements.filter((e) => e.id !== selectedElement.id);
      const current = elements.find((e) => e.id === selectedElement.id);
      if (current) {
        draft.elements = [...others, current];
      }
      return draft;
    });
  }
  function sendToBack() {
    if (!selectedElement) return;
    updatePage((currentPage = {}) => {
      const draft = deepClone(currentPage || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const others = elements.filter((e) => e.id !== selectedElement.id);
      const current = elements.find((e) => e.id === selectedElement.id);
      if (current) {
        draft.elements = [current, ...others];
      }
      return draft;
    });
  }

  // Draft element untuk inspector (agar input lebih halus)
  const [draftEl, setDraftEl] = React.useState(null);
  React.useEffect(() => {
    if (!selectedElement) return setDraftEl(null);
    setDraftEl((prev) =>
      prev && prev.id === selectedElement.id ? prev : deepClone(selectedElement)
    );
  }, [selectedElement]);
  const flushDraft = useDebounced((next) => {
    if (!next) return;
    const p = deepClone(page);
    const idx = p.elements.findIndex((e) => e.id === next.id);
    if (idx !== -1) {
      p.elements[idx] = { ...p.elements[idx], data: deepClone(next.data) };
      updatePage(p);
    }
  }, 250);

  return (
    <aside
      className="sticky top-16 h-[calc(100vh-6rem)] overflow-auto rounded-2xl border bg-white p-4 shadow"
      onKeyDownCapture={(e) => e.stopPropagation()}
      onKeyUpCapture={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">Editor</div>
      </div>

      {/* Cover Settings */}
      {isCover && (
        <section className="mb-6">
          <Label>Informasi Cover</Label>
          <AdminCoverEditor page={page} updatePage={updatePage} />
        </section>
      )}

      {/* Card */}
      {!isCover && (
        <section className="space-y-3">
          <Label>Latar</Label>
          <Row className="gap-2">
            <Button
              onClick={() =>
                updateCard({
                  bgType: "solid",
                  color: card.color === "transparent" ? "#ffffff" : card.color,
                })
              }
              className={
                card.bgType === "solid" && card.color !== "transparent"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 bg-white hover:border-indigo-400"
              }
            >
              solid
            </Button>
            <Button
              onClick={() => updateCard({ bgType: "gradient" })}
              className={
                card.bgType === "gradient"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 bg-white hover:border-indigo-400"
              }
            >
              gradient
            </Button>
            <Button
              onClick={() => updateCard({ bgType: "image" })}
              className={
                card.bgType === "image"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 bg-white hover:border-indigo-400"
              }
            >
              image
            </Button>
            <Button
              onClick={() =>
                updateCard({ bgType: "solid", color: "transparent" })
              }
              className={
                card.bgType === "solid" && card.color === "transparent"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 bg-white hover:border-indigo-400"
              }
            >
              transparent
            </Button>
          </Row>
          {card.bgType === "solid" && card.color !== "transparent" && (
            <ColorField
              label="Warna"
              value={card.color}
              onChange={(v) => updateCard({ color: v })}
            />
          )}
          {card.bgType === "gradient" && (
            <div className="grid grid-cols-2 gap-2">
              <ColorField
                label="Dari"
                value={card.gradient.from}
                onChange={(v) =>
                  updateCard({ gradient: { ...card.gradient, from: v } })
                }
              />
              <ColorField
                label="Ke"
                value={card.gradient.to}
                onChange={(v) =>
                  updateCard({ gradient: { ...card.gradient, to: v } })
                }
              />
            </div>
          )}
          {card.bgType === "image" && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm hover:border-indigo-400">
              Upload BG
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => updateCard({ bgImage: r.result });
                  r.readAsDataURL(f);
                  e.target.value = "";
                }}
              />
            </label>
          )}
          <Row className="gap-2">
            {["none", "dots", "grid"].map((pat) => (
              <Button
                key={pat}
                onClick={() => updateCard({ pattern: pat })}
                className={
                  card.pattern === pat
                    ? "border-indigo-500 text-indigo-600"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }
              >
                {pat}
              </Button>
            ))}
          </Row>
          <SliderField
            label="Radius"
            value={card.radius}
            min={0}
            max={64}
            step={1}
            onChange={(v) => updateCard({ radius: v })}
          />
          <SliderField
            label="Padding"
            value={card.padding}
            min={0}
            max={80}
            step={1}
            onChange={(v) => updateCard({ padding: v })}
          />
        </section>
      )}

      {/* Card untuk Cover - hanya padding dan radius */}
      {isCover && (
        <section className="space-y-3">
          <Label>Layout</Label>
          <SliderField
            label="Radius"
            value={card.radius}
            min={0}
            max={64}
            step={1}
            onChange={(v) => updateCard({ radius: v })}
          />
          <SliderField
            label="Padding"
            value={card.padding}
            min={0}
            max={80}
            step={1}
            onChange={(v) => updateCard({ padding: v })}
          />
        </section>
      )}

      {/* Music */}
      {!isCover && (
        <section className="mt-6 space-y-2">
          <Label>Musik</Label>
          <Row>
            {!isAudioPlaying ? (
              <Button
                onClick={() => {
                  const audio = document.querySelector("audio");
                  if (audio) {
                    audio.play();
                    setIsAudioPlaying(true);
                  }
                }}
                className="border-gray-300 bg-white hover:border-indigo-400 flex items-center gap-2"
                title="Play Music"
              >
                <FaPlay />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const audio = document.querySelector("audio");
                  if (audio) {
                    audio.pause();
                    setIsAudioPlaying(false);
                  }
                }}
                className="border-gray-300 bg-white hover:border-indigo-400 flex items-center gap-2"
                title="Pause Music"
              >
                <FaPause />
              </Button>
            )}
            <label className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm hover:border-indigo-400 flex items-center gap-2">
              <FaUpload />
              <span>Upload</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => updateMusic({ src: r.result });
                  r.readAsDataURL(f);
                  e.target.value = "";
                }}
              />
            </label>
          </Row>
          <Row>
            <span className="text-xs text-gray-500">Vol</span>
            <SliderField
              label="Volume"
              value={music.volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateMusic({ volume: v })}
            />
            <label className="ml-2 flex items-center gap-1 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={!!music.autoplay}
                onChange={(e) => updateMusic({ autoplay: e.target.checked })}
              />{" "}
              Autoplay
            </label>
            <label className="ml-2 flex items-center gap-1 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={!!music.loop}
                onChange={(e) => updateMusic({ loop: e.target.checked })}
              />{" "}
              Loop
            </label>
          </Row>
        </section>
      )}

      {/* Add Components */}
      {!isCover && (
        <section className="mt-6">
          <Label>Tambah Komponen</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.entries(ALL_REGISTRY).map(([key, def]) => (
              <Button
                key={key}
                onClick={() => {
                  const newElement = addElement(key);
                  if (newElement) {
                    editor.setSelectedId(newElement.id);
                  }
                }}
                className="border-gray-300 bg-white hover:border-indigo-400 text-left"
              >
                + {def.label}
              </Button>
            ))}
          </div>
        </section>
      )}

      {card.pattern === 'grid' && (
        <section className="mt-6 space-y-2">
          <Label>Grid</Label>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Snap to Grid</span>
            <button
              type="button"
              onClick={() => updateSnap({ enabled: !snap.enabled })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                snap.enabled ? "bg-indigo-600" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={snap.enabled}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  snap.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <NumberField
            label="Grid Size"
            value={snap.size}
            min={1}
            max={64}
            step={1}
            onChange={(v) => updateSnap({ size: v })}
          />
          <NumberField
            label="Line Size"
            value={snap.lineSize}
            min={0.5}
            max={10}
            step={0.5}
            onChange={(v) => updateSnap({ lineSize: v })}
          />
          <ColorField
            label="Grid Color"
            value={snap.color}
            onChange={(v) => updateSnap({ color: v })}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => updateSnap({ size: 25, lineSize: 1, color: 'rgba(0,0,0,0.08)' })}
              className="border-gray-300 bg-white hover:border-indigo-400 text-xs"
            >
              Reset to Default
            </Button>
          </div>
        </section>
      )}

      {card.pattern === 'dots' && (
        <section className="mt-6 space-y-2">
          <Label>Dots</Label>
          <ColorField
            label="Dot Color"
            value={card.dotColor}
            onChange={(v) => updateCard({ dotColor: v })}
          />
          <NumberField
            label="Dot Size"
            value={card.dotSize}
            min={0.5}
            max={10}
            step={0.5}
            onChange={(v) => updateCard({ dotSize: v })}
          />
          <NumberField
            label="Dot Spacing"
            value={card.dotSpacing}
            min={5}
            max={50}
            step={1}
            onChange={(v) => updateCard({ dotSpacing: v })}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => updateCard({ dotColor: 'rgba(0,0,0,0.06)', dotSize: 1, dotSpacing: 12 })}
              className="border-gray-300 bg-white hover:border-indigo-400 text-xs"
            >
              Reset to Default
            </Button>
          </div>
        </section>
      )}

      {/* Selected Element Editor */}
      <section className="mt-6">
        <Label>Elemen Terpilih</Label>
        {!displayElement && (
          <div className="text-sm text-gray-500">
            Klik elemen di kanvas untuk mengedit.
          </div>
        )}
        {displayElement && (
          <div className="mt-2 space-y-4">
            <div className="space-y-4">
              {/* Position Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Label className="text-xs">Step Size:</Label>
                  <select
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                    value={stepSize}
                    onChange={(e) => setStepSize(e.target.value)}
                  >
                    <option value="1">1px</option>
                    <option value="5">5px</option>
                    <option value="10">10px</option>
                    <option value="25">25px</option>
                    <option value="50">50px</option>
                  </select>
                </div>
                <div className="relative h-32 w-32 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-xs text-gray-500">
                      <div>X: {displayElement.x}</div>
                      <div>Y: {displayElement.y}</div>
                    </div>
                  </div>
                  <button
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newY = clamp(displayElement.y - step, 0, CANVAS.height - displayElement.h);
                      setElementPos(
                        displayElement.id,
                        displayElement.x,
                        newY
                      );
                    }}
                  >
                    ↑
                  </button>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newX = clamp(displayElement.x + step, 0, CANVAS.width - displayElement.w);
                      setElementPos(
                        displayElement.id,
                        newX,
                        displayElement.y
                      );
                    }}
                  >
                    →
                  </button>
                  <button
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newY = clamp(displayElement.y + step, 0, CANVAS.height - displayElement.h);
                      setElementPos(
                        displayElement.id,
                        displayElement.x,
                        newY
                      );
                    }}
                  >
                    ↓
                  </button>
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newX = clamp(displayElement.x - step, 0, CANVAS.width - displayElement.w);
                      setElementPos(
                        displayElement.id,
                        newX,
                        displayElement.y
                      );
                    }}
                  >
                    ←
                  </button>
                </div>
              </div>

              {/* Size Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-center">
                  <Label>Width: {displayElement.w}px</Label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const step = parseInt(stepSize, 10) || 1;
                        const newW = clamp(displayElement.w - step, 10, CANVAS.width - displayElement.x);
                        setElementSize(
                          displayElement.id,
                          newW,
                          displayElement.h
                        );
                      }}
                    >
                      -
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const step = parseInt(stepSize, 10) || 1;
                        const newW = clamp(displayElement.w + step, 10, CANVAS.width - displayElement.x);
                        setElementSize(
                          displayElement.id,
                          newW,
                          displayElement.h
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <Label>Height: {displayElement.h}px</Label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newH = Math.max(
                          10,
                          displayElement.h - (parseInt(stepSize, 10) || 1)
                        );
                        setElementSize(
                          displayElement.id,
                          displayElement.w,
                          newH
                        );
                      }}
                    >
                      -
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newH = Math.min(
                          CANVAS.height - displayElement.y,
                          displayElement.h + (parseInt(stepSize, 10) || 1)
                        );
                        setElementSize(
                          displayElement.id,
                          displayElement.w,
                          newH
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <InspectorFields
              schema={schemaOf(displayElement)}
              el={draftEl || displayElement}
              onChange={(path, v) => {
                setDraftEl((d) => {
                  const base =
                    d && d.id === displayElement.id
                      ? d
                      : deepClone(displayElement);
                  const next = deepClone(base);
                  setByPath(next, `data.${path}`, v);
                  flushDraft(next);
                  return next;
                });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={duplicateSelected}
                className="border-gray-300 bg-white hover:border-indigo-400"
              >
                Duplikat
              </Button>
              <Button
                onClick={removeSelected}
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                Hapus
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <Button
                onClick={() => {
                  if (!displayElement) return;
                  const innerW = CANVAS.width - (card.padding ?? 0) * 2;
                  const innerH = CANVAS.height - (card.padding ?? 0) * 2;
                  const nx = Math.max(
                    0,
                    Math.round((innerW - displayElement.w) / 2)
                  );
                  const ny = Math.max(
                    0,
                    Math.round((innerH - displayElement.h) / 2)
                  );
                  setElementPos(displayElement.id, nx, ny);
                }}
                className="border-gray-300 bg-white hover:border-indigo-400"
              >
                Center to Canvas
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={bringToFront}
                className="border-gray-300 bg-white hover:border-indigo-400"
              >
                Ke Depan
              </Button>
              <Button
                onClick={sendToBack}
                className="border-gray-300 bg-white hover:border-indigo-400"
              >
                Ke Belakang
              </Button>
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900">
        Tips: drag = seret, tahan Shift untuk snap 1px. Double-click teks untuk
        edit langsung. Resize via handle sudut. Panah untuk nudge.
      </div>
    </aside>
  );
};

export default AdminEditorSidebar;