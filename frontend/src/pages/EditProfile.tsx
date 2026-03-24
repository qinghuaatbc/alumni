import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumniApi } from '../api/alumni';
import type { AlumniProfile } from '../api/alumni';
import { useAuth } from '../contexts/AuthContext';

const currentYear = new Date().getFullYear();

const InputField: React.FC<{
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}> = ({ label, name, value, onChange, type = 'text', placeholder, required, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingProfileId, setExistingProfileId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthday: '',
    school: '',
    className: '',
    studentId: '',
    enrollYear: '',
    graduationYear: '',
    phone: '',
    email: '',
    wechat: '',
    city: '',
    company: '',
    profession: '',
    avatar: '',
    bio: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const res = await alumniApi.getAll({ limit: 1000 });
        const mine = res.items.find((p) => p.userId === user.id);
        if (mine) {
          setExistingProfileId(mine.id);
          setForm({
            name: mine.name || '',
            gender: mine.gender || '',
            birthday: mine.birthday || '',
            school: mine.school || '',
            className: mine.className || '',
            studentId: mine.studentId || '',
            enrollYear: mine.enrollYear ? String(mine.enrollYear) : '',
            graduationYear: mine.graduationYear ? String(mine.graduationYear) : '',
            phone: mine.phone || '',
            email: mine.email || '',
            wechat: mine.wechat || '',
            city: mine.city || '',
            company: mine.company || '',
            profession: mine.profession || '',
            avatar: mine.avatar || '',
            bio: mine.bio || '',
          });
        }
      } catch {
        // new profile
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload: any = {
        name: form.name,
        gender: form.gender || undefined,
        birthday: form.birthday || undefined,
        school: form.school || undefined,
        className: form.className || undefined,
        studentId: form.studentId || undefined,
        enrollYear: form.enrollYear ? Number(form.enrollYear) : undefined,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        wechat: form.wechat || undefined,
        city: form.city || undefined,
        company: form.company || undefined,
        profession: form.profession || undefined,
        avatar: form.avatar || undefined,
        bio: form.bio || undefined,
      };

      let saved: AlumniProfile;
      if (existingProfileId) {
        saved = await alumniApi.update(existingProfileId, payload);
      } else {
        saved = await alumniApi.createOrUpdate(payload);
        setExistingProfileId(saved.id);
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{existingProfileId ? 'Edit Profile' : 'Create Profile'}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {existingProfileId ? 'Update your alumni profile information' : 'Complete your profile to appear in the alumni directory'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Personal info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <InputField label="Birthday" name="birthday" value={form.birthday} onChange={handleChange} type="date" />
            <InputField label="Avatar URL" name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell your classmates about yourself..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="School" name="school" value={form.school} onChange={handleChange} placeholder="Your school name" />
            <InputField label="Class Name" name="className" value={form.className} onChange={handleChange} placeholder="e.g. Class 2018-A" />
            <InputField label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} placeholder="Your student ID" />
            <div />
            <InputField label="Enrollment Year" name="enrollYear" value={form.enrollYear} onChange={handleChange} type="number" placeholder={String(currentYear - 4)} min={1950} max={currentYear} />
            <InputField label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} type="number" placeholder={String(currentYear)} min={1950} max={currentYear + 10} />
          </div>
        </div>

        {/* Career */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">Career & Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Where do you work?" />
            <InputField label="Profession / Title" name="profession" value={form.profession} onChange={handleChange} placeholder="Your job title or field" />
            <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Where do you live?" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">Contact Information</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Only shared with authenticated members of the directory</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" placeholder="contact@email.com" />
            <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
            <InputField label="WeChat ID" name="wechat" value={form.wechat} onChange={handleChange} placeholder="Your WeChat ID" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors"
          >
            {saving ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Saving...</span>
              </span>
            ) : (existingProfileId ? 'Save Changes' : 'Create Profile')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
