import React, { useState, useEffect } from 'react';
import client from '../api/client';

interface CityData {
  city: string;
  count: number;
  alumni: { name: string; avatar: string; company: string; profession: string }[];
}

// Approximate positions (%) for Chinese cities on a simple layout
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  '北京': { x: 62, y: 22 },
  '上海': { x: 70, y: 42 },
  '深圳': { x: 62, y: 72 },
  '广州': { x: 60, y: 68 },
  '杭州': { x: 68, y: 46 },
  '成都': { x: 42, y: 52 },
  '武汉': { x: 60, y: 48 },
  '南京': { x: 67, y: 40 },
  '西安': { x: 48, y: 38 },
  '重庆': { x: 47, y: 56 },
  '天津': { x: 63, y: 24 },
  '苏州': { x: 69, y: 42 },
  '青岛': { x: 68, y: 32 },
  '长沙': { x: 58, y: 57 },
  '郑州': { x: 58, y: 38 },
  '沈阳': { x: 70, y: 14 },
  '哈尔滨': { x: 74, y: 8 },
  '南宁': { x: 56, y: 72 },
  '昆明': { x: 47, y: 68 },
  '贵阳': { x: 52, y: 63 },
};

const MapView: React.FC = () => {
  const [stats, setStats] = useState<CityData[]>([]);
  const [allAlumni, setAllAlumni] = useState<any[]>([]);
  const [selected, setSelected] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/alumni', { params: { limit: 100 } }),
    ]).then(([alumniRes]) => {
      const alumni = alumniRes.data.items || [];
      setAllAlumni(alumni);
      // Group by city
      const cityMap = new Map<string, CityData>();
      for (const a of alumni) {
        if (!a.city) continue;
        if (!cityMap.has(a.city)) {
          cityMap.set(a.city, { city: a.city, count: 0, alumni: [] });
        }
        const c = cityMap.get(a.city)!;
        c.count++;
        c.alumni.push({ name: a.name, avatar: a.avatar, company: a.company, profession: a.profession });
      }
      setStats(Array.from(cityMap.values()).sort((a, b) => b.count - a.count));
      setLoading(false);
    });
  }, []);

  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🗺️ 同学分布地图</h1>
        <p className="text-gray-500 mt-1">共有同学分布在 {stats.length} 个城市</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map visualization */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 relative" style={{ minHeight: 480 }}>
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <div className="absolute inset-0">
                {/* Simple China outline hint */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 80" className="w-full h-full opacity-10">
                    <path d="M20,15 Q35,5 55,8 Q75,10 85,20 Q90,35 85,50 Q80,65 65,72 Q50,78 35,72 Q20,65 15,50 Q10,35 20,15 Z" fill="#6366f1" />
                  </svg>
                </div>
                {/* City dots */}
                {stats.map(city => {
                  const pos = CITY_POSITIONS[city.city];
                  if (!pos) return null;
                  const size = 8 + (city.count / maxCount) * 24;
                  return (
                    <button
                      key={city.city}
                      onClick={() => setSelected(selected?.city === city.city ? null : city)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: size, height: size }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all hover:scale-125 focus:outline-none"
                      title={`${city.city} (${city.count}人)`}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                          background: selected?.city === city.city ? '#f59e0b' : '#6366f1',
                          boxShadow: `0 0 0 ${city.count * 2}px ${selected?.city === city.city ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)'}`,
                        }}
                      />
                    </button>
                  );
                })}
                {/* Labels for known cities */}
                {stats.map(city => {
                  const pos = CITY_POSITIONS[city.city];
                  if (!pos) return null;
                  return (
                    <div
                      key={`label-${city.city}`}
                      style={{ left: `${pos.x}%`, top: `${pos.y + 4}%` }}
                      className="absolute transform -translate-x-1/2 text-xs font-medium text-indigo-700 whitespace-nowrap pointer-events-none"
                    >
                      {city.city} ({city.count})
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected city popup */}
            {selected && (
              <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">📍 {selected.city} ({selected.count}人)</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.alumni.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 bg-indigo-50 rounded-lg px-2 py-1">
                      <img src={a.avatar || `https://i.pravatar.cc/30?img=${i+10}`} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* City ranking sidebar */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">城市排行</h2>
            {stats.map((city, i) => (
              <div
                key={city.city}
                onClick={() => setSelected(selected?.city === city.city ? null : city)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selected?.city === city.city ? 'bg-indigo-100 border border-indigo-300' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 text-sm">{city.city}</span>
                    <span className="text-indigo-600 font-bold text-sm">{city.count}人</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(city.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                {/* Avatars */}
                <div className="flex -space-x-1">
                  {city.alumni.slice(0, 3).map((a, j) => (
                    <img key={j} src={a.avatar || `https://i.pravatar.cc/24?img=${j+5}`} alt=""
                      className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
              </div>
            ))}
            {/* Cities without position data */}
            {stats.filter(c => !CITY_POSITIONS[c.city]).length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">其他城市</p>
                {stats.filter(c => !CITY_POSITIONS[c.city]).map(c => (
                  <div key={c.city} className="text-sm text-gray-600 py-1">{c.city}: {c.count}人</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
