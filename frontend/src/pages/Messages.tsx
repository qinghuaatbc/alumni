import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagesApi } from '../api/messages';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    // Load alumni to start new conversations
    client.get('/alumni', { params: { limit: 100 } }).then(r => setUsers(r.data.items || []));
  }, []);

  useEffect(() => {
    if (userId) {
      loadConversation(parseInt(userId));
    }
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (otherId: number) => {
    const data = await messagesApi.getConversation(otherId);
    setMessages(data);
    // Find other user info
    const conv = conversations.find(c => c.user?.id === otherId);
    if (conv) setSelectedUser(conv.user);
    else {
      const u = users.find(u => u.userId === otherId || u.id === otherId);
      if (u) setSelectedUser(u);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;
    await messagesApi.send(parseInt(userId), input.trim());
    setInput('');
    loadConversation(parseInt(userId));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">💬 私信</h1>
      <div className="flex gap-4 h-[600px] bg-white rounded-2xl shadow overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-700">会话列表</div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-400 mt-8 text-sm">加载中...</p>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-400 mt-8 text-sm">暂无会话</p>
            ) : (
              conversations.map(c => (
                <div
                  key={c.user?.id}
                  onClick={() => navigate(`/messages/${c.user?.id}`)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${userId === String(c.user?.id) ? 'bg-indigo-50' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                    {c.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm text-gray-900 truncate">{c.user?.username}</p>
                      {c.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{c.unread}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{c.lastMessage?.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Start new conversation */}
          <div className="p-3 border-t border-gray-100">
            <select
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600"
              onChange={e => { if (e.target.value) navigate(`/messages/${e.target.value}`); }}
              defaultValue=""
            >
              <option value="" disabled>发起新对话...</option>
              {users
                .filter(u => u.userId !== user?.id)
                .map(u => (
                  <option key={u.userId} value={u.userId}>{u.name}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Chat area */}
        {userId ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-700">
              {selectedUser ? `与 ${selectedUser.username} 的对话` : '对话'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => {
                const isMe = m.fromId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                      {m.content}
                      <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="输入消息..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-3">💬</div>
              <p>选择一个会话开始聊天</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
