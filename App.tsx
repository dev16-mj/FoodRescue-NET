
import React, { useState, useEffect } from 'react';
import { User, UserRole, FoodItem, FoodRequest, DeliveryRecord } from './types';
import Login from './components/Login';
import BrowseFood from './components/BrowseFood';
import DonateFood from './components/DonateFood';
import NGOsList from './components/NGOsList';
import StatsDashboard from './components/StatsDashboard';
import Profile from './components/Profile';
import MyRequests from './components/MyRequests';
import DeliveryTracking from './components/DeliveryTracking';

type AppTab = 'browse' | 'donate' | 'requests' | 'ngos' | 'stats' | 'profile' | 'delivery';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('browse');
  
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('foodrescue_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodrescue_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [requests, setRequests] = useState<FoodRequest[]>(() => {
    try {
      const saved = localStorage.getItem('foodrescue_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('foodrescue_deliveries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('foodrescue_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('foodrescue_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('foodrescue_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('foodrescue_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleLogin = (role: UserRole, name: string, email: string) => {
    const user = registeredUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      if (user.role === UserRole.DELIVERY) setActiveTab('delivery');
    } else {
      const mockUser: User = { 
        id: Math.random().toString(36).substr(2, 9), 
        name: name || 'User', 
        role: role, 
        email
      };
      setRegisteredUsers(prev => [...prev, mockUser]);
      setCurrentUser(mockUser);
      if (role === UserRole.DELIVERY) setActiveTab('delivery');
    }
  };

  const handleSignup = (name: string, email: string, password: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name, role, email
    };
    setRegisteredUsers([...registeredUsers, newUser]);
    setCurrentUser(newUser);
    if (role === UserRole.DELIVERY) setActiveTab('delivery');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('browse');
  };

  const handleAddDonation = (item: FoodItem) => {
    setFoodItems([item, ...foodItems]);
    
    // Auto-create a pending delivery for testing
    const newDelivery: DeliveryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: item.id,
      foodTitle: item.title,
      donorName: item.donorName,
      recipientName: 'Pending NGO',
      pickupLocation: item.location,
      dropoffLocation: 'Regional Distribution Hub',
      date: new Date().toISOString(),
      status: 'Pending',
      distance: (Math.random() * 15 + 1).toFixed(1) + ' km'
    };
    setDeliveries([newDelivery, ...deliveries]);
    setActiveTab('browse');
  };

  const handleRequestFood = (foodId: string) => {
    if (!currentUser) return;
    const food = foodItems.find(f => f.id === foodId);
    if (!food) return;

    const newRequest: FoodRequest = {
        id: Math.random().toString(36).substr(2, 9),
        foodId: foodId,
        foodTitle: food.title,
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    setRequests([newRequest, ...requests]);
    setFoodItems(prev => prev.map(f => f.id === foodId ? { ...f, status: 'Requested' } : f));
    setActiveTab('requests');
  };

  const handleUpdateDeliveryStatus = (deliveryId: string, newStatus: 'In Transit' | 'Completed') => {
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, status: newStatus } : d));
    
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery && newStatus === 'Completed') {
       setFoodItems(prev => prev.map(f => f.id === delivery.foodId ? { ...f, status: 'Delivered' } : f));
       setRequests(prev => prev.map(r => r.foodId === delivery.foodId ? { ...r, status: 'Delivered' } : r));
    } else if (delivery && newStatus === 'In Transit') {
       setFoodItems(prev => prev.map(f => f.id === delivery.foodId ? { ...f, status: 'In Transit' } : f));
       setRequests(prev => prev.map(r => r.foodId === delivery.foodId ? { ...r, status: 'In Transit' } : r));
    }
  };

  const handleUpdateLiveLocation = (deliveryId: string, lat: number, lng: number) => {
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, currentLocation: { lat, lng } } : d));
  };

  const handleAcceptDelivery = (deliveryId: string) => {
    if (!currentUser) return;
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, driverId: currentUser.id } : d));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'browse': return <BrowseFood items={foodItems} currentUser={currentUser} onRequest={handleRequestFood} />;
      case 'donate': return <DonateFood onDonate={handleAddDonation} userName={currentUser.name} userId={currentUser.id} />;
      case 'requests': return <MyRequests requests={requests} role={currentUser.role} deliveries={deliveries} />;
      case 'ngos': return <NGOsList />;
      case 'stats': return <StatsDashboard foodItems={foodItems} />;
      case 'profile': return <Profile user={currentUser} donations={foodItems.filter(i => i.donorId === currentUser.id)} onUpdate={setCurrentUser} />;
      case 'delivery': return (
        <DeliveryTracking 
          deliveries={deliveries} 
          currentUser={currentUser} 
          onUpdateStatus={handleUpdateDeliveryStatus}
          onAcceptDelivery={handleAcceptDelivery}
          onUpdateLocation={handleUpdateLiveLocation}
        />
      );
      default: return <BrowseFood items={foodItems} currentUser={currentUser} onRequest={handleRequestFood} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Global Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-leaf text-emerald-500 text-xl"></i>
            <h1 className="text-xl font-bold text-gray-800">FoodRescueNet</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <i className="fa-solid fa-user text-sm"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 leading-none">{currentUser.name}</span>
                <span className="text-[10px] text-gray-400 font-medium">{currentUser.role}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-1.5 bg-rose-700 text-white rounded-md text-xs font-bold flex items-center gap-2 hover:bg-rose-800 transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 flex items-center overflow-x-auto custom-scrollbar">
          <NavTab icon="fa-list-ul" label="Browse Food" active={activeTab === 'browse'} onClick={() => setActiveTab('browse')} />
          <NavTab icon="fa-plus" label="Donate Food" active={activeTab === 'donate'} onClick={() => setActiveTab('donate')} />
          <NavTab icon="fa-file-lines" label="My Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
          {currentUser.role === UserRole.DELIVERY && (
            <NavTab icon="fa-truck-fast" label="Logistics Hub" active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} />
          )}
          <NavTab icon="fa-building-ngo" label="NGOs & Charities" active={activeTab === 'ngos'} onClick={() => setActiveTab('ngos')} />
          <NavTab icon="fa-chart-simple" label="Intelligence Hub" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <NavTab icon="fa-user-gear" label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </header>

      <main className="bg-gray-50/50 min-h-[calc(100vh-120px)]">
        {renderContent()}
      </main>
    </div>
  );
};

const NavTab: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-sm font-medium whitespace-nowrap ${
      active 
      ? 'border-emerald-600 text-emerald-600 bg-emerald-50/20' 
      : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <i className={`fa-solid ${icon} text-sm`}></i>
    <span>{label}</span>
  </button>
);

export default App;
