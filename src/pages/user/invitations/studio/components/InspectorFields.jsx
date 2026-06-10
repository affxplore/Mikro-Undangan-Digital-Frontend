import React from 'react';
import { ALL_REGISTRY } from '../../../../../utils/InvitationBuilder';
import {
  Field,
  TextFieldFast,
  TextareaFieldFast,
  NumberField,
  ColorField,
  Button,
  Label,
  Row,
  deepClone,
} from './FormControls';
import { getByPath } from './FormControls';

export function schemaOf(el) {
  if (!el) return [];
  const base = ALL_REGISTRY[el.type]?.schema || [];
  return typeof base === 'function' ? base(el) : base;
}

export const InspectorFields = ({ schema, el, onChange }) => {
  if (!schema) return null;

  return (
    <div className="space-y-3">
      {schema.map((field) => {
        const value = getByPath(el.data, field.path, field.defaultValue);
        const key = `${el.id}:${field.path}`;

        if (field.type === 'text') {
          return <TextFieldFast key={key} label={field.label} value={value ?? ''} onChange={(v) => onChange(field.path, v)} />;
        }
        if (field.type === 'textarea') {
          return <TextareaFieldFast key={key} label={field.label} value={value ?? ''} onChange={(v) => onChange(field.path, v)} />;
        }
        if (field.type === 'number') {
          return <NumberField key={key} label={field.label} value={value ?? 0} onChange={(v) => onChange(field.path, v)} min={field.min} max={field.max} step={field.step} suffix={field.suffix} />;
        }
        if (field.type === 'color') {
          return <ColorField key={key} label={field.label} value={value ?? '#000000'} onChange={(v) => onChange(field.path, v)} />;
        }
        if (field.type === 'image') {
            return (
              <Field key={key} label={field.label}>
                <Row>
                  <input
                    readOnly
                    className="flex-1 rounded border px-2 py-1 text-gray-500"
                    value={value || ""}
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
                        const reader = new FileReader();
                        reader.onload = () => {
                          onChange(field.path, reader.result);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </Row>
              </Field>
            );
        }
        if (field.type === 'select') {
            return (
              <Field key={key} label={field.label}>
                <select
                  className="w-full rounded border p-2"
                  value={value ?? field.options?.[0]?.value}
                  onChange={(e) => onChange(field.path, e.target.value)}
                >
                  {(field.options || []).map((opt) => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                      {opt.label ?? opt}
                    </option>
                  ))}
                </select>
              </Field>
            );
        }
        if (field.type === 'toggle') {
            return (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onChange(field.path, e.target.checked)}
                />{' '}
                {field.label}
              </label>
            );
        }
        if (field.type === 'array') {
            const arr = Array.isArray(value) ? value : [];
            return (
              <div key={key} className="space-y-2">
                <Label>{field.label}</Label>
                {arr.map((item, i) => {
                  const rowKey = `${key}:${i}`;
                  return (
                    <div key={rowKey} className="rounded border bg-white/70 p-2">
                      {(field.itemSchema || []).map((sf, j) => {
                        const itemKey = `${rowKey}:${sf.key}:${j}`;
                        if (sf.type === 'text') {
                          return (
                            <TextFieldFast
                              key={itemKey}
                              label={sf.label}
                              value={item[sf.key] ?? ''}
                              onChange={(v) => {
                                const next = deepClone(arr);
                                next[i] = { ...next[i], [sf.key]: v };
                                onChange(field.path, next);
                              }}
                            />
                          );
                        }
                        if (sf.type === 'textarea') {
                          return (
                            <TextareaFieldFast
                              key={itemKey}
                              label={sf.label}
                              value={item[sf.key] ?? ''}
                              onChange={(v) => {
                                const next = deepClone(arr);
                                next[i] = { ...next[i], [sf.key]: v };
                                onChange(field.path, next);
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          className="border-gray-300 bg-white hover:border-indigo-400"
                          onClick={() => {
                            const next = arr.filter((_, idx) => i !== idx);
                            onChange(field.path, next);
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button
                  className="border-gray-300 bg-white hover:border-indigo-400"
                  onClick={() => {
                    const next = [...arr, deepClone(field.addItem)];
                    onChange(field.path, next);
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
};