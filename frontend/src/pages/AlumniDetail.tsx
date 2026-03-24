import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { alumniApi } from '../api/alumni';
import type { AlumniProfile } from '../api/alumni';
import { useAuth } from '../contexts/AuthContext';
import { commentsApi } from '../api/comments';

const InfoRow: React.FC<{ label: string; value?: string | number | null; icon?: React.ReactNode }> = ({ label, value, icon }) => {
  if (!value) return null;
  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      {icon && <div className="text-indigo-500 mt-0.5 flex-shrink-0">{icon}</div>}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-gray-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const AlumniDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const data = await alumniApi.getOne(Number(id));
        setProfile(data);
      } catch {
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleDelete = async () => {
    if (!profile || !window.confirm('Are you sure you want to delete this profile?')) return;
    setDeleting(true);
    try {
      await alumniApi.delete(profile.id);
      navigate('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete profile');
      setDeleting(false);
    }
  };

  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (profile) {
      commentsApi.getByProfile(profile.id).then(setComments);
    }
  }, [profile]);

  const handlePostComment = async () => {
    if (!commentInput.trim() || !profile) return;
    setPosting(true);
    try {
      const c = await commentsApi.create(profile.id, commentInput.trim());
      setComments([c, ...comments]);
      setCommentInput('');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (cid: number) => {
    await commentsApi.remove(cid);
    setComments(comments.filter(c => c.id !== cid));
  };

  const isOwner = user && profile && user.id === profile.userId;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Profile not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Directory</Link>
      </div>
    );
  }

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : '??';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 group">
        <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Directory
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-40 relative">
          <div className="absolute bottom-0 left-8 translate-y-1/2">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-indigo-200 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-indigo-700 font-bold text-3xl">{initials}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {!isOwner && profile && (
              <Link
                to={`/messages/${profile.userId}`}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                💬 私信
              </Link>
            )}
            {isOwner && (
              <Link
                to="/profile/edit"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>

        {/* Profile content */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              {profile.profession && (
                <p className="text-indigo-600 font-medium mt-1">{profile.profession}</p>
              )}
              {profile.company && (
                <p className="text-gray-500 text-sm mt-0.5">{profile.company}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {profile.className && (
                <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full border border-indigo-100">
                  {profile.className}
                </span>
              )}
              {profile.graduationYear && (
                <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  Class of {profile.graduationYear}
                </span>
              )}
              {profile.gender && (
                <span className="bg-pink-50 text-pink-600 text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {profile.gender}
                </span>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>Education</span>
              </h2>
              <div className="bg-gray-50 rounded-xl px-4">
                <InfoRow label="School" value={profile.school} />
                <InfoRow label="Class" value={profile.className} />
                <InfoRow label="Student ID" value={profile.studentId} />
                <InfoRow label="Enrollment Year" value={profile.enrollYear} />
                <InfoRow label="Graduation Year" value={profile.graduationYear} />
              </div>
            </div>

            {/* Career */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Career</span>
              </h2>
              <div className="bg-gray-50 rounded-xl px-4">
                <InfoRow label="Company" value={profile.company} />
                <InfoRow label="Profession" value={profile.profession} />
                <InfoRow label="City" value={profile.city} />
              </div>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </h2>
              <div className="bg-gray-50 rounded-xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                  {profile.email && <InfoRow label="Email" value={profile.email} />}
                  {profile.phone && <InfoRow label="Phone" value={profile.phone} />}
                  {profile.wechat && <InfoRow label="WeChat" value={profile.wechat} />}
                </div>
                {!profile.email && !profile.phone && !profile.wechat && (
                  <p className="text-gray-400 text-sm py-3">No contact information shared</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">💬 留言板 ({comments.length})</h2>
        {/* Post comment */}
        <div className="flex gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePostComment()}
              placeholder="留下你的祝福或留言..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handlePostComment}
              disabled={!commentInput.trim() || posting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {posting ? '...' : '发送'}
            </button>
          </div>
        </div>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">暂无留言，来第一个留言吧！</p>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                  {c.author?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900">{c.author?.username}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span>
                      {(c.authorId === user?.id || isAdmin) && (
                        <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-red-400 hover:text-red-600">删除</button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDetail;
