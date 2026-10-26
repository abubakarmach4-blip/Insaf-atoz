export type CategoryId = 'all' | 'engine-oil' | 'filters' | 'gear-oil' | 'hydraulic-oil' | 'polish';

export interface Category {
  id: CategoryId;
  nameUr: string;
  nameEn: string;
  iconName: string;
}

export interface Product {
  id: string;
  nameUr: string;
  nameEn: string;
  category: CategoryId;
  price: number; // in PKR
  originalPrice?: number;
  brand: string;
  specs: string; // e.g. "15W-40 CI-4 / 4 Liters"
  descriptionUr: string;
  descriptionEn: string;
  imageUrl: string;
  isPopular?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'order_basis';
  rating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  vehicleDetails: string;
  paymentMethod: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}
