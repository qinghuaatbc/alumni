import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { alumniApi } from '../api/alumni';
import type { AlumniProfile } from '../api/alumni';
import { useAuth } from '../contexts/AuthContext';

const Field: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 dark:text-gray-200 font-medium mt-0.5">{value}</p>
    </div>
  );
};

const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await alumniApi.getAll({ limit: 1000 });
        const mine = res.items.find((p) => p.userId === user.id);
        setProfile(mine || null);
      } catch {
        // no profile
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Profile Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't created your alumni profile yet. Create one to appear in the directory and connect with classmates.
          </p>
          <Link
            to="/profile/edit"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Create My Profile
          </Link>
        </div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : '??';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <Link
          to="/profile/edit"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 flex items-end space-x-6">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/50 shadow-lg">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
          )}
          <div className="pb-1">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            {profile.profession && <p className="text-indigo-200">{profile.profession}</p>}
            {profile.company && <p className="text-indigo-300 text-sm">{profile.company}</p>}
          </div>
        </div>

        <div className="p-8">
          {profile.bio && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-8">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Education</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4">
                <Field label="School" value={profile.school} />
                <Field label="Class" value={profile.className} />
                <Field label="Student ID" value={profile.studentId} />
                <Field label="Enrollment Year" value={profile.enrollYear} />
                <Field label="Graduation Year" value={profile.graduationYear} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Career</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4">
                <Field label="Company" value={profile.company} />
                <Field label="Profession" value={profile.profession} />
                <Field label="City" value={profile.city} />
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Contact</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <Field label="Email" value={profile.email} />
                  <Field label="Phone" value={profile.phone} />
                  <Field label="WeChat" value={profile.wechat} />
                </div>
                {!profile.email && !profile.phone && !profile.wechat && (
                  <p className="text-gray-400 text-sm py-3">No contact information added yet</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Personal</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <Field label="Gender" value={profile.gender} />
                  <Field label="Birthday" value={profile.birthday} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
            <span>Profile ID: #{profile.id}</span>
            <span>Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to={`/alumni/${profile.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium">
          View public profile →
        </Link>
      </div>
    </div>
  );
};

export default MyProfile;
