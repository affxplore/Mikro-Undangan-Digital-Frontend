// src/api/prices/PriceModel.jsx

export function fromBackend(p) {
  return {
    id: p.id,
    subscription_id: p.subscription_id,
    amount: p.amount,
    interval: p.interval,
    createdAt: p.createdAt,
  };
}

export function toBackend(p) {
  return {
    subscription_id: p.subscription_id,
    amount: p.amount,
    interval: p.interval,
  };
}