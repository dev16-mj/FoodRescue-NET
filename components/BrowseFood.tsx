
import React from 'react';
import { FoodItem, User, UserRole } from '../types';

interface BrowseFoodProps {
  items: FoodItem[];
  currentUser: User;
  onRequest: (foodId: string) => void;
}

const BrowseFood: React.FC<BrowseFoodProps> = ({ items, currentUser, onRequest }) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  // Only show items that are currently available to be claimed
  const availableItems = items.filter(item => item.status === 'Available');

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Available Food</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Verified surplus food listings ready for rescue.</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
          <i className="fa-solid fa-bolt-lightning text-emerald-600"></i>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
            {availableItems.length} Live Opportunities
          </span>
        </div>
      </div>

      {availableItems.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-24 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6">
            <i className="fa-solid fa-utensils text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">The kitchen is currently clear!</h3>
          <p className="text-gray-400 font-medium max-w-xs mx-auto">All surplus food has been rescued. Check back soon for new listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {availableItems.map(item => (
            <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="h-48 overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                   <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                     {item.category}
                   </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors capitalize">
                    {item.title.toLowerCase()}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref ID: {item.id.toUpperCase()}</p>
                </div>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                      <i className="fa-solid fa-weight-hanging text-[10px]"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-600">{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                      <i className="fa-solid fa-location-dot text-[10px]"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-600 truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                      <i className="fa-solid fa-calendar-check text-[10px]"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-600">Expires: {formatDate(item.expiryDate)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  {(currentUser.role === UserRole.NGO || currentUser.role === UserRole.RECIPIENT) && (
                    <button 
                      onClick={() => onRequest(item.id)}
                      className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg shadow-gray-100 group-hover:shadow-emerald-100"
                    >
                      Rescure This Item
                    </button>
                  )}
                  {currentUser.role === UserRole.DONOR && (
                    <div className="w-full py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Live on Network
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseFood;
