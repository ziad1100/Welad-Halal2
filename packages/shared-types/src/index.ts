export type Role = 'owner' | 'manager' | 'employee';
export type OrderStatus = 'pending' | 'held' | 'confirmed' | 'cancelled' | 'returned';
export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'mixed';

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  role: Role;
  permissionLevel: number;
  isOwner: boolean;
  forcePasswordChange: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ProductUnitDto {
  id: string;
  unitName: string;
  barcode?: string | null;
  conversionFactor: number;
  sellingPrice: number;
  isActive: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  stockQty: number;
  basePrice: number;
  units: ProductUnitDto[];
}

export interface CartLine {
  productId: string;
  productUnitId?: string | null;
  name: string;
  unitName: string;
  price: number;
  qty: number;
}
