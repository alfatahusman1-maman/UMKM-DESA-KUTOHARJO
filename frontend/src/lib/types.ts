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
  isVerified: boolean;
  category: Category;
  products?: Product[];
}
