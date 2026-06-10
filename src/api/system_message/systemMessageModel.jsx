// src/api/systemMessage/SystemMessageModel.js

export function fromBackend(apiData) {
  return {
    id: apiData.id,
    title: apiData.title,
    content: apiData.content,
    name: apiData.name,
    email: apiData.email,
    message: apiData.message,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export function toBackend(formData) {
  return {
    title: formData.title,
    content: formData.content,
    name: formData.name,
    email: formData.email,
    message: formData.message,
  };
}
