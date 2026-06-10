import React from 'react';
import { COVER_REGISTRY, CANVAS } from '../../../../../utils/InvitationBuilder';
import { COVER_REGISTRY as COVER_TYPES_REGISTRY } from '../../../../../utils/CoverBuilder';
import {
  Label,
  Row,
  Button,
  Field,
  ColorField,
  NumberField,
  SliderField,
  TextFieldFast,
  deepClone,
  clamp,
  setByPath,
  useDebounced,
} from './FormControls';
import { InspectorFields, schemaOf } from './InspectorFields';

const CoverSidebar = ({ editor }) => {
  const { page, selectedElement, updatePage } = editor;

  const card = React.useMemo(() => {
    const base = {
      bgType: 'gradient',
      gradient: { from: '#eef2ff', to: '#ffffff' },
      color: '#ffffff',
      bgImage: null,
      pattern: 'none',
      radius: 28,
      padding: 32,
    };
    const result = { ...base, ...(page?.card || {}) };
    result.gradient = { ...base.gradient, ...(page?.card?.gradient || {}) };
    return result;
  }, [page?.card]);

  const snap = React.useMemo(
    () => ({ enabled: page?.snap?.enabled ?? true, size: page?.snap?.size ?? 5 }),
    [page?.snap],
  );

  const updateCard = (part) => {
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      draft.card = { ...(draft.card || {}), ...part };
      if (part.gradient) {
        draft.card.gradient = { ...(draft.card.gradient || {}), ...part.gradient };
      }
      return draft;
    });
  };

  const updateSnap = (part) => {
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      draft.snap = { ...(draft.snap || { enabled: true, size: 5 }), ...part };
      return draft;
    });
  };

  const setElementPos = (id, x, y) => {
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.map((el) => (el.id === id ? { ...el, x, y } : el));
      return draft;
    });
  };

  const setElementSize = (id, w, h) => {
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.map((el) => (el.id === id ? { ...el, w, h } : el));
      return draft;
    });
  };

  const removeSelected = () => {
    if (!selectedElement) return;
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = elements.filter((el) => el.id !== selectedElement.id);
      return draft;
    });
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const target = elements.find((el) => el.id === selectedElement.id);
      if (!target) return draft;
      const copy = deepClone(target);
      copy.id = `el-${Math.random().toString(36).slice(2, 9)}`;
      copy.x = clamp(copy.x + 20, 0, CANVAS.width - copy.w);
      copy.y = clamp(copy.y + 20, 0, CANVAS.height - copy.h);
      draft.elements = [...elements, copy];
      return draft;
    });
  };

  const bringToFront = () => {
    if (!selectedElement) return;
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const others = elements.filter((el) => el.id !== selectedElement.id);
      const currentEl = elements.find((el) => el.id === selectedElement.id);
      if (currentEl) {
        draft.elements = [...others, currentEl];
      }
      return draft;
    });
  };

  const sendToBack = () => {
    if (!selectedElement) return;
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const others = elements.filter((el) => el.id !== selectedElement.id);
      const currentEl = elements.find((el) => el.id === selectedElement.id);
      if (currentEl) {
        draft.elements = [currentEl, ...others];
      }
      return draft;
    });
  };

  const [stepSize, setStepSize] = React.useState(1);
  const [draftEl, setDraftEl] = React.useState(null);
  React.useEffect(() => {
    if (!selectedElement) return setDraftEl(null);
    setDraftEl((prev) => (prev && prev.id === selectedElement.id ? prev : deepClone(selectedElement)));
  }, [selectedElement, selectedElement?.id]);

  const flushDraft = useDebounced((next) => {
    if (!next) return;
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      const idx = elements.findIndex((el) => el.id === next.id);
      if (idx !== -1) {
        elements[idx] = { ...elements[idx], data: deepClone(next.data) };
        draft.elements = elements;
      }
      return draft;
    });
  }, 250);

  return (
    <>
      <section className="space-y-3">
        <Label>Cover Form Editor</Label>
        {/* Deteksi apakah halaman ini menggunakan cover type dari CoverBuilder */}
        {(() => {
          const pageType = page?.type || page?.coverType;
          const availableCoverType = pageType && COVER_TYPES_REGISTRY.types[pageType] ? pageType : null;
          
          if (availableCoverType) {
            const coverTypeSchema = COVER_TYPES_REGISTRY.types[availableCoverType].schema || [];
            const coverFormData = page?.coverData || page?.data || {};
            
            const updateCoverFormData = (path, value) => {
              updatePage((current = {}) => {
                const draft = deepClone(current || {});
                draft.coverData = { ...(draft.coverData || {}), [path]: value };
                // Juga update di data untuk kompatibilitas
                draft.data = { ...(draft.data || {}), [path]: value };
                return draft;
              });
            };

            return (
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  Tipe cover: {COVER_TYPES_REGISTRY.types[availableCoverType].label}
                </div>
                <div className="space-y-3">
                  {coverTypeSchema.map((field) => {
                    const value = coverFormData[field.path] ?? field.default ?? '';
                    
                    switch (field.type) {
                      case 'text':
                        return (
                          <TextFieldFast
                            key={field.path}
                            label={field.label}
                            value={value}
                            onChange={(v) => updateCoverFormData(field.path, v)}
                            placeholder={field.default || ''}
                          />
                        );
                      case 'color':
                        return (
                          <ColorField
                            key={field.path}
                            label={field.label}
                            value={value}
                            onChange={(v) => updateCoverFormData(field.path, v)}
                          />
                        );
                      case 'select':
                        return (
                          <Field key={field.path} label={field.label}>
                            <select
                              className="w-full rounded border p-2 text-sm"
                              value={value}
                              onChange={(e) => updateCoverFormData(field.path, e.target.value)}
                            >
                              {(field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                        );
                      case 'image':
                        return (
                          <div key={field.path} className="space-y-2">
                            <Label>{field.label}</Label>
                            {value ? (
                              <div className="relative h-32 w-full overflow-hidden rounded border">
                                <img src={value} alt={field.label} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => updateCoverFormData(field.path, null)}
                                  className="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-white"
                                >
                                  Hapus
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">Belum ada gambar</div>
                            )}
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm hover:border-indigo-400">
                              Upload {field.label}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => updateCoverFormData(field.path, reader.result);
                                  reader.readAsDataURL(file);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                  {!coverTypeSchema.length && (
                    <div className="text-xs text-gray-500">Cover ini belum memiliki form yang dapat diedit.</div>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div className="text-xs text-gray-500">
                Halaman ini tidak menggunakan cover type yang mendukung form editor.
              </div>
            );
          }
        })()}
      </section>

      <section className="space-y-3">
        <Label>Latar Kartu</Label>
        <SliderField label="Radius" value={card.radius} min={0} max={64} step={1} onChange={(v) => updateCard({ radius: v })} />
        <SliderField label="Padding" value={card.padding} min={0} max={80} step={1} onChange={(v) => updateCard({ padding: v })} />
      </section>

      <section className="mt-6 space-y-2">
        <Label>Snap</Label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!snap.enabled} onChange={(e) => updateSnap({ enabled: e.target.checked })} />
          Snap to grid
        </label>
        <NumberField label="Grid Size" value={snap.size} min={1} max={64} step={1} onChange={(v) => updateSnap({ size: v })} />
      </section>

      <section className="mt-6">
        <Label>Elemen Terpilih</Label>
        {!selectedElement && <div className="text-sm text-gray-500">Klik elemen di kanvas untuk mengedit.</div>}
        {selectedElement && (
          <div className="mt-2 space-y-4">
            <div className="space-y-4">
              <div>
                <select 
                  className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  value={stepSize}
                  onChange={(e) => setStepSize(Number(e.target.value))}
                >
                  <option value="1">Step: 1px</option>
                  <option value="5">Step: 5px</option>
                  <option value="10">Step: 10px</option>
                  <option value="25">Step: 25px</option>
                  <option value="50">Step: 50px</option>
                  <option value="100">Step: 100px</option>
                  <option value="250">Step: 250px</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-xs text-gray-600">X: {selectedElement.x}</div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => setElementPos(selectedElement.id, Math.max(0, selectedElement.x - stepSize), selectedElement.y)}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          ←
                        </Button>
                        <Button
                          onClick={() => setElementPos(selectedElement.id, Math.min(CANVAS.width - selectedElement.w, selectedElement.x + stepSize), selectedElement.y)}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          →
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-gray-600">Y: {selectedElement.y}</div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => setElementPos(selectedElement.id, selectedElement.x, Math.max(0, selectedElement.y - stepSize))}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          ↑
                        </Button>
                        <Button
                          onClick={() => setElementPos(selectedElement.id, selectedElement.x, Math.min(CANVAS.height - selectedElement.h, selectedElement.y + stepSize))}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-xs text-gray-600">W: {selectedElement.w}</div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => setElementSize(selectedElement.id, Math.max(10, selectedElement.w - 1), selectedElement.h)}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          -
                        </Button>
                        <Button
                          onClick={() => setElementSize(selectedElement.id, Math.min(CANVAS.width - selectedElement.x, selectedElement.w + 1), selectedElement.h)}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-gray-600">H: {selectedElement.h}</div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => setElementSize(selectedElement.id, selectedElement.w, Math.max(10, selectedElement.h - 1))}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          -
                        </Button>
                        <Button
                          onClick={() => setElementSize(selectedElement.id, selectedElement.w, Math.min(CANVAS.height - selectedElement.y, selectedElement.h + 1))}
                          className="border-gray-300 bg-white hover:border-indigo-400"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <InspectorFields
              schema={schemaOf(selectedElement)}
              el={draftEl || selectedElement}
              onChange={(path, value) => {
                setDraftEl((prev) => {
                  const base = prev && prev.id === selectedElement.id ? prev : deepClone(selectedElement);
                  const next = deepClone(base);
                  setByPath(next, `data.${path}`, value);
                  flushDraft(next);
                  return next;
                });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={duplicateSelected} className="border-gray-300 bg-white hover:border-indigo-400">Duplikat</Button>
              <Button onClick={removeSelected} className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100">Hapus</Button>
            </div>
            <div className="mt-1 grid grid-cols-1 gap-2">
              <Button
                onClick={() => {
                  const padding = card.padding ?? 0;
                  const innerW = CANVAS.width - padding * 2;
                  const innerH = CANVAS.height - padding * 2;
                  const nx = Math.max(0, Math.round((innerW - selectedElement.w) / 2));
                  const ny = Math.max(0, Math.round((innerH - selectedElement.h) / 2));
                  setElementPos(selectedElement.id, nx, ny);
                }}
                className="border-gray-300 bg-white hover:border-indigo-400"
              >
                Center to Canvas
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={bringToFront} className="border-gray-300 bg-white hover:border-indigo-400">Ke Depan</Button>
              <Button onClick={sendToBack} className="border-gray-300 bg-white hover:border-indigo-400">Ke Belakang</Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default CoverSidebar;