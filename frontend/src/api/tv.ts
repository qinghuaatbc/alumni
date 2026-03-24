import client from './client';

export interface TvChannel {
  id: number;
  name: string;
  category: string;
  logo: string;
  stream: string;
  website: string;
  sortOrder: number;
}

export const tvApi = {
  getChannels: () => client.get<TvChannel[]>('/tv/channels').then(r => r.data),
  create: (data: Partial<TvChannel>) => client.post<TvChannel>('/tv/channels', data).then(r => r.data),
  update: (id: number, data: Partial<TvChannel>) => client.put<TvChannel>(`/tv/channels/${id}`, data).then(r => r.data),
  remove: (id: number) => client.delete(`/tv/channels/${id}`),
};
