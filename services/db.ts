
import { User, FoodItem, FoodRequest, DeliveryRecord } from '../types';

const STORAGE_KEYS = {
  USERS: 'frn_users',
  ITEMS: 'frn_items',
  REQUESTS: 'frn_requests',
  DELIVERIES: 'frn_deliveries'
};

class MockDatabase {
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User Operations
  async getUsers(): Promise<User[]> {
    return this.get<User>(STORAGE_KEYS.USERS);
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.set(STORAGE_KEYS.USERS, users);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Food Item Operations
  async getFoodItems(): Promise<FoodItem[]> {
    return this.get<FoodItem>(STORAGE_KEYS.ITEMS);
  }

  async saveFoodItem(item: FoodItem): Promise<void> {
    const items = await this.getFoodItems();
    this.set(STORAGE_KEYS.ITEMS, [item, ...items]);
  }

  async updateFoodItem(item: FoodItem): Promise<void> {
    const items = await this.getFoodItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) {
      items[index] = item;
      this.set(STORAGE_KEYS.ITEMS, items);
    }
  }

  // Request Operations
  async getRequests(): Promise<FoodRequest[]> {
    return this.get<FoodRequest>(STORAGE_KEYS.REQUESTS);
  }

  async saveRequest(req: FoodRequest): Promise<void> {
    const requests = await this.getRequests();
    this.set(STORAGE_KEYS.REQUESTS, [req, ...requests]);
  }

  async updateRequest(req: FoodRequest): Promise<void> {
    const requests = await this.getRequests();
    const index = requests.findIndex(r => r.id === req.id);
    if (index > -1) {
      requests[index] = req;
      this.set(STORAGE_KEYS.REQUESTS, requests);
    }
  }

  // Delivery Operations
  async getDeliveries(): Promise<DeliveryRecord[]> {
    return this.get<DeliveryRecord>(STORAGE_KEYS.DELIVERIES);
  }

  async saveDelivery(delivery: DeliveryRecord): Promise<void> {
    const deliveries = await this.getDeliveries();
    this.set(STORAGE_KEYS.DELIVERIES, [delivery, ...deliveries]);
  }

  async updateDelivery(delivery: DeliveryRecord): Promise<void> {
    const deliveries = await this.getDeliveries();
    const index = deliveries.findIndex(d => d.id === delivery.id);
    if (index > -1) {
      deliveries[index] = delivery;
      this.set(STORAGE_KEYS.DELIVERIES, deliveries);
    }
  }
}

export const db = new MockDatabase();
