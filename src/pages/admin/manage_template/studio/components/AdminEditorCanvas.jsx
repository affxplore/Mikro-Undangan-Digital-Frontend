import React, { useState, useCallback, useEffect } from 'react';
import { ALL_REGISTRY, CANVAS } from '../../../../../utils/InvitationBuilder';
import { COVER_REGISTRY, CoverRenderer } from '../../../../../utils/CoverBuilder';
import ElementFrame from './AdminElementFrame';

// Helper function untuk mendapatkan guide lines
const getGuideLines = (elements, activeElement, threshold = 5) => {
  const guides = { vertical: [], horizontal: [] };
  const active = {
    left: activeElement.x,
    right: activeElement.x + activeElement.w,
    top: activeElement.y,
    bottom: activeElement.y + activeElement.h,
    centerX: activeElement.x + activeElement.w / 2,
    centerY: activeElement.y + activeElement.h / 2
  };

  elements.forEach(el => {
    if (el.id === activeElement.id) return;
    
    const target = {
      left: el.x,
      right: el.x + el.w,
      top: el.y,
      bottom: el.y + el.h,
      centerX: el.x + el.w / 2,
      centerY: el.y + el.h / 2
    };

    // Vertical alignments
    [
      [active.left, target.left, 'left'],
      [active.right, target.right, 'right'],
      [active.centerX, target.centerX, 'center'],
      [active.left, target.right, 'spacing'],
      [active.right, target.left, 'spacing']
    ].forEach(([pos1, pos2, type]) => {
      const diff = Math.abs(pos1 - pos2);
      if (diff <= threshold) {
        guides.vertical.push({
          position: pos2,
          type,
          diff
        });
      }
    });

    // Horizontal alignments
    [
      [active.top, target.top, 'top'],
      [active.bottom, target.bottom, 'bottom'],
      [active.centerY, target.centerY, 'center'],
      [active.top, target.bottom, 'spacing'],
      [active.bottom, target.top, 'spacing']
    ].forEach(([pos1, pos2, type]) => {
      const diff = Math.abs(pos1 - pos2);
      if (diff <= threshold) {
        guides.horizontal.push({
          position: pos2,
          type,
          diff
        });
      }
    });
  });

  return guides;
};

const GuideLines = ({ guides }) => {
  return (
    <>
      {guides.vertical.map((guide, i) => (
        <div
          key={`v${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: guide.position,
            width: '1px',
            height: '100%',
            backgroundColor: '#2563eb',
            pointerEvents: 'none',
            zIndex: 999
          }}
        />
      ))}
      {guides.horizontal.map((guide, i) => (
        <div
          key={`h${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: guide.position,
            height: '1px',
            width: '100%',
            backgroundColor: '#2563eb',
            pointerEvents: 'none',
            zIndex: 999
          }}
        />
      ))}
    </>
  );
};

