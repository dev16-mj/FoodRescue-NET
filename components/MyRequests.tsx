
import React, { useState, useEffect, useRef } from 'react';
import { FoodRequest, UserRole, DeliveryRecord } from '../types';

interface MyRequestsProps {
  requests: FoodRequest[];
  role: UserRole;
  deliveries: DeliveryRecord[];
}

const MyRequests: React.FC<MyRequestsProps> = ({ requests, role, deliveries }) => {
  const [activeTracking, setActiveTracking] = useState<DeliveryRecord | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Food Requests</h2>
          <p className="text-gray-500 text-sm mt-1">
            {role === UserRole.DONOR ? 'Manage requests for your donated food' : 'Manage your food requests'}
          </p>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm p-10 overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 mb-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 mx-auto">
              <i className="fa-solid fa-box text-3xl"></i>
            </div>
            <p className="text-gray-400 font-medium text-sm">No requests found</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                  <th className="py-4 px-6">Food Item</th>
                  <th className="py-4 px-6">{role === UserRole.DONOR ? 'Requester' : 'Donor'}</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Delivery Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(req => {
                  const delivery = deliveries.find(d => d.foodId === req.foodId);
                  const isTrackingAvailable = delivery && delivery.status === 'In Transit' && delivery.currentLocation;

                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-700">{req.foodTitle}</td>
                      <td className="py-4 px-6 text-gray-600">{req.requesterName}</td>
                      <td className="py-4 px-6 text-gray-400">{new Date(req.timestamp).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs italic">{req.deliveryAddress || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'In Transit' ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isTrackingAvailable ? (
                          <button 
                            onClick={() => setActiveTracking(delivery)}
                            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 ml-auto shadow-md shadow-emerald-50"
                          >
                            <i className="fa-solid fa-location-arrow"></i>
                            Track Live
                          </button>
                        ) : (
                          <span className="text-gray-300 text-[10px] font-bold uppercase italic">Tracking Offline</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeTracking && (
        <TrackingModal delivery={activeTracking} onClose={() => setActiveTracking(null)} />
      )}
    </div>
  );
};

const TrackingModal: React.FC<{ delivery: DeliveryRecord, onClose: () => void }> = ({ delivery, onClose }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainer.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, { zoomControl: false }).setView(
        [delivery.currentLocation!.lat, delivery.currentLocation!.lng], 
        15
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      
      const customIcon = L.divIcon({
        html: `<div class="truck-pulse bg-emerald-600 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xl text-white">
                 <i class="fa-solid fa-truck text-[12px]"></i>
               </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      markerInstance.current = L.marker(
        [delivery.currentLocation!.lat, delivery.currentLocation!.lng],
        { icon: customIcon }
      ).addTo(mapInstance.current);
    } else {
      markerInstance.current.setLatLng([delivery.currentLocation!.lat, delivery.currentLocation!.lng]);
      mapInstance.current.panTo([delivery.currentLocation!.lat, delivery.currentLocation!.lng]);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [delivery.currentLocation]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="fa-solid fa-bolt-lightning"></i>
             </div>
             <div>
               <h3 className="font-black text-gray-900 text-lg">Live Rescue Track</h3>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">In Transit: {delivery.foodTitle}</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div ref={mapContainer} className="flex-1 bg-gray-50" />
        
        <div className="p-8 bg-white border-t border-gray-50 grid grid-cols-2 gap-8 z-10">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Distance</p>
              <p className="font-black text-xl text-gray-800">Calculating...</p>
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Partner Status</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                 <p className="font-black text-emerald-600">On the move</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
