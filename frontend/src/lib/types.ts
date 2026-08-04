export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  umkmId?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Umkm {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  description: string;
  address: string;
  dusun: string;
  whatsappNumber: string;
  mapsUrl?: string | null;
  instagramUrl?: string | null;
  imageUrl: string;
  operationalHours?: string | null;
  isVerified: boolean;
  certifications?: string[];
  latitude?: string | number | null;
  longitude?: string | number | null;
  rating?: string | number;
  reviewCount?: number;
  category: Category;
  products?: Product[];
  reviews?: Review[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
