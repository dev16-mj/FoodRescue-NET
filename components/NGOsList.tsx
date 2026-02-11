
import React, { useState } from 'react';
import { MOCK_NGOS, TN_DISTRICTS } from '../constants';
import MapModal from './MapModal';
import { NGO } from '../types';

const NGOsList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [showMap, setShowMap] = useState(false);

  const filteredNGOs = MOCK_NGOS.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) || 
                          ngo.description.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity === 'All' || ngo.district === filterCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">NGOs & Charities in Tamil Nadu</h2>
        <p className="text-gray-500 text-sm mt-1">Connect with verified organizations working for social good</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Search</label>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input
              type="text"
              placeholder="Search by name or description..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full lg:w-64">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Filter by City</label>
          <select
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium text-sm"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="All">All</option>
            {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col justify-end pb-2">
           <span className="text-xs font-bold text-gray-400">
             <span className="text-gray-900 mr-1">{filteredNGOs.length}</span>
             organizations found
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNGOs.map(ngo => (
          <div key={ngo.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{ngo.name}</h3>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ngo.type === 'NGO' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {ngo.type}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mb-6 flex-1 leading-relaxed">{ngo.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <i className="fa-solid fa-location-dot text-emerald-500 w-4 text-center"></i>
                <span>{ngo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <i className="fa-solid fa-phone text-emerald-500 w-4 text-center"></i>
                <span>{ngo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <i className="fa-solid fa-envelope text-emerald-500 w-4 text-center"></i>
                <span>info@{ngo.name.toLowerCase().replace(/\s+/g, '')}.org</span>
              </div>
            </div>
            
            <button 
              onClick={() => { setSelectedNgo(ngo); setShowMap(true); }}
              className="w-full py-2 bg-emerald-800 text-white rounded-lg font-bold text-xs uppercase hover:bg-emerald-900 transition-colors"
            >
              View on Map
            </button>
          </div>
        ))}
      </div>

      {showMap && (
        <MapModal ngo={selectedNgo} allNgos={MOCK_NGOS} onClose={() => setShowMap(false)} />
      )}
    </div>
  );
};

export default NGOsList;
