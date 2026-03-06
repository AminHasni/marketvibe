export interface Item {
  id: string;
  name: { fr: string; ar: string };
  description: { fr: string; ar: string };
  price: number;
  category: string;
  type: 'product' | 'service';
  image: string;
  rating: number;
  reviews: number;
  features?: { fr: string[]; ar: string[] };
  specifications?: { fr: Record<string, string>; ar: Record<string, string> };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: Item[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress?: string;
}

export type Language = 'fr' | 'ar';