const AdminEditorCanvas = ({ 
  page, 
  selectedId, 
  setSelectedId,
  selectedIds = [], // Provide default empty array
  toggleSelection = () => {}, // Provide default noop functions
  addToSelection = () => {},
  clearSelection = () => {},
  updatePage, 
  cardRef: forwardedCardRef, 
  audioRef: forwardedAudioRef, 
  onUndo, 
  onRedo,
  onSave,
  updateLiveElement, 
  clearLiveElement,
  liveElement = {} // Default empty object for live elements
}) => {
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] });
  const cardRef = React.useRef(forwardedCardRef?.current || null);
  const innerRef = React.useRef(null);
  const audioRef = React.useRef(forwardedAudioRef?.current || null);
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
  const snap = React.useMemo(() => ({
    enabled: page.snap?.enabled ?? true,
    size: page.snap?.size ?? 25,
    color: page.snap?.color ?? 'rgba(0,0,0,0.08)',
    lineSize: page.snap?.lineSize ?? 1,
  }), [page.snap]);
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
    // Cek jika warna diatur ke transparan, tampilkan pola checkerboard
    if (card.color === 'transparent') {
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-conic-gradient(#f0f0f0 0% 25%, #dcdcdc 0% 50%)',
            backgroundSize: '16px 16px',
          }}
        />
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
            backgroundImage: `radial-gradient(${card.dotColor} ${card.dotSize}px, transparent ${card.dotSize}px)`,
            backgroundSize: `${card.dotSpacing}px ${card.dotSpacing}px`,
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
              `linear-gradient(to right, ${snap.color} ${snap.lineSize}px, transparent ${snap.lineSize}px), linear-gradient(to bottom, ${snap.color} ${snap.lineSize}px, transparent ${snap.lineSize}px)`,
            backgroundSize: `${snap.size}px ${snap.size}px`,
          }}
        />
      );
    }
    return null;
  }

  // Update posisi/ukuran elemen
  const setElementPos = (id, x, y) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, x, y } : el));
      return draft;
    });
  };
  const setElementSize = (id, w, h) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, w, h } : el));
      return draft;
    });
  };

  const setElementData = (id, data) => {
    updatePage((current) => {
      const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
      draft.elements = (draft.elements || []).map((el) => (el.id === id ? { ...el, data: { ...el.data, ...data } } : el));
      return draft;
    });
  };

  React.useEffect(() => {
    function onKey(e) {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

      // shortcuts
      const isMod = e.ctrlKey || e.metaKey;
      
      // Undo/Redo
      if (isMod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); onUndo?.(); return; }
      if ((isMod && e.key.toLowerCase() === 'y') || (isMod && e.shiftKey && e.key.toLowerCase() === 'z')) { 
        e.preventDefault(); 
        onRedo?.(); 
        return; 
      }

      // Save
      if (isMod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Delete selected elements
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          updatePage((current) => {
            const draft = JSON.parse(JSON.stringify(current || { elements: [] }));
            draft.elements = (draft.elements || []).filter((x) => !selectedIds.includes(x.id));
            return draft;
          });
          clearSelection();
        }
        return;
      }

      // Move elements with arrow keys
      if (selectedIds.length > 0 && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const n = e.shiftKey ? 10 : (snap.enabled ? snap.size : 1);
        let dx = 0, dy = 0;
        
        switch(e.key) {
          case 'ArrowLeft': dx = -n; break;
          case 'ArrowRight': dx = n; break;
          case 'ArrowUp': dy = -n; break;
          case 'ArrowDown': dy = n; break;
        }

        // Move all selected elements
        selectedIds.forEach(id => {
          const el = elements.find(x => x.id === id);
          if (el) {
            const nx = clamp(el.x + dx, 0, CANVAS.width - el.w);
            const ny = clamp(el.y + dy, 0, CANVAS.height - el.h);
            setElementPos(id, nx, ny);
          }
        });
      }
    }
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [
    elements,
    selectedIds,
    onUndo,
    onRedo,
    onSave,
    page,
    clearSelection,
    setElementPos,
    snap.enabled,
    snap.size,
    updatePage
  ]);

  React.useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = music.volume ?? 0.4;
    if (music.autoplay) {
      audioRef.current.play?.().catch(() => {});
    }
  }, [music.src, music.autoplay, music.volume]);

  // Quick add removed per request

  // Check if this is a cover page and has valid type in registry
  const isCover = page.type && COVER_REGISTRY.types[page.type];
  const coverBackgroundImage =
    page.data?.backgroundImage ||
    (card.bgType === 'image' ? card.bgImage : null);

  return (
    <div className="flex items-start justify-center">
      <div className="relative">
        <div
          ref={cardRef}
          className="relative select-none overflow-hidden border bg-white shadow-xl"
          style={{ width: CANVAS.width, height: CANVAS.height, borderRadius: card.radius }}
          onClick={(e) => {
            // Cek apakah click terjadi pada canvas atau area kosong di dalamnya
            const isCanvas = e.target === e.currentTarget;
            const isEmptyArea = e.target.classList.contains('relative') && e.target.classList.contains('h-full') && e.target.classList.contains('w-full');
            
            if (isCanvas || isEmptyArea) {
              e.stopPropagation();
              clearSelection();
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
                  data={page.data}
                  guestName={page.previewGuestName}
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
            <div 
              ref={innerRef} 
              className="relative h-full w-full"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  e.stopPropagation();
                  clearSelection();
                }
              }}
            >
              <GuideLines guides={guides} />
              {elements.map((el) => (
                <ElementFrame
                  key={el.id}
                  el={liveElement?.[el.id] || el}
                  selected={selectedIds.includes(el.id)}
                  boundsRef={innerRef}
                  onSelect={(e, mode) => {
                    switch (mode) {
                      case 'add':
                        addToSelection(el.id);
                        break;
                      case 'toggle':
                        toggleSelection(el.id);
                        break;
                      default:
                        setSelectedId(el.id);
                    }
                  }}
                  onDrag={(pos) => {
                    // Hitung offset dari posisi awal ke posisi baru
                    const dx = pos.x - el.x;
                    const dy = pos.y - el.y;

                    // Siapkan updates untuk elemen-elemen lain yang dipilih
                    const otherElements = selectedIds
                      .filter(id => id !== el.id)
                      .map(selectedId => {
                        const selectedEl = elements.find(e => e.id === selectedId);
                        if (selectedEl) {
                          return {
                            id: selectedId,
                            updates: {
                              x: selectedEl.x + dx,
                              y: selectedEl.y + dy
                            }
                          };
                        }
                        return null;
                      })
                      .filter(Boolean);

                    // Update elemen utama dan elemen lain yang dipilih
                    updateLiveElement(el.id, pos, otherElements);

                    const newGuides = getGuideLines(elements, { ...el, ...pos });
                    setGuides(newGuides);
                  }}
                  onDragCommit={(pos) => {
                    clearLiveElement();
                    
                    // Hitung offset dari posisi awal ke posisi baru
                    const dx = pos.x - el.x;
                    const dy = pos.y - el.y;

                    // Update semua elemen yang dipilih
                    selectedIds.forEach(selectedId => {
                      const selectedEl = elements.find(e => e.id === selectedId);
                      if (selectedEl) {
                        setElementPos(selectedId, selectedEl.x + dx, selectedEl.y + dy);
                      }
                    });
                    
                    setGuides({ vertical: [], horizontal: [] });
                  }}
                  onResize={(rect) => updateLiveElement(el.id, rect)}
                  onResizeCommit={(rect) => {
                    clearLiveElement();
                    setElementPos(el.id, rect.x, rect.y);
                    setElementSize(el.id, rect.w, rect.h);
                  }}
                  onInlineChange={(id, data) => setElementData(id, data)}
                  snapEnabled={!!snap.enabled && (selectedId === el.id)}
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

export default AdminEditorCanvas;
