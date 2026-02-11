
export enum UserRole {
  DONOR = 'Donor',
  NGO = 'NGO',
  DELIVERY = 'Delivery',
  RECIPIENT = 'Recipient'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface FoodItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  donorId: string;
  donorName: string;
  location: string;
  status: 'Available' | 'Requested' | 'In Transit' | 'Delivered';
  freshnessScore: number;
  freshnessReport: string;
  timestamp: string;
  quantity: string;
  expiryDate: string;
}

export interface FoodRequest {
  id: string;
  foodId: string;
  foodTitle: string;
  requesterId: string;
  requesterName: string;
  status: 'Pending' | 'Approved' | 'In Transit' | 'Delivered';
  timestamp: string;
}

export interface DeliveryRecord {
  id: string;
  foodId: string;
  foodTitle: string;
  donorName: string;
  recipientName: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  status: 'Pending' | 'In Transit' | 'Completed';
  distance: string;
  driverId?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    heading?: number;
  };
}

export interface NGO {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  district: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  isVerified: boolean;
}

export interface WasteStat {
  district: string;
  year: number;
  rate: string;
  waste: string;
  population: string;
  month: string;
}
