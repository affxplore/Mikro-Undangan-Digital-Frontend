import React from 'react';

// UTILITIES
export const deepClone = (v) => (v ? JSON.parse(JSON.stringify(v)) : v);
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export const setByPath = (obj, path, value) => {
  const keys = path.split('.');
  const last = keys.pop();
  let cur = obj;
  for (const k of keys) {
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[last] = value;
  return obj;
};

export const getByPath = (obj, path, fallback) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? fallback;

export function useDebounced(fn, ms = 150) {
  const timer = React.useRef();
  return React.useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms],
  );
}

// GENERIC FORM COMPONENTS
export const Label = ({ children }) => <div className="text-sm font-medium text-gray-700">{children}</div>;
export const Row = ({ children, className = '' }) => <div className={`flex items-center gap-2 ${className}`}>{children}</div>;
export const Field = ({ label, children }) => (
  <div className="flex w-full flex-col gap-1 text-sm">
    <span className="text-gray-600">{label}</span>
    {children}
  </div>
);
export const Button = ({ className = '', type = 'button', ...props }) => (
  <button type="button" {...props} className={`rounded border px-2.5 py-1.5 text-sm ${className}`} />
);

export const ColorField = ({ label, value, onChange }) => (
  <Field label={label}>
    <Row>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-28 rounded border px-2 py-1" />
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-8 rounded border" />
    </Row>
  </Field>
);

export function TextFieldFast({ label, value, onChange, placeholder = '' }) {
  const [local, setLocal] = React.useState(value ?? '');
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) setLocal(value ?? '');
  }, [value]);
  const debounced = useDebounced(onChange, 120);
  return (
    <Field label={label}>
      <input
        ref={inputRef}
        className="w-full rounded border p-2"
        value={local}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          setLocal(next);
          debounced(next);
        }}
        onBlur={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextareaFieldFast({ label, value, onChange, placeholder = '' }) {
  const [local, setLocal] = React.useState(value ?? '');
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) setLocal(value ?? '');
  }, [value]);
  const debounced = useDebounced(onChange, 120);
  return (
    <Field label={label}>
      <textarea
        ref={inputRef}
        className="min-h-[72px] w-full rounded border p-2"
        value={local}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          setLocal(next);
          debounced(next);
        }}
        onBlur={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  scrub = true,
  className = '',
  suffix = '',
}) {
  const [display, setDisplay] = React.useState(String(value ?? 0));
  React.useEffect(() => setDisplay(String(value ?? 0)), [value]);

  const commit = React.useCallback(
    (text) => {
      let next = Number(text);
      if (Number.isNaN(next)) next = Number(value) || 0;
      next = clamp(next, min, max);
      onChange(next);
    },
    [min, max, onChange, value],
  );
  const debouncedCommit = useDebounced(commit, 120);

  function bump(delta) {
    const next = (Number(display) || 0) + delta;
    const clamped = clamp(next, min, max);
    setDisplay(String(clamped));
    onChange(clamped);
  }

  function onWheel(e) {
    if (!scrub) return;
    e.preventDefault();
    bump(e.deltaY > 0 ? -step : step);
  }

  return (
    <Field label={label}>
      <div className={`flex items-center gap-2 ${className}`} onWheel={onWheel}>
        <input
          className="w-full rounded border px-2 py-1"
          value={display}
          onChange={(e) => {
            const next = e.target.value;
            setDisplay(next);
            debouncedCommit(next);
          }}
          onBlur={(e) => commit(e.target.value)}
        />
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </div>
    </Field>
  );
}

export function SliderField({ label, value, min, max, step, onChange }) {
  return (
    <Field label={label}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}
