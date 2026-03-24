import client from './client';

export const libraryApi = {
  getBooks: (params?: any) => client.get('/library/books', { params }).then(r => r.data),
  getBook: (id: number) => client.get(`/library/books/${id}`).then(r => r.data),
  createBook: (data: any) => client.post('/library/books', data).then(r => r.data),
  updateBook: (id: number, data: any) => client.put(`/library/books/${id}`, data).then(r => r.data),
  deleteBook: (id: number) => client.delete(`/library/books/${id}`).then(r => r.data),
  borrowBook: (id: number) => client.post(`/library/books/${id}/borrow`).then(r => r.data),
  returnBook: (id: number) => client.post(`/library/books/${id}/return`).then(r => r.data),
  getMyBorrows: () => client.get('/library/borrows/my').then(r => r.data),
  uploadFile: (file: File, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append('file', file);
    return client.post('/library/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => onProgress?.(Math.round((e.loaded * 100) / (e.total || 1))),
    }).then(r => r.data as { url: string; filename: string; size: number });
  },
};
