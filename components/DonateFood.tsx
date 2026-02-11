
import React, { useState, useRef } from 'react';
import { FoodItem } from '../types';

interface DonateFoodProps {
  onDonate: (item: FoodItem) => void;
  userName: string;
  userId: string;
}

const DonateFood: React.FC<DonateFoodProps> = ({ onDonate, userName, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cooked Food',
    description: '',
    quantity: '',
    expiryDate: '',
    location: '',
    imageUrl: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: FoodItem = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      donorId: userId,
      donorName: userName,
      status: 'Available',
      timestamp: new Date().toISOString(),
      freshnessScore: 100,
      freshnessReport: 'Manual listing'
    } as FoodItem;
    onDonate(item);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Donate Surplus Food</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
          >
            {formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Food preview" />
            ) : (
              <>
                <i className="fa-solid fa-upload text-gray-400 text-3xl mb-2"></i>
                <p className="text-sm text-gray-500">Click to upload image</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Food Title *</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Fresh Vegetables" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Cooked Food</option>
              <option>Raw Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            rows={4}
            placeholder="Describe the food items..." 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity *</label>
            <input 
              required
              type="text" 
              placeholder="e.g., 20 servings, 5 kg" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Best Before</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={formData.expiryDate}
              onChange={e => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Pickup Address *</label>
          <input 
            required
            type="text" 
            placeholder="Full pickup address" 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors mt-4"
        >
          Donate Food
        </button>
      </form>
    </div>
  );
};

export default DonateFood;
