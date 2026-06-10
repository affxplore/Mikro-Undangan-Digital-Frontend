import React from 'react';
import { PAGES_REGISTRY, CANVAS } from '../../../../../utils/InvitationBuilder';
import {
  Label,
  Row,
  Button,
  ColorField,
  NumberField,
  SliderField,
  deepClone,
  setByPath,
  useDebounced,
} from './FormControls';
import { InspectorFields, schemaOf } from './InspectorFields';

const PagesSidebar = ({ editor, onPlayMusic, onMusicPause }) => {
  const { page, selectedElement, updatePage, addPageWithElement } = editor;

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

  const music = React.useMemo(() => ({
    src: null,
    autoplay: false,
    loop: true,
    volume: 0.4,
    ...(page?.music || {}),
  }), [page?.music]);

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

  const updateMusic = (part) => {
    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      draft.music = { ...(draft.music || {}), ...part };
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

  const addElement = (type) => {
    const def = PAGES_REGISTRY[type];
    if (!def) return;
    const el = {
      id: `el-${Math.random().toString(36).slice(2, 9)}`,
      type,
      x: 40,
      y: 40,
      w: def.minSize.w,
      h: def.minSize.h,
      data: deepClone(def.defaultData),
    };

    updatePage((current = {}) => {
      const draft = deepClone(current || {});
      const elements = Array.isArray(draft.elements) ? draft.elements : [];
      draft.elements = [...elements, el];
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

  const [draftEl, setDraftEl] = React.useState(null);
  const [stepSize, setStepSize] = React.useState("1");
  
  React.useEffect(() => {
    if (!selectedElement) return setDraftEl(null);
    setDraftEl((prev) => (prev && prev.id === selectedElement.id ? prev : deepClone(selectedElement)));
  }, [selectedElement?.id]);

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
    <div className="editor-sidebar">
      <section className="space-y-3">
        <Label>Latar Halaman</Label>
        <Row className="gap-2">
          {['solid', 'gradient', 'image'].map((mode) => (
            <Button
              key={mode}
              onClick={() => updateCard({ bgType: mode })}
              className={card.bgType === mode ? 'border-indigo-500 text-indigo-600' : 'border-gray-300 bg-white hover:border-indigo-400'}
            >
              {mode}
            </Button>
          ))}
        </Row>
        {card.bgType === 'solid' && <ColorField label="Warna" value={card.color} onChange={(v) => updateCard({ color: v })} />}
        {card.bgType === 'gradient' && (
          <div className="grid grid-cols-2 gap-2">
            <ColorField label="Dari" value={card.gradient.from} onChange={(v) => updateCard({ gradient: { ...card.gradient, from: v } })} />
            <ColorField label="Ke" value={card.gradient.to} onChange={(v) => updateCard({ gradient: { ...card.gradient, to: v } })} />
          </div>
        )}
        {card.bgType === 'image' && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm hover:border-indigo-400">
            Upload BG
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => updateCard({ bgImage: reader.result });
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </label>
        )}
        <Row className="gap-2">
          {['none', 'dots', 'grid'].map((pattern) => (
            <Button
              key={pattern}
              onClick={() => updateCard({ pattern })}
              className={card.pattern === pattern ? 'border-indigo-500 text-indigo-600' : 'border-gray-300 bg-white hover:border-indigo-400'}
            >
              {pattern}
            </Button>
          ))}
        </Row>
        <SliderField label="Radius" value={card.radius} min={0} max={64} step={1} onChange={(v) => updateCard({ radius: v })} />
        <SliderField label="Padding" value={card.padding} min={0} max={80} step={1} onChange={(v) => updateCard({ padding: v })} />
      </section>

      <section className="mt-6 space-y-2">
        <Label>Musik</Label>
        <Row>
          <Button onClick={onPlayMusic} className="border-gray-300 bg-white hover:border-indigo-400">
            Play
          </Button>
          <Button onClick={onMusicPause} className="border-gray-300 bg-white hover:border-indigo-400">
            Pause
          </Button>
          <label className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm hover:border-indigo-400">
            Upload
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => updateMusic({ src: reader.result });
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </label>
        </Row>
        <Row>
          <span className="text-xs text-gray-500">Vol</span>
          <SliderField label="Volume" value={music.volume} min={0} max={1} step={0.01} onChange={(v) => updateMusic({ volume: v })} />
          <label className="ml-2 flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={!!music.autoplay} onChange={(e) => updateMusic({ autoplay: e.target.checked })} /> Autoplay
          </label>
          <label className="ml-2 flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={!!music.loop} onChange={(e) => updateMusic({ loop: e.target.checked })} /> Loop
          </label>
        </Row>
      </section>

      <section className="mt-6">
        <Label>Tambah Komponen Kecil</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.entries(PAGES_REGISTRY)
            .filter(([_, def]) => def.category === 'small')
            .map(([key, def]) => (
              <Button key={key} onClick={() => addElement(key)} className="border-gray-300 bg-white hover:border-indigo-400 text-left">
                + {def.label}
              </Button>
            ))}
        </div>
      </section>

      <section className="mt-4">
        <Label>Tambah Halaman (Komponen Besar)</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.entries(PAGES_REGISTRY)
            .filter(([_, def]) => def.category === 'large')
            .map(([key, def]) => (
              <Button
                key={key}
                onClick={() => addPageWithElement(key)}
                className="border-gray-300 bg-white hover:border-indigo-400 text-left"
              >
                + {def.label}
              </Button>
            ))}
        </div>
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
                    <option value="100">100px</option>
                    <option value="250">250px</option>
                  </select>
                </div>
                <div className="relative h-32 w-32 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-gray-500">
                      X: {selectedElement.x}, Y: {selectedElement.y}
                    </div>
                  </div>
                  {/* Up button */}
                  <button
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newY = Math.max(0, selectedElement.y - step);
                      setElementPos(selectedElement.id, selectedElement.x, newY);
                    }}
                  >
                    ↑
                  </button>
                  {/* Right button */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newX = Math.min(CANVAS.width - selectedElement.w, selectedElement.x + step);
                      setElementPos(selectedElement.id, newX, selectedElement.y);
                    }}
                  >
                    →
                  </button>
                  {/* Down button */}
                  <button
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newY = Math.min(CANVAS.height - selectedElement.h, selectedElement.y + step);
                      setElementPos(selectedElement.id, selectedElement.x, newY);
                    }}
                  >
                    ↓
                  </button>
                  {/* Left button */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-indigo-400"
                    onClick={() => {
                      const step = parseInt(stepSize, 10);
                      const newX = Math.max(0, selectedElement.x - step);
                      setElementPos(selectedElement.id, newX, selectedElement.y);
                    }}
                  >
                    ←
                  </button>
                </div>
              </div>

              {/* Size Controls */}
              <div className="grid grid-cols-2 gap-4">
                {/* Width Control */}
                <div className="space-y-1">
                  <Label>Width: {selectedElement.w}px</Label>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newW = Math.max(10, selectedElement.w - 1);
                        setElementSize(selectedElement.id, newW, selectedElement.h);
                      }}
                    >
                      -
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newW = Math.min(CANVAS.width - selectedElement.x, selectedElement.w + 1);
                        setElementSize(selectedElement.id, newW, selectedElement.h);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Height Control */}
                <div className="space-y-1">
                  <Label>Height: {selectedElement.h}px</Label>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newH = Math.max(10, selectedElement.h - 1);
                        setElementSize(selectedElement.id, selectedElement.w, newH);
                      }}
                    >
                      -
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-indigo-400 flex items-center justify-center"
                      onClick={() => {
                        const newH = Math.min(CANVAS.height - selectedElement.y, selectedElement.h + 1);
                        setElementSize(selectedElement.id, selectedElement.w, newH);
                      }}
                    >
                      +
                    </button>
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
    </div>
  );
};

export default PagesSidebar;
