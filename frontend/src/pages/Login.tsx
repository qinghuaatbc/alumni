import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, lang, toggleLang, theme, toggleTheme } = useSettings();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const loginAs = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      login(res.access_token, res.user);
      navigate('/');
    } catch {
      setError(t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError(t('fill_all')); return; }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.access_token, res.user);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        <button onClick={toggleTheme} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm transition-colors">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleLang} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
          {lang === 'zh' ? 'EN' : '中'}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">华北电力大学无线871</h1>
          <p className="text-indigo-300 mt-2 text-sm">{t('sign_in_subtitle')}</p>
          <p className="mt-3 text-sm bg-white/10 rounded-xl px-4 py-2 text-white/80 backdrop-blur-sm">
            {lang === 'zh'
              ? <>可用 <span className="font-bold text-white">guest / guest</span> 体验访问</>
              : <>Try <span className="font-bold text-white">guest / guest</span> to explore</>
            }
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('sign_in')}</h2>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('username')}</label>
              <input type="text" name="username" value={form.username} onChange={handleChange}
                placeholder={t('username_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('password')}</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder={t('password_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
              {loading ? t('signing_in') : t('sign_in')}
            </button>
          </form>
          {/* Guest account */}
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">
              {lang === 'zh' ? '体验账号（点击一键登录）' : 'Demo account (click to login)'}
            </p>
            <button onClick={() => loginAs('guest', 'guest')}
              className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 transition-colors group">
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">guest / guest</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lang === 'zh' ? '无需注册，点击直接体验' : 'No registration needed'}</p>
              </div>
              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg">
                {lang === 'zh' ? '访客' : 'Guest'}
              </span>
            </button>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
            {t('no_account')}{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium">{t('go_register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
