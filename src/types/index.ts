export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  /** Foto tambahan untuk galeri Quick View (opsional). */
  images?: string[];
  badge?: string;
  description: string;
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface Category {
  name: string;
  count: string;
  image: string;
  match: string[];
}

export interface CategoryFilter {
  label: string;
  cats: string[];
}