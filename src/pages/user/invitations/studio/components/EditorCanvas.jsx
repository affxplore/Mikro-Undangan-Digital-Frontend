/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { ALL_REGISTRY, CANVAS } from '../../../../../utils/InvitationBuilder';
import { COVER_REGISTRY as COVER_TYPES_REGISTRY, CoverRenderer } from '../../../../../utils/CoverBuilder';
import ElementFrame from './ElementFrame';


const EditorCanvas = ({ page, selectedId, setSelectedId, updatePage, cardRef: forwardedCardRef, audioRef: forwardedAudioRef, onUndo, onRedo }) => {
  const localCardRef = React.useRef(null);
  const localAudioRef = React.useRef(null);
  const cardRef = forwardedCardRef || localCardRef;
  const audioRef = forwardedAudioRef || localAudioRef;
  const innerRef = React.useRef(null);
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // Safeguards for missing card/elements
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
    const c = { ...base, ...(page.card || {}) };
    c.gradient = { ...base.gradient, ...(page.card?.gradient || {}) };
    return c;
  }, [page.card]);
  const elements = page.elements || [];
  const snap = React.useMemo(() => ({ enabled: page.snap?.enabled ?? true, size: page.snap?.size ?? 5 }), [page.snap]);
  const music = React.useMemo(() => ({ src: null, autoplay: false, loop: true, volume: 0.4, ...(page.music || {}) }), [page.music]);

  function renderBg() {
    if (card.bgType === 'image' && card.bgImage) {
      return <img src={card.bgImage} alt="bg" className="absolute inset-0 h-full w-full object-cover" />;
    }
    if (card.bgType === 'gradient') {
      return (
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(180deg, ${card.gradient.from}, ${card.gradient.to})` }} />
      );
    }
    return <div className="absolute inset-0" style={{ backgroundColor: card.color }} />;
  }

  function renderPattern() {
    if (card.pattern === 'dots') {
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            color: 'rgba(0,0,0,0.06)',
          }}
        />
      );
    }
    if (card.pattern === 'grid') {
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      );
    }
    return null;
  }

  // Update posisi/ukuran elemen
  const setElementPos = useCallback((id, x, y) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, x, y } : el));
      return draft;
    });
  });
  const setElementSize = useCallback((id, w, h) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, w, h } : el));
      return draft;
    });
  });

  const setElementData = useCallback((id, data) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, data: { ...el.data, ...data } } : el));
      return draft;
    });
  });

  React.useEffect(() => {
    function onKey(e) {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

      // shortcuts
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key.toLowerCase() === 'z') { e.preventDefault(); onUndo?.(); return; }
      if (isMod && e.key.toLowerCase() === 'y') { e.preventDefault(); onRedo?.(); return; }
      if (e.key === 'Delete') {
        if (selectedId) {
          e.preventDefault();
          updatePage((current) => {
            const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
            draft.elements = (draft.elements || []).filter((x) => x.id !== selectedId);
            return draft;
          });
          setSelectedId(null);
        }
        return;
      }

      // arrows
      if (!selectedId) return;
      const el = elements.find((x) => x.id === selectedId);
      if (!el) return;
      const n = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -n;
      else if (e.key === 'ArrowRight') dx = n;
      else if (e.key === 'ArrowUp') dy = -n;
      else if (e.key === 'ArrowDown') dy = n;
      else return;
      e.preventDefault();
      const nx = clamp(el.x + dx, 0, CANVAS.width - el.w);
      const ny = clamp(el.y + dy, 0, CANVAS.height - el.h);
      setElementPos(el.id, nx, ny);
    }
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [elements, selectedId, onUndo, onRedo, page, setSelectedId, updatePage, setElementPos, clamp, setElementSize, setElementData]);

  React.useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = music.volume ?? 0.4;
    if (music.autoplay) {
      audioRef.current.play?.().catch(() => {});
    }
  }, [music.src, music.autoplay, music.volume, audioRef]);

  // Handle clicks to manage selection state
  const editorRef = React.useRef(null);

  // Quick add removed per request

  // Check if this is a cover page and has valid type in registry
  const isCover = page.type && COVER_TYPES_REGISTRY.types[page.type];
  const coverBackgroundImage =
    page.data?.backgroundImage || page.coverData?.backgroundImage ||
    (card.bgType === 'image' ? card.bgImage : null);

  return (
    <div className="flex items-start justify-center" ref={editorRef}>
      <div className="relative">
        <div
          ref={cardRef}
          className="relative select-none overflow-hidden border bg-white shadow-xl editor-area"
          style={{ width: CANVAS.width, height: CANVAS.height, borderRadius: card.radius }}
          onMouseDown={(e) => {
            // Get the clicked element and its parent elements up to the canvas
            let target = e.target;
            let isOnElementFrame = false;
            
            while (target && target !== cardRef.current) {
              if (target.hasAttribute('data-element-frame')) {
                isOnElementFrame = true;
                break;
              }
              target = target.parentElement;
            }

            // Only deselect if clicking directly on canvas background (not on any element or its children)
            if (!isOnElementFrame && target === cardRef.current) {
              setSelectedId(null);
            }
          }}
        >
          {isCover ? (
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: coverBackgroundImage ? `url(${coverBackgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: coverBackgroundImage ? undefined : 'white'
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 w-full h-full">
                <CoverRenderer
                  type={page.type}
                  data={page.data || page.coverData || {}}
                  guestName={page.previewGuestName || "Nama Tamu"}
                />
              </div>
            </div>
          ) : (
            <>
              {renderBg()}
              {renderPattern()}
            </>
          )}
          <div className="absolute inset-0" style={{ padding: card.padding }}>
            <div ref={innerRef} className="relative h-full w-full">
              {elements.map((el) => (
                <ElementFrame
                  key={el.id}
                  el={el}
                  selected={selectedId === el.id}
                  boundsRef={innerRef}
                  onSelect={() => setSelectedId(el.id)}
                  onDragCommit={(pos) => setElementPos(el.id, pos.x, pos.y)}
                  onResizeCommit={(rect) => { setElementPos(el.id, rect.x, rect.y); setElementSize(el.id, rect.w, rect.h); }}
                  onInlineChange={(id, data) => setElementData(id, data)}
                  snapEnabled={!!snap.enabled}
                  snapSize={snap.size || 1}
                />
              ))}
            </div>
          </div>
          <audio
            ref={audioRef}
            src={music.src || undefined}
            loop={!!music.loop}
            data-export-exclude
          />
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
