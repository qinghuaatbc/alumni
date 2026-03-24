import client from './client';

export const commentsApi = {
  getByProfile: (profileId: number) => client.get('/comments', { params: { profileId } }).then(r => r.data),
  create: (profileId: number, content: string) => client.post('/comments', { profileId, content }).then(r => r.data),
  remove: (id: number) => client.delete(`/comments/${id}`).then(r => r.data),
};
