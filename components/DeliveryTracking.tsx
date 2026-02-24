
import React, { useEffect, useState, useRef } from 'react';
import { DeliveryRecord, User } from '../types';

interface DeliveryTrackingProps {
  deliveries: DeliveryRecord[];
  currentUser: User;
  onUpdateStatus: (deliveryId: string, newStatus: 'In Transit' | 'Completed') => void;
  onAcceptDelivery: (deliveryId: string) => void;
  onUpdateLocation: (deliveryId: string, lat: number, lng: number) => void;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ 
  deliveries, 
  currentUser, 
  onUpdateStatus,
  onAcceptDelivery,
  onUpdateLocation
}) => {
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const myDeliveries = deliveries.filter(d => d.driverId === currentUser.id);
  const availableDeliveries = deliveries.filter(d => d.status === 'Pending' && !d.driverId);
  const activeDelivery = myDeliveries.find(d => d.status === 'In Transit');

  useEffect(() => {
    if (activeDelivery && !trackingId) {
      if ("geolocation" in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            onUpdateLocation(
              activeDelivery.id, 
              position.coords.latitude, 
              position.coords.longitude
            );
          },
          (error) => console.error("Tracking Error:", error),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
        setTrackingId(id);
      }
    }

    return () => {
      if (trackingId) {
        navigator.geolocation.clearWatch(trackingId);
        setTrackingId(null);
      }
    };
  }, [activeDelivery, trackingId]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Logistics Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium">Manage surplus food transportation and distribution</p>
        </div>
        {activeDelivery && (
          <div className="flex gap-3">
            <div className="bg-emerald-600 px-4 py-2 rounded-xl border border-emerald-500 flex items-center gap-3 shadow-lg shadow-emerald-100 animate-pulse">
              <i className="fa-solid fa-location-arrow text-white"></i>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Tracking Active</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Lifetime Trips</p>
          <p className="text-2xl font-black text-gray-800">{myDeliveries.filter(d => d.status === 'Completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Deliveries</p>
          <p className="text-2xl font-black text-emerald-600">{myDeliveries.filter(d => d.status === 'In Transit').length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Nearby</p>
          <p className="text-2xl font-black text-blue-600">{availableDeliveries.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot text-blue-500"></i>
            Available for Pickup
          </h3>
          {availableDeliveries.length === 0 ? (
            <div className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center">
              <p className="text-gray-400 font-bold text-sm">No pending pickups in your area</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDeliveries.map(delivery => (
                <div key={delivery.id} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900">{delivery.foodTitle}</h4>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {delivery.distance}
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-5 flex justify-center mt-1">
                        <i className="fa-solid fa-circle-dot text-emerald-500 text-[10px]"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight leading-none mb-1">Pickup</span>
                        <span className="text-xs font-bold text-gray-700">{delivery.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 flex justify-center mt-1">
                        <i className="fa-solid fa-location-arrow text-red-500 text-[10px]"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight leading-none mb-1">Drop-off</span>
                        <span className="text-xs font-bold text-gray-700">{delivery.dropoffLocation}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onAcceptDelivery(delivery.id)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-gray-100"
                  >
                    Accept Delivery Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-truck-fast text-emerald-500"></i>
            Active Deliveries
          </h3>
          {myDeliveries.filter(d => d.status !== 'Completed').length === 0 ? (
            <div className="bg-emerald-50/30 rounded-3xl border-2 border-dashed border-emerald-100 p-12 text-center">
              <p className="text-emerald-800/40 font-bold text-sm">You have no active deliveries</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.filter(d => d.status !== 'Completed').map(delivery => (
                <div 
                  key={delivery.id} 
                  onClick={() => setSelectedDelivery(delivery)}
                  className="bg-white border-2 border-emerald-50 p-6 rounded-[24px] shadow-sm cursor-pointer hover:border-emerald-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{delivery.foodTitle}</h4>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      {delivery.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">From</span>
                      <span className="text-xs font-bold text-gray-800 truncate">{delivery.donorName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">To</span>
                      <span className="text-xs font-bold text-gray-800 truncate">{delivery.recipientName}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(delivery.id, delivery.status === 'Pending' ? 'In Transit' : 'Completed');
                      }}
                      className={`flex-1 py-3 ${delivery.status === 'Pending' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-900 hover:bg-emerald-950'} text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all`}
                    >
                      {delivery.status === 'Pending' ? 'Start Delivery' : 'Confirm Drop-off'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDelivery(delivery);
                      }}
                      className="px-4 py-3 bg-gray-50 text-gray-400 rounded-xl hover:text-emerald-600 transition-colors"
                    >
                      <i className="fa-solid fa-circle-info"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                  <i className="fa-solid fa-truck-ramp-box"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Delivery Details</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order ID: {selectedDelivery.id.toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDelivery(null)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Food Item</h4>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  <span className="font-black text-gray-800">{selectedDelivery.foodTitle}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Donor (Pickup)</h4>
                  <div className="space-y-1">
                    <p className="font-black text-gray-900">{selectedDelivery.donorName}</p>
                    <p className="text-xs text-gray-500 font-medium">{selectedDelivery.pickupLocation}</p>
                    <div className="flex items-center gap-2 mt-2 text-emerald-600">
                      <i className="fa-solid fa-phone text-[10px]"></i>
                      <span className="text-xs font-bold">{selectedDelivery.donorPhone || 'No contact provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recipient (Drop-off)</h4>
                  <div className="space-y-1">
                    <p className="font-black text-gray-900">{selectedDelivery.recipientName}</p>
                    <p className="text-xs text-gray-500 font-medium">{selectedDelivery.dropoffLocation}</p>
                    <div className="flex items-center gap-2 mt-2 text-blue-600">
                      <i className="fa-solid fa-phone text-[10px]"></i>
                      <span className="text-xs font-bold">{selectedDelivery.recipientPhone || 'No contact provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex gap-4">
                <button 
                  onClick={() => window.open(`tel:${selectedDelivery.donorPhone}`, '_self')}
                  className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-gray-100"
                >
                  Call Donor
                </button>
                <button 
                  onClick={() => window.open(`tel:${selectedDelivery.recipientPhone}`, '_self')}
                  className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Call Recipient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
