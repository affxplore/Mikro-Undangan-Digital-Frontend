import React from 'react';
import { ALL_REGISTRY } from '../../../../../utils/InvitationBuilder';

// Hooks drag & resize (dari V2)
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function useDraggableRect(el, boundsRef, enabled = true, onCommit, onDrag, snapEnabled = true, snapSize = 5) {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState({ x: el.x, y: el.y });
  const rafRef = React.useRef(0);
  const nextRef = React.useRef({ x: el.x, y: el.y });
  const draggingRef = React.useRef(false);
  React.useEffect(() => setPos({ x: el.x, y: el.y }), [el.x, el.y]);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let active = false, sx = 0, sy = 0, ox = 0, oy = 0;
    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setPos(nextRef.current);
      });
    };
    const down = (e) => {
      const isDbl = (e.detail && e.detail >= 2); if (!enabled && !isDbl) return;
      if (e.button === 2) return;
      active = true;
      draggingRef.current = true;
      node.setPointerCapture?.(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = pos.x; oy = pos.y;
    };
    const move = (e) => {
      if (!active) return;
      const b = boundsRef?.current?.getBoundingClientRect?.();
      let nx = ox + (e.clientX - sx);
      let ny = oy + (e.clientY - sy);
      if (b) {
        nx = clamp(nx, 0, Math.max(0, b.width - el.w));
        ny = clamp(ny, 0, Math.max(0, b.height - el.h));
      }
      // Follow the cursor precisely; no snap while dragging for buttery feel
      nextRef.current = { x: nx, y: ny };
      onDrag?.(nextRef.current);
      schedule();
    };
    const up = (e) => {
      if (!active) return;
      active = false;
      draggingRef.current = false;
      node.releasePointerCapture?.(e.pointerId);

      const finalPos = { ...nextRef.current };
      if (snapEnabled) {
        finalPos.x = Math.round(finalPos.x / snapSize) * snapSize;
        finalPos.y = Math.round(finalPos.y / snapSize) * snapSize;
      }
      onCommit?.(finalPos);
    };
    node.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      node.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pos, boundsRef, enabled, el.w, el.h, onCommit, onDrag, snapEnabled, snapSize]);

  return { ref, pos, dragging: draggingRef.current };
}

function useResizable(el, boundsRef, enabled = true, onCommit, onResize, snapEnabled = true, snapSize = 5) {
  const [size, setSize] = React.useState({ w: el.w, h: el.h, x: el.x, y: el.y });
  const rafRef = React.useRef(0);
  const nextRef = React.useRef({ ...size });
  React.useEffect(() => setSize({ w: el.w, h: el.h, x: el.x, y: el.y }), [el.w, el.h, el.x, el.y]);
  function start(dir, e) {
    const isDbl = (e.detail && e.detail >= 2); if (!enabled && !isDbl) return;
    const b = boundsRef?.current?.getBoundingClientRect?.();
    const sx = e.clientX, sy = e.clientY;
    const { w: ow, h: oh, x: ox, y: oy } = size;
    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setSize(nextRef.current);
      });
    };
    const mm = (ev) => {
      let dx = ev.clientX - sx, dy = ev.clientY - sy;
      let nx = ox, ny = oy, nw = ow, nh = oh;
      if (dir.includes('e')) nw = clamp(ow + dx, 10, b ? b.width - ox : 9999);
      if (dir.includes('s')) nh = clamp(oh + dy, 10, b ? b.height - oy : 9999);
      if (dir.includes('w')) { nx = clamp(ox + dx, 0, ox + ow - 10); nw = ow - (nx - ox); }
      if (dir.includes('n')) { ny = clamp(oy + dy, 0, oy + oh - 10); nh = oh - (ny - oy); }
      const snap = ev.shiftKey ? 1 : (snapEnabled ? snapSize : 1);
      nx = Math.round(nx / snap) * snap; ny = Math.round(ny / snap) * snap;
      nw = Math.round(nw / snap) * snap; nh = Math.round(nh / snap) * snap;
      nextRef.current = { x: nx, y: ny, w: nw, h: nh };
      onResize?.(nextRef.current);
      schedule();
    };
    const up = () => {
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('pointerup', up);
      onCommit?.(nextRef.current);
    };
    window.addEventListener('pointermove', mm, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
  }
  return { size, start };
}


export default function ElementFrame({ el, selected, boundsRef, onSelect, onDrag, onDragCommit, onResize, onResizeCommit, onInlineChange, snapEnabled = true, snapSize = 5 }) {
  const handleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from reaching canvas
    if (e.shiftKey) {
      // Shift+Click: Add to selection
      onSelect(e, 'add');
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+Click: Toggle selection
      onSelect(e, 'toggle');
    } else {
      // Normal click: Single select
      onSelect(e, 'single');
    }
  };
  const { ref, pos, dragging } = useDraggableRect(
    el,
    boundsRef,
    !selected || el.type !== 'text',
    (p) => onDragCommit(p),
    (p) => onDrag?.(p),
    snapEnabled,
    snapSize
  );
  const { size, start } = useResizable({ ...el, x: pos.x, y: pos.y }, boundsRef, true, (rect) => onResizeCommit(rect), (rect) => onResize?.(rect), snapEnabled, snapSize);
  const [editing, setEditing] = React.useState(false);
  const updateInline = (next) => onInlineChange?.(el.id, next?.data || {});

  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: size.w,
        height: size.h,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        willChange: dragging ? 'transform' : 'auto',
        cursor: editing ? 'text' : 'move',
        touchAction: 'none',
      }}
      onMouseDown={handleSelect}
      onDoubleClick={(e) => {
        // Double click: pastikan tidak masuk mode edit teks
        e.preventDefault();
        setEditing(false);
      }}
      onBlur={() => setEditing(false)}
      tabIndex={0}
    >
      <div className="h-full w-full">
        {ALL_REGISTRY[el.type]?.Render ? (
          ALL_REGISTRY[el.type].Render({ el, editing, updateInline })
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-600">Unknown: {el.type}</div>
        )}
      </div>
      {selected && (
        <div className="pointer-events-none absolute inset-0" data-export-exclude>
          <div className="absolute inset-0 border-2 border-indigo-500/70" />
          {['nw', 'ne', 'sw', 'se'].map((dir) => (
            <div
              key={dir}
              className="pointer-events-auto absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded border border-indigo-600 bg-white"
              style={{ cursor: `${dir}-resize`, left: dir.includes('w') ? 0 : '100%', top: dir.includes('n') ? 0 : '100%' }}
              onPointerDown={(e) => {
                e.stopPropagation();
                start(dir, e);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}