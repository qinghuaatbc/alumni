import client from './client';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export const authApi = {
  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await client.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: { username: string; password: string }): Promise<AuthResponse> => {
    const res = await client.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  getProfile: async (): Promise<AuthUser> => {
    const res = await client.get<AuthUser>('/auth/profile');
    return res.data;
  },
};
