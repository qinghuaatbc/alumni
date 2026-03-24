import client from './client';

export const messagesApi = {
  getConversations: () => client.get('/messages/conversations').then(r => r.data),
  getConversation: (userId: number) => client.get(`/messages/conversation/${userId}`).then(r => r.data),
  send: (toId: number, content: string) => client.post('/messages', { toId, content }).then(r => r.data),
  getUnreadCount: () => client.get('/messages/unread').then(r => r.data),
};
