import React, { useState, useEffect } from 'react';
import { photosApi } from '../api/photos';
import { useAuth } from '../contexts/AuthContext';

const Album: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<any | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ url: '', caption: '', albumName: '', className: '', takenAt: '' });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => { loadAlbums(); }, []);
  useEffect(() => {
    if (selectedAlbum !== null) {
      photosApi.getAll({ albumName: selectedAlbum }).then(setPhotos);
    }
  }, [selectedAlbum]);

  const loadAlbums = async () => {
    const data = await photosApi.getAlbums();
    setAlbums(data);
    if (data.length > 0 && selectedAlbum === null) {
      setSelectedAlbum(data[0].albumName);
    }
  };

  const handleUpload = async () => {
    if (!form.url.trim()) return;
    setUploading(true);
    try {
      await photosApi.create(form);
      setShowUpload(false);
      setForm({ url: '', caption: '', albumName: '', className: '', takenAt: '' });
      loadAlbums();
      if (selectedAlbum) photosApi.getAll({ albumName: selectedAlbum }).then(setPhotos);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除这张照片？')) return;
    await photosApi.remove(id);
    setPhotos(photos.filter(p => p.id !== id));
    loadAlbums();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">📸 班级相册</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">珍藏校园美好时光</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          + 上传照片
        </button>
      </div>

      {/* Album tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {albums.map(a => (
          <button
            key={a.albumName}
            onClick={() => setSelectedAlbum(a.albumName)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              selectedAlbum === a.albumName
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
            }`}
          >
            <img src={a.cover} alt="" className="w-6 h-6 rounded object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
            <span>{a.albumName}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedAlbum === a.albumName ? 'bg-indigo-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>{a.count}</span>
          </button>
        ))}
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">该相册暂无照片</div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {photos.map(p => (
            <div key={p.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={p.url}
                alt={p.caption || ''}
                className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setLightbox(p)}
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/err${p.id}/400/300`; }}
              />
              {p.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{p.caption}</p>
                  {p.takenAt && <p className="text-white/70 text-xs">{p.takenAt}</p>}
                </div>
              )}
              {(p.uploaderId === user?.id || user?.role === 'admin') && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="max-h-[80vh] w-full object-contain rounded-xl" />
            {lightbox.caption && (
              <div className="text-center mt-4">
                <p className="text-white">{lightbox.caption}</p>
                {lightbox.takenAt && <p className="text-white/60 text-sm">{lightbox.takenAt}</p>}
                {lightbox.uploader && <p className="text-white/50 text-sm">上传者：{lightbox.uploader.username}</p>}
              </div>
            )}
          </div>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">×</button>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">上传照片</h3>
            <div className="space-y-3">
              <input type="text" placeholder="图片URL *" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="图片描述" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="相册名称（如：2017届毕业典礼）" value={form.albumName} onChange={e => setForm({ ...form, albumName: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="班级（如：计算机科学2013级1班）" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
              <input type="date" placeholder="拍摄日期" value={form.takenAt} onChange={e => setForm({ ...form, takenAt: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowUpload(false)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 py-2 rounded-xl text-sm">取消</button>
              <button onClick={handleUpload} disabled={!form.url.trim() || uploading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-2 rounded-xl text-sm font-medium">
                {uploading ? '上传中...' : '上传'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Album;
