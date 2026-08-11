export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  categoryId: string;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  address?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}
