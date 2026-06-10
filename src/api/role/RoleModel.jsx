export function fromBackend(r) {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    accessLevels: r.access,
  };
}

export function toBackend(r) {
  return {
    name: r.name,
    description: r.description,
    accessLevels: r.access,
  };
}
