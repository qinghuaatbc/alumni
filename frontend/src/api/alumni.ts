import client from './client';

export interface AlumniProfile {
  id: number;
  userId: number;
  name: string;
  gender?: string;
  birthday?: string;
  school?: string;
  className?: string;
  studentId?: string;
  enrollYear?: number;
  graduationYear?: number;
  phone?: string;
  email?: string;
  wechat?: string;
  city?: string;
  company?: string;
  profession?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniListResponse {
  items: AlumniProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlumniQuery {
  name?: string;
  className?: string;
  city?: string;
  graduationYear?: number;
  page?: number;
  limit?: number;
}

export interface AlumniStats {
  total: number;
  cityDistribution: { city: string; count: string }[];
  yearDistribution: { graduationYear: number; count: string }[];
}

export const alumniApi = {
  getAll: async (query: AlumniQuery = {}): Promise<AlumniListResponse> => {
    const params = new URLSearchParams();
    if (query.name) params.append('name', query.name);
    if (query.className) params.append('className', query.className);
    if (query.city) params.append('city', query.city);
    if (query.graduationYear) params.append('graduationYear', String(query.graduationYear));
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));

    const res = await client.get<AlumniListResponse>(`/alumni?${params.toString()}`);
    return res.data;
  },

  getOne: async (id: number): Promise<AlumniProfile> => {
    const res = await client.get<AlumniProfile>(`/alumni/${id}`);
    return res.data;
  },

  createOrUpdate: async (data: Partial<AlumniProfile>): Promise<AlumniProfile> => {
    const res = await client.post<AlumniProfile>('/alumni', data);
    return res.data;
  },

  update: async (id: number, data: Partial<AlumniProfile>): Promise<AlumniProfile> => {
    const res = await client.put<AlumniProfile>(`/alumni/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/alumni/${id}`);
  },

  getStats: async (): Promise<AlumniStats> => {
    const res = await client.get<AlumniStats>('/alumni/stats');
    return res.data;
  },

  getMyProfile: async (userId: number): Promise<AlumniProfile | null> => {
    try {
      const res = await alumniApi.getAll({ limit: 1000 });
      const mine = res.items.find((p) => p.userId === userId);
      return mine || null;
    } catch {
      return null;
    }
  },
};
