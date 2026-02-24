
import React, { useState, useMemo } from 'react';
import { TN_DISTRICTS, WASTE_STATS, MONTHS } from '../constants';
import { FoodItem } from '../types';

interface StatsDashboardProps {
  foodItems?: FoodItem[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ foodItems = [] }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [filterYear] = useState('2024');

  // Highlights (Network Hotspots) - Updated to prioritize districts with actual rescue activity
  const topDistricts = useMemo(() => {
    const summary: Record<string, { rate: number, rescueCount: number }> = {};
    
    // Base static data
    WASTE_STATS.forEach(stat => {
      const rate = parseFloat(stat.rate);
      if (!summary[stat.district]) summary[stat.district] = { rate: 0, rescueCount: 0 };
      summary[stat.district].rate += rate / 12;
    });

    // Layer on actual app data (Real-time weight)
    foodItems.forEach(item => {
      // Find district from location string (rough match)
      const district = TN_DISTRICTS.find(d => item.location.toLowerCase().includes(d.toLowerCase()));
      if (district && summary[district]) {
        summary[district].rescueCount += 1;
      }
    });

    return Object.entries(summary)
      .map(([name, data]) => ({
        name,
        rate: data.rate.toFixed(1),
        rescueCount: data.rescueCount,
        // Score: Higher waste + Higher rescue count = Hotspot
        score: data.rate + (data.rescueCount * 5) 
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((d, i) => ({ ...d, rank: i + 1 }));
  }, [foodItems]);

  const tableData = useMemo(() => {
    return WASTE_STATS.filter(s => 
      s.year === parseInt(filterYear) && 
      (selectedDistrict === 'All Districts' || s.district === selectedDistrict) &&
      (selectedDistrict !== 'All Districts' ? true : s.month === selectedMonth)
    );
  }, [selectedDistrict, selectedMonth, filterYear]);

  const getRateColor = (rateStr: string) => {
    const val = parseFloat(rateStr);
    if (val >= 18) return 'text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg ring-1 ring-rose-100';
    if (val >= 15) return 'text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg ring-1 ring-orange-100';
    return 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg ring-1 ring-emerald-100';
  };

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Intelligence Hub</h2>
          <p className="text-gray-500 text-base mt-2 font-medium">Regional waste analytics and chronological reporting feed.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Network Feed</p>
              <p className="text-sm font-black text-emerald-600">Sync Active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
               <i className="fa-solid fa-bolt-lightning"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl flex flex-wrap gap-8 items-end">
        <div className="w-full lg:w-96">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">District Explorer</label>
          <div className="relative">
            <select 
              className="w-full pl-6 pr-12 py-4 bg-gray-50/50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-black text-gray-800 text-sm appearance-none cursor-pointer"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="All Districts">All Districts (Global View)</option>
              {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <i className="fa-solid fa-location-crosshairs absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
          </div>
        </div>
        
        <div className="w-full lg:w-64">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Target Month</label>
          <div className="relative">
            <select 
              className="w-full pl-6 pr-12 py-4 bg-gray-50/50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-black text-gray-800 text-sm appearance-none cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <i className="fa-solid fa-calendar absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
          </div>
        </div>

        <div className="flex-1 flex justify-end pb-2">
           <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
             <i className="fa-solid fa-magnifying-glass-chart text-emerald-500"></i>
             <span>{tableData.length} records synced</span>
           </div>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="h-0.5 flex-1 bg-gray-100"></div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em]">Live Impact Hotspots</h3>
           </div>
           <div className="h-0.5 flex-1 bg-gray-100"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {topDistricts.map(d => (
            <div key={d.name} className="group relative bg-white p-8 rounded-[48px] border border-gray-100 text-center flex flex-col items-center hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg group-hover:bg-emerald-600 transition-colors">
                RANK #{d.rank}
              </div>
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-400 mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                <i className="fa-solid fa-bolt-lightning text-xl"></i>
              </div>
              <h4 className="text-base font-black text-gray-900 mb-3 truncate w-full">{d.name}</h4>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xl mb-1">
                {d.rescueCount > 0 ? (
                   <span className="bg-emerald-50 text-[10px] px-2 py-0.5 rounded-full ring-1 ring-emerald-100">+ {d.rescueCount} Rescues</span>
                ) : (
                   <span className="text-rose-500">{d.rate}% Waste</span>
                )}
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Activity Score: {Math.floor(d.score)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white border border-gray-100 rounded-[56px] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-12 py-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
               <i className="fa-solid fa-list-check"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detailed Ledger</p>
              <p className="text-lg font-black text-gray-900">Chronological Reporting Feed</p>
            </div>
          </div>
          <div className="flex gap-8 hidden md:flex">
             <LegendItem color="bg-rose-500" label="Critical" />
             <LegendItem color="bg-orange-500" label="Elevated" />
             <LegendItem color="bg-emerald-500" label="Standard" />
          </div>
        </div>
        
        <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl shadow-sm">
              <tr className="border-b border-gray-50 text-gray-400 font-black uppercase tracking-[0.15em] text-[10px]">
                <th className="py-6 px-12">District Hub</th>
                <th className="py-6 px-12">Reporting Month</th>
                <th className="py-6 px-12">Waste Efficiency</th>
                <th className="py-6 px-12">Output (Tons)</th>
                <th className="py-6 px-12 text-right">Population Base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, idx) => (
                <tr 
                  key={`${row.district}-${row.month}-${idx}`} 
                  className={`group hover:bg-emerald-50/10 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/5'}`}
                >
                  <td className="py-6 px-12 font-black text-gray-800">{row.district}</td>
                  <td className="py-6 px-12">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1 rounded-full">
                      {row.month}
                    </span>
                  </td>
                  <td className="py-6 px-12">
                    <span className={`font-black text-sm ${getRateColor(row.rate)}`}>
                      {row.rate}
                    </span>
                  </td>
                  <td className="py-6 px-12 text-gray-600 font-bold">{row.waste}</td>
                  <td className="py-6 px-12 text-gray-400 font-bold text-right tabular-nums">{row.population}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryBox label="Peak Impact Hub" value="19.1%" sub="Chennai Metropolis" color="rose" />
        <SummaryBox label="Optimized Region" value="13.1%" sub="Kanyakumari Cluster" color="emerald" />
        <SummaryBox label="Total Network Rescue" value={foodItems.length.toString()} sub="Verified Recoveries" color="amber" />
      </div>

      <div className="bg-gray-900 p-16 rounded-[64px] shadow-2xl relative overflow-hidden group">
        <div className="absolute -bottom-20 -right-20 p-20 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 rotate-12">
           <i className="fa-solid fa-brain text-[300px] text-white"></i>
        </div>
        <div className="flex items-center gap-6 mb-12">
           <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
              <i className="fa-solid fa-microchip text-2xl"></i>
           </div>
           <div>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">AI Intelligence</p>
              <h3 className="text-3xl font-black text-white tracking-tight">Predictive Trends</h3>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
          <div className="flex items-start gap-6 group/item">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
            <p className="text-gray-300 font-semibold text-base leading-relaxed">Network activity suggests 14% increase in surplus availability for coastal regions this quarter.</p>
          </div>
          <div className="flex items-start gap-6 group/item">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
            <p className="text-gray-300 font-semibold text-base leading-relaxed">Logistics bottlenecks identified in urban hubs; optimizing delivery partner allocation.</p>
          </div>
        </div>
      </div>

      {/* Available Food Inventory Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="h-0.5 flex-1 bg-gray-100"></div>
           <div className="flex items-center gap-2">
              <i className="fa-solid fa-box-open text-emerald-500"></i>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em]">Live Inventory Snapshot</h3>
           </div>
           <div className="h-0.5 flex-1 bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.filter(i => i.status === 'Available').length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-[32px] p-12 text-center">
              <p className="text-gray-400 font-bold text-sm">No available items in the network currently.</p>
            </div>
          ) : (
            foodItems.filter(i => i.status === 'Available').map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 truncate text-sm">{item.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.quantity} • {item.location}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">
                  LIVE
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const LegendItem: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const SummaryBox: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => {
  const colorMap: any = {
    rose: 'border-rose-500 text-rose-500 bg-rose-50/30',
    emerald: 'border-emerald-500 text-emerald-500 bg-emerald-50/30',
    amber: 'border-amber-500 text-amber-500 bg-amber-50/30'
  };
  return (
    <div className={`bg-white border-b-8 ${colorMap[color]} p-12 rounded-[56px] shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300`}>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">{label}</p>
      <div>
        <p className="text-5xl font-black text-gray-900 tracking-tighter mb-4">{value}</p>
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">{sub}</p>
      </div>
    </div>
  );
};

export default StatsDashboard;
