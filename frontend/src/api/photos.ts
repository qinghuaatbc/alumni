import client from './client';

export const photosApi = {
  getAll: (params?: { className?: string; albumName?: string }) => client.get('/photos', { params }).then(r => r.data),
  getAlbums: () => client.get('/photos/albums').then(r => r.data),
  create: (data: { className?: string; albumName?: string; url: string; caption?: string; takenAt?: string }) =>
    client.post('/photos', data).then(r => r.data),
  remove: (id: number) => client.delete(`/photos/${id}`).then(r => r.data),
};
