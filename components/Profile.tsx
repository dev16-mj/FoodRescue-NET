
import React, { useState } from 'react';
import { User, UserRole, FoodItem } from '../types';

interface ProfileProps {
  user: User;
  donations: FoodItem[];
  onUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, donations, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(user.role === UserRole.NGO ? false : true); 
  
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
  });

  const handleSave = () => {
    onUpdate({
      ...user,
      ...formData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
    });
    setIsEditing(false);
  };

  const startVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
        setIsVerifying(false);
        setIsIdentityVerified(true);
        alert("Verification complete! Your profile is now verified in the network.");
    }, 2000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
        <div className="h-44 bg-gradient-to-br from-emerald-600 to-emerald-800 relative">
          <div className="absolute -bottom-16 left-10 flex items-end gap-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl relative flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-3xl">
                {getInitials(isEditing ? formData.name : user.name)}
              </div>
              {isIdentityVerified && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg" title="Verified Identity">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
              )}
            </div>
            <div className="mb-2"> {/* Changed from mb-4 to mb-2 to move name slightly down */}
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{isEditing ? formData.name : user.name}</h2>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isIdentityVerified ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {user.role} Partner
                </span>
                <span className="text-gray-400 text-xs font-medium flex items-center gap-2">
                   {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-24 pb-10 px-10 flex justify-end gap-4 bg-gray-50/30">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-white hover:shadow-md transition-all"
              >
                Edit Profile
              </button>
              {!isIdentityVerified && (
                <button 
                  onClick={startVerification}
                  disabled={isVerifying}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  {isVerifying ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
                  {isVerifying ? 'Verifying...' : 'Verify Now'}
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={handleCancel} className="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-white transition-all">Discard</button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-700 transition-all">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Display Name</label>
              <input type="text" className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:border-emerald-500 outline-none font-semibold text-gray-700" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Contact Phone</label>
              <input type="text" className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:border-emerald-500 outline-none font-semibold text-gray-700" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Registered Address</label>
              <input type="text" className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:border-emerald-500 outline-none font-semibold text-gray-700" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">About Organization</label>
            <textarea className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:border-emerald-500 outline-none font-semibold text-gray-700 min-h-[120px]" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 px-2">History & Records</h3>
          {donations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400 italic shadow-sm">
               No history records found for this account.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donations.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm capitalize truncate">{item.title.toLowerCase()}</h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase mt-2 inline-block ${
                      item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
