// src/api/systemMessage/SystemMessageModel.js

export function fromBackend(apiData) {
  return {
    id: apiData.id,
    title: apiData.title,
    content: apiData.content,
<<<<<<< HEAD
=======
    name: apiData.name,
    email: apiData.email,
    message: apiData.message,
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export function toBackend(formData) {
  return {
    title: formData.title,
    content: formData.content,
<<<<<<< HEAD
=======
    name: formData.name,
    email: formData.email,
    message: formData.message,
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  };
}
