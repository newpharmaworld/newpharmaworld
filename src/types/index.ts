export interface Product {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string; // e.g. "Transplant Medicine", "Dialysis", "Vaccines", etc.
  manufacturer?: string;
  description: string;
  dosageForm?: string; // e.g. "Tablet", "Injection", "Solution"
  strength?: string; // e.g. "500mg", "100IU"
  packaging?: string; // e.g. "Box of 10x10 Tablets"
  imageUrl: string;
  availability: 'In Stock' | 'Available on Order' | 'Limited Stock' | 'Out of Stock';
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Speciality {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName: string; // Lucide icon identifier
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  product?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface TrustIndicator {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomepageContent {
  hero: {
    badge: string;
    headline: string;
    subtitle: string;
    description: string;
    heroImageUrl: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  trustIndicators: TrustIndicator[];
  aboutPreview: {
    badge: string;
    title: string;
    description: string;
    highlight1: string;
    highlight2: string;
    highlight3: string;
    experienceYears: string;
  };
  ctaBanner: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  businessHours: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  disclaimer: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
