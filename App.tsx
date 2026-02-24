
import React, { useState, useEffect } from 'react';
import { User, UserRole, FoodItem, FoodRequest, DeliveryRecord } from './types';
import { db } from './services/db';
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
  
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);

  // Initialize data from DB
  const loadData = async () => {
    const items = await db.getFoodItems();
    const reqs = await db.getRequests();
    const dels = await db.getDeliveries();
    setFoodItems(items);
    setRequests(reqs);
    setDeliveries(dels);
  };

  useEffect(() => {
    loadData();
  }, []);

  const setInitialTabForRole = (role: UserRole) => {
    switch (role) {
      case UserRole.DONOR:
        setActiveTab('donate');
        break;
      case UserRole.DELIVERY:
        setActiveTab('delivery');
        break;
      case UserRole.NGO:
      case UserRole.RECIPIENT:
        setActiveTab('browse');
        break;
      default:
        setActiveTab('browse');
    }
  };

  const handleLogin = async (role: UserRole, name: string, email: string) => {
    let user = await db.getUserByEmail(email);
    
    if (!user) {
      // Auto-register with the selected role for new email
      user = { 
        id: Math.random().toString(36).substr(2, 9), 
        name: name || email.split('@')[0], 
        role: role, 
        email: email.toLowerCase()
      };
      await db.saveUser(user);
    }
    
    setCurrentUser(user);
    setInitialTabForRole(user.role);
    await loadData(); // Ensure UI is fresh for the new user
  };

  const handleSignup = async (name: string, email: string, password: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name, 
      role, 
      email: email.toLowerCase()
    };
    await db.saveUser(newUser);
    setCurrentUser(newUser);
    setInitialTabForRole(role);
    await loadData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('browse');
  };

  const handleAddDonation = async (item: FoodItem) => {
    if (!currentUser) return;
    await db.saveFoodItem(item);
    setFoodItems(prev => [item, ...prev]);
    
    const newDelivery: DeliveryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: item.id,
      foodTitle: item.title,
      donorName: item.donorName,
      donorPhone: currentUser.phone || '+91 98765 43210', // Fallback for demo
      recipientName: 'Pending NGO',
      pickupLocation: item.location,
      dropoffLocation: 'Regional Distribution Hub',
      date: new Date().toISOString(),
      status: 'Pending',
      distance: (Math.random() * 15 + 1).toFixed(1) + ' km'
    };
    await db.saveDelivery(newDelivery);
    setDeliveries(prev => [newDelivery, ...prev]);
    // Stay on donate or go to browse? User requested it disappear, so browse is fine to see it gone.
    setActiveTab('browse');
  };

  const handleRequestFood = async (foodId: string, deliveryAddress: string) => {
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
        timestamp: new Date().toISOString(),
        deliveryAddress: deliveryAddress
    };
    await db.saveRequest(newRequest);
    setRequests(prev => [newRequest, ...prev]);
    
    const updatedFood = { ...food, status: 'Requested' as const };
    await db.updateFoodItem(updatedFood);
    setFoodItems(prev => prev.map(f => f.id === foodId ? updatedFood : f));
    
    // Update delivery record if it exists
    const delivery = deliveries.find(d => d.foodId === foodId);
    if (delivery) {
      const updatedDelivery = { 
        ...delivery, 
        recipientName: currentUser.name, 
        recipientPhone: currentUser.phone || '+91 88888 77777', // Fallback for demo
        dropoffLocation: deliveryAddress 
      };
      await db.updateDelivery(updatedDelivery);
      setDeliveries(prev => prev.map(d => d.id === delivery.id ? updatedDelivery : d));
    }

    setActiveTab('requests');
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: 'In Transit' | 'Completed') => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const updatedDelivery = { ...delivery, status: newStatus };
    await db.updateDelivery(updatedDelivery);
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d));
    
    if (newStatus === 'Completed') {
       const food = foodItems.find(f => f.id === delivery.foodId);
       if (food) {
         const updatedFood = { ...food, status: 'Delivered' as const };
         await db.updateFoodItem(updatedFood);
         setFoodItems(prev => prev.map(f => f.id === food.id ? updatedFood : f));
       }
       const req = requests.find(r => r.foodId === delivery.foodId);
       if (req) {
         const updatedReq = { ...req, status: 'Delivered' as const };
         await db.updateRequest(updatedReq);
         setRequests(prev => prev.map(r => r.foodId === delivery.foodId ? updatedReq : r));
       }
    } else if (newStatus === 'In Transit') {
       const food = foodItems.find(f => f.id === delivery.foodId);
       if (food) {
         const updatedFood = { ...food, status: 'In Transit' as const };
         await db.updateFoodItem(updatedFood);
         setFoodItems(prev => prev.map(f => f.id === food.id ? updatedFood : f));
       }
       const req = requests.find(r => r.foodId === delivery.foodId);
       if (req) {
         const updatedReq = { ...req, status: 'In Transit' as const };
         await db.updateRequest(updatedReq);
         setRequests(prev => prev.map(r => r.foodId === delivery.foodId ? updatedReq : r));
       }
    }
  };

  const handleUpdateLiveLocation = async (deliveryId: string, lat: number, lng: number) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      const updated = { ...delivery, currentLocation: { lat, lng } };
      await db.updateDelivery(updated);
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updated : d));
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    if (!currentUser) return;
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      const updated = { ...delivery, driverId: currentUser.id };
      await db.updateDelivery(updated);
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updated : d));
    }
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

        {/* Navigation Bar - Strictly Role-Based */}
        <div className="max-w-7xl mx-auto px-6 flex items-center overflow-x-auto custom-scrollbar">
          {/* Consumer View */}
          {(currentUser.role === UserRole.NGO || currentUser.role === UserRole.RECIPIENT) && (
            <NavTab icon="fa-list-ul" label="Rescue Feed" active={activeTab === 'browse'} onClick={() => setActiveTab('browse')} />
          )}

          {/* Donor View */}
          {currentUser.role === UserRole.DONOR && (
            <NavTab icon="fa-plus" label="Donation Studio" active={activeTab === 'donate'} onClick={() => setActiveTab('donate')} />
          )}

          {/* Logistics View */}
          {currentUser.role === UserRole.DELIVERY && (
            <NavTab icon="fa-truck-fast" label="Logistics Hub" active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} />
          )}

          {/* Shared Common Tabs */}
          <NavTab 
            icon="fa-file-lines" 
            label={currentUser.role === UserRole.DONOR ? "My Listings" : currentUser.role === UserRole.DELIVERY ? "My Trips" : "My Claims"} 
            active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')} 
          />
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
