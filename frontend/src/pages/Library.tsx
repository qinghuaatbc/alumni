import React, { useState, useEffect } from 'react';
import { libraryApi } from '../api/library';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['全部', '技术', '文学', '历史', '经济', '哲学'];

const categoryColor: Record<string, string> = {
  技术: 'bg-blue-100 text-blue-700',
  文学: 'bg-purple-100 text-purple-700',
  历史: 'bg-yellow-100 text-yellow-700',
  经济: 'bg-green-100 text-green-700',
  哲学: 'bg-pink-100 text-pink-700',
};

const BOOK_CATEGORIES = ['技术', '文学', '历史', '经济', '哲学', '其他'];

const emptyForm = { title: '', author: '', isbn: '', category: '技术', description: '', cover: '', publisher: '', publishYear: '', totalCopies: '1', readUrl: '', downloadUrl: '' };

const Library: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { user } = useAuth();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 18 };
      if (search) params.title = search;
      if (category !== '全部') params.category = category;
      const data = await libraryApi.getBooks(params);
      setBooks(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page, category]);
  useEffect(() => { setPage(1); fetchBooks(); }, [search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    try {
      const res = await libraryApi.uploadFile(file, setUploadProgress);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const canReadInBrowser = ext === 'pdf' || ext === 'txt';
      setForm(f => ({
        ...f,
        downloadUrl: res.url,
        readUrl: canReadInBrowser ? res.url : f.readUrl,
      }));
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || '文件上传失败');
    } finally {
      setUploadProgress(null);
    }
  };

  const openAdd = () => { setEditingBook(null); setForm(emptyForm); setSaveError(''); setShowAddForm(true); };
  const openEdit = (book: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingBook(book);
    setForm({
      title: book.title || '', author: book.author || '', isbn: book.isbn || '',
      category: book.category || '技术', description: book.description || '',
      cover: book.cover || '', publisher: book.publisher || '',
      publishYear: book.publishYear ? String(book.publishYear) : '',
      totalCopies: String(book.totalCopies || 1),
      readUrl: book.readUrl || '', downloadUrl: book.downloadUrl || '',
    });
    setSaveError(''); setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim()) { setSaveError('书名和作者为必填项'); return; }
    setSaving(true); setSaveError('');
    const payload = {
      ...form,
      publishYear: form.publishYear ? parseInt(form.publishYear) : undefined,
      totalCopies: parseInt(form.totalCopies) || 1,
      readUrl: form.readUrl || undefined,
      downloadUrl: form.downloadUrl || undefined,
    };
    try {
      if (editingBook) {
        await libraryApi.updateBook(editingBook.id, payload);
        if (selected?.id === editingBook.id) setSelected({ ...selected, ...payload });
      } else {
        await libraryApi.createBook(payload);
      }
      setShowAddForm(false); setForm(emptyForm); setEditingBook(null);
      fetchBooks();
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm(`确认删除《${book.title}》？`)) return;
    try {
      await libraryApi.deleteBook(book.id);
      if (selected?.id === book.id) setSelected(null);
      fetchBooks();
    } catch (e: any) {
      alert(e?.response?.data?.message || '删除失败');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">📖 阅览室</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">共 {total} 本书籍，免费阅览与下载</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={openAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> 添加书籍
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="搜索书名或作者..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
      />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Book grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">没有找到相关书籍</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map(book => (
            <div
              key={book.id}
              onClick={() => setSelected(book)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
            >
              <div className="relative">
                <img
                  src={book.cover || `https://picsum.photos/seed/${book.id}/200/300`}
                  alt={book.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/bk${book.id}/200/300`; }}
                />
                <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[book.category] || 'bg-gray-100 text-gray-600'}`}>
                  {book.category}
                </span>
                {/* Read/Download badges */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {book.readUrl && (
                    <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded">阅读</span>
                  )}
                  {book.downloadUrl && (
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">下载</span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-0.5">{book.title}</h3>
                <p className="text-gray-400 text-xs">{book.author}</p>
                {book.publishYear && <p className="text-gray-400 text-xs">{book.publishYear}年</p>}
                {user?.role === 'admin' && (
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => openEdit(book, e)}
                      className="flex-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 py-1 rounded-lg"
                    >编辑</button>
                    <button
                      onClick={e => handleDelete(book, e)}
                      className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 py-1 rounded-lg"
                    >删除</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Book modal (admin only) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{editingBook ? '编辑书籍' : '添加书籍'}</h3>
              <button onClick={() => { setShowAddForm(false); setSaveError(''); setForm(emptyForm); setEditingBook(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {saveError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{saveError}</div>}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">书名 *</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="例：深入理解计算机系统"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">作者 *</label>
                  <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                    placeholder="例：刘慈欣"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">分类</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white">
                    {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">ISBN</label>
                  <input type="text" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })}
                    placeholder="例：9787536692930"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">出版社</label>
                  <input type="text" value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">出版年份</label>
                  <input type="number" value={form.publishYear} onChange={e => setForm({ ...form, publishYear: e.target.value })}
                    placeholder="2024"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">封面图片URL</label>
                  <input type="text" value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })}
                    placeholder="https://covers.openlibrary.org/b/isbn/9787536692930-L.jpg"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                  <p className="text-xs text-gray-400 mt-1">💡 可用 https://covers.openlibrary.org/b/isbn/&lt;ISBN&gt;-L.jpg</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">在线阅读链接</label>
                  <input type="text" value={form.readUrl} onChange={e => setForm({ ...form, readUrl: e.target.value })}
                    placeholder="https://archive.org/details/..."
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">下载链接</label>
                  <input type="text" value={form.downloadUrl} onChange={e => setForm({ ...form, downloadUrl: e.target.value })}
                    placeholder="https://www.gutenberg.org/ebooks/..."
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white" />
                </div>

                {/* Local file upload */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">或者本地上传文件</label>
                  <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl py-4 cursor-pointer transition-colors ${uploadProgress !== null ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                    <input type="file" accept=".pdf,.epub,.mobi,.txt,.djvu" onChange={handleFileUpload} className="hidden" disabled={uploadProgress !== null} />
                    {uploadProgress !== null ? (
                      <div className="w-full px-4">
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 text-center mb-2">上传中 {uploadProgress}%</p>
                        <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : form.downloadUrl?.startsWith('http://localhost') ? (
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">✓ 文件已上传</p>
                        <p className="text-xs text-gray-400 mt-0.5 break-all px-2">{form.downloadUrl.split('/').pop()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {form.readUrl === form.downloadUrl ? '已设置：在线阅读 + 下载' : '已设置：仅下载'}
                        </p>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">点击重新上传</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="text-sm text-gray-500 dark:text-gray-400">点击选择文件</p>
                        <p className="text-xs text-gray-400 mt-0.5">支持 PDF · EPUB · MOBI · TXT · DJVU</p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">简介</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="书籍简介..."
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowAddForm(false); setSaveError(''); setForm(emptyForm); setEditingBook(null); }}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-sm">取消</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl text-sm font-medium">
                {saving ? '保存中...' : editingBook ? '保存修改' : '添加书籍'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex gap-6 p-6">
              {/* Cover */}
              <img
                src={selected.cover || `https://picsum.photos/seed/${selected.id}/200/300`}
                alt={selected.title}
                className="w-36 h-52 object-cover rounded-xl shadow flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/bk${selected.id}/200/300`; }}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[selected.category] || 'bg-gray-100 text-gray-600'}`}>
                    {selected.category}
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(null); openEdit(selected); }}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg">编辑</button>
                      <button onClick={() => handleDelete(selected)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-lg">删除</button>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">{selected.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{selected.author}</p>
                <div className="text-sm text-gray-400 mt-2 space-y-0.5">
                  {selected.publisher && <p>出版社：{selected.publisher}</p>}
                  {selected.publishYear && <p>出版年份：{selected.publishYear}年</p>}
                  {selected.isbn && <p>ISBN：{selected.isbn}</p>}
                </div>
              </div>
            </div>

            {/* Description */}
            {selected.description && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 rounded-xl p-4">{selected.description}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="px-6 pb-6 flex gap-3">
              {selected.readUrl ? (
                <a
                  href={selected.readUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  在线阅读
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  暂无在线版本
                </div>
              )}
              {selected.downloadUrl ? (
                <a
                  href={selected.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  暂无下载
                </div>
              )}
              <button onClick={() => setSelected(null)} className="px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
