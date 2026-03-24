import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { tvApi } from '../api/tv';
import type { TvChannel } from '../api/tv';
import { useAuth } from '../contexts/AuthContext';

const PROXY = 'http://localhost:3000/proxy/m3u8?url=';
const proxyUrl = (s: string) => PROXY + encodeURIComponent(s);

const CATEGORIES = ['全部', '央视', '卫视', '地方', '其他'];

const categoryColor: Record<string, string> = {
  '央视': 'bg-red-100 text-red-700',
  '卫视': 'bg-blue-100 text-blue-700',
  '地方': 'bg-green-100 text-green-700',
  '其他': 'bg-gray-100 text-gray-700',
};

const EMPTY_FORM = { name: '', category: '卫视', logo: '', stream: '', website: '', sortOrder: 0 };

const TV: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [channels, setChannels] = useState<TvChannel[]>([]);
  const [category, setCategory] = useState('全部');
  const [current, setCurrent] = useState<TvChannel | null>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Admin modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TvChannel | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await tvApi.getChannels();
    setChannels(data);
    if (data.length > 0 && !current) setCurrent(data[0]);
  };

  useEffect(() => { load(); }, []);

  const filtered = channels.filter(c => category === '全部' || c.category === category);

  const playChannel = (ch: TvChannel) => {
    setCurrent(ch);
    setStatus('loading');
  };

  useEffect(() => {
    if (!current || !videoRef.current) return;
    const video = videoRef.current;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const src = proxyUrl(current.stream);

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); setStatus('playing'); });
      hls.on(Hls.Events.ERROR, (_e, data) => { if (data.fatal) setStatus('error'); });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => { video.play(); setStatus('playing'); });
      video.addEventListener('error', () => setStatus('error'));
    } else {
      setStatus('error');
    }

    return () => { hlsRef.current?.destroy(); hlsRef.current = null; };
  }, [current]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (ch: TvChannel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(ch);
    setForm({ name: ch.name, category: ch.category, logo: ch.logo || '', stream: ch.stream, website: ch.website || '', sortOrder: ch.sortOrder });
    setShowModal(true);
  };

  const handleDelete = async (ch: TvChannel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`删除频道「${ch.name}」？`)) return;
    await tvApi.remove(ch.id);
    if (current?.id === ch.id) setCurrent(null);
    load();
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.stream.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await tvApi.update(editing.id, form);
      } else {
        await tvApi.create(form);
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const usedCategories = ['全部', ...Array.from(new Set(channels.map(c => c.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">📺 电视厅</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">国内知名电视台直播</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + 添加频道
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Player */}
        <div className="flex-1 min-w-0">
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            {current ? (
              <>
                <video ref={videoRef} className="w-full h-full" controls playsInline
                  style={{ display: status === 'error' ? 'none' : 'block' }} />
                {status === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3" />
                    <p className="text-sm">正在加载 {current.name}...</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="text-5xl mb-4">📡</div>
                    <p className="text-lg font-semibold mb-2">信号暂时中断</p>
                    <p className="text-sm text-gray-400 mb-6">直播流暂不可用，可前往官网观看</p>
                    {current.website && (
                      <a href={current.website} target="_blank" rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                        前往 {current.name} 官网 →
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>{channels.length === 0 ? '暂无频道，管理员可添加' : '请选择频道'}</p>
              </div>
            )}
          </div>

          {current && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {current.logo && (
                  <img src={current.logo} alt={current.name}
                    className="w-10 h-10 rounded-lg object-contain bg-gray-100 p-1"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{current.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[current.category] || 'bg-gray-100 text-gray-700'}`}>{current.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button onClick={e => openEdit(current, e)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                      编辑
                    </button>
                    <button onClick={e => handleDelete(current, e)}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      删除
                    </button>
                  </>
                )}
                {current.website && (
                  <a href={current.website} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                    官网 →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Channel list */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="flex gap-2 mb-3 flex-wrap">
            {usedCategories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map(ch => (
              <div key={ch.id} className="relative group">
                <button onClick={() => playChannel(ch)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    current?.id === ch.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {ch.logo ? (
                    <img src={ch.logo} alt={ch.name}
                      className={`w-9 h-9 rounded-lg object-contain flex-shrink-0 ${current?.id === ch.id ? 'bg-white/20' : 'bg-gray-100'} p-1`}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${current?.id === ch.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      TV
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${current?.id === ch.id ? 'text-white' : 'text-gray-900'}`}>{ch.name}</p>
                    <span className={`text-xs ${current?.id === ch.id ? 'text-indigo-200' : 'text-gray-400'}`}>{ch.category}</span>
                  </div>
                  {current?.id === ch.id && status === 'playing' && (
                    <span className="flex-shrink-0 flex gap-0.5">
                      {[1,2,3].map(i => (
                        <span key={i} className="w-0.5 bg-white rounded-full animate-pulse"
                          style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </button>
                {isAdmin && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
                    <button onClick={e => openEdit(ch, e)}
                      className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs text-indigo-600 hover:bg-indigo-50 shadow-sm">
                      编辑
                    </button>
                    <button onClick={e => handleDelete(ch, e)}
                      className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50 shadow-sm">
                      删除
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-5 dark:text-gray-100">{editing ? '编辑频道' : '添加频道'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">频道名称 *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="如：CCTV-1 综合" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.filter(c => c !== '全部').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">直播流地址 * <span className="text-gray-400 font-normal">(M3U8 URL)</span></label>
                  <input value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="https://example.com/live/channel.m3u8" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">台标图片 URL <span className="text-gray-400 font-normal">(可选)</span></label>
                  <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/logo.png" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">官网地址 <span className="text-gray-400 font-normal">(可选)</span></label>
                  <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://tv.cctv.com/" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">排序 <span className="text-gray-400 font-normal">(数字越小越靠前)</span></label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  取消
                </button>
                <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.stream.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TV;
