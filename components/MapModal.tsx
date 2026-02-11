
import React, { useEffect, useRef, useState } from 'react';
import { NGO } from '../types';

interface MapModalProps {
  ngo: NGO | null;
  allNgos: NGO[];
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ ngo, allNgos, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const watchId = useRef<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Function to toggle tracking
  const toggleTracking = () => {
    const L = (window as any).L;
    if (!L || !leafletMap.current) return;

    if (isTracking) {
      // Stop tracking
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      if (userMarker.current) {
        leafletMap.current.removeLayer(userMarker.current);
        userMarker.current = null;
      }
      setIsTracking(false);
    } else {
      // Start tracking
      if ("geolocation" in navigator) {
        setIsTracking(true);
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const latlng = [latitude, longitude];

            if (!userMarker.current) {
              const pulseIcon = L.divIcon({
                className: 'user-location-pulse',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              });
              userMarker.current = L.marker(latlng, { icon: pulseIcon }).addTo(leafletMap.current);
              userMarker.current.bindPopup('<b class="text-blue-600">You are here</b>').openPopup();
            } else {
              userMarker.current.setLatLng(latlng);
            }

            leafletMap.current.setView(latlng, 15);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setIsTracking(false);
            alert("Unable to retrieve your location. Please ensure location permissions are granted.");
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  };

  useEffect(() => {
    const L = (window as any).L;
    if (!mapRef.current || !L) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, { zoomControl: false }).setView(
        ngo ? [ngo.coordinates.lat, ngo.coordinates.lng] : [11.1271, 78.6569],
        ngo ? 14 : 7
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);
      
      L.control.zoom({ position: 'topright' }).addTo(leafletMap.current);
    }

    const markers = L.markerClusterGroup();
    allNgos.forEach(item => {
      const isSelected = ngo && item.id === ngo.id;
      
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[200px]';
      popupContent.innerHTML = `
        <h4 class="font-bold text-emerald-700 text-sm">${item.name}</h4>
        <p class="text-[11px] text-gray-600 mt-1">${item.address}</p>
        <p class="text-[11px] font-bold mt-1 text-gray-800"><i class="fa-solid fa-phone mr-1"></i> ${item.phone}</p>
        <div class="mt-4 pt-3 border-t border-gray-100">
          <button id="track-btn-${item.id}" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            <i class="fa-solid fa-location-crosshairs"></i>
            <span>${isTracking ? 'Stop Tracking' : 'Live Tracking'}</span>
          </button>
        </div>
      `;

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng])
        .bindPopup(popupContent);
      
      markers.addLayer(marker);
      
      if (isSelected) {
        marker.openPopup();
      }
    });
    
    leafletMap.current.addLayer(markers);

    // Event delegation for the dynamic tracking button inside Leaflet popups
    const handlePopupOpen = (e: any) => {
      const popup = e.popup;
      const content = popup.getElement();
      if (content) {
        const btn = content.querySelector('button[id^="track-btn-"]');
        if (btn) {
          btn.onclick = () => {
            toggleTracking();
            // Update button text immediately for UX
            const span = btn.querySelector('span');
            if (span) span.innerText = !isTracking ? 'Stop Tracking' : 'Live Tracking';
          };
        }
      }
    };

    leafletMap.current.on('popupopen', handlePopupOpen);

    if (ngo) {
      leafletMap.current.setView([ngo.coordinates.lat, ngo.coordinates.lng], 15);
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (leafletMap.current) {
        leafletMap.current.off('popupopen', handlePopupOpen);
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [ngo, allNgos, isTracking]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col relative">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
               <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Rescue Network Explorer</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Real-time logistics & partner verification</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isTracking && (
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-3 animate-pulse shadow-sm">
                <i className="fa-solid fa-satellite-dish"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">GPS Tracking Active</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all hover:rotate-90"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>
        
        <div ref={mapRef} className="flex-1 w-full h-full z-0 grayscale-[0.2] contrast-[1.1]" />
        
        {ngo && !isTracking && (
          <div className="absolute bottom-10 left-10 bg-white/95 backdrop-blur-xl p-8 rounded-[32px] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 max-w-sm animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-start justify-between mb-4">
               <div>
                 <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest mb-2 inline-block">Selected Center</span>
                 <h4 className="font-black text-gray-900 text-xl tracking-tight leading-none">{ngo.name}</h4>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                 <i className="fa-solid fa-building-circle-check"></i>
               </div>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">{ngo.description}</p>
            <div className="flex gap-4">
              <a href={`tel:${ngo.phone}`} className="flex-1 py-3 bg-gray-900 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all">
                <i className="fa-solid fa-phone mr-2"></i> Contact
              </a>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${ngo.coordinates.lat},${ngo.coordinates.lng}`, '_blank')} 
                className="flex-1 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-emerald-500/20 transition-all"
              >
                <i className="fa-solid fa-directions mr-2 text-emerald-500"></i> Navigate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapModal;
