import React from 'react';
import { Link } from 'react-router-dom';
import type { AlumniProfile } from '../api/alumni';

interface AlumniCardProps {
  profile: AlumniProfile;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ profile }) => {
  const initials = profile.name
    ? profile.name.slice(0, 2).toUpperCase()
    : '??';

  return (
    <Link
      to={`/alumni/${profile.id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden group"
    >
      {/* Card header with gradient */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 flex items-center space-x-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 shadow-md">
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate group-hover:text-indigo-100 transition-colors">
            {profile.name}
          </h3>
          {profile.profession && (
            <p className="text-indigo-200 text-sm truncate">{profile.profession}</p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-2">
        {profile.company && (
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{profile.company}</span>
          </div>
        )}

        {profile.city && (
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{profile.city}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {profile.className && (
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {profile.className}
            </span>
          )}
          {profile.graduationYear && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full ml-auto">
              Class of {profile.graduationYear}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AlumniCard;
