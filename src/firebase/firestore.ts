import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { Product, Speciality, Brand, Enquiry, SiteSettings, HomepageContent } from '../types';
import {
  initialSiteSettings,
  initialHomepageContent,
  initialSpecialities,
  initialBrands,
  initialDemoProducts
} from './seedData';

// Collection References
const PRODUCTS_COLLECTION = 'products';
const SPECIALITIES_COLLECTION = 'specialities';
const BRANDS_COLLECTION = 'brands';
const ENQUIRIES_COLLECTION = 'enquiries';
const SETTINGS_COLLECTION = 'siteSettings';
const HOMEPAGE_COLLECTION = 'homepage';

// ==========================================
// SITE SETTINGS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...initialSiteSettings, ...docSnap.data() } as SiteSettings;
    }
  } catch (error) {
    console.warn('Could not fetch site settings from Firestore, using default seed data:', error);
  }
  return initialSiteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, 'general');
  await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
}

// ==========================================
// HOMEPAGE CONTENT
// ==========================================

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, 'content');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...initialHomepageContent, ...docSnap.data() } as HomepageContent;
    }
  } catch (error) {
    console.warn('Could not fetch homepage content from Firestore, using default seed data:', error);
  }
  return initialHomepageContent;
}

export async function updateHomepageContent(content: Partial<HomepageContent>): Promise<void> {
  const docRef = doc(db, HOMEPAGE_COLLECTION, 'content');
  await setDoc(docRef, { ...content, updatedAt: new Date().toISOString() }, { merge: true });
}

// ==========================================
// PRODUCTS
// ==========================================

export async function getProducts(options?: { onlyActive?: boolean }): Promise<Product[]> {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION), orderBy('displayOrder', 'asc'));
    if (options?.onlyActive) {
      q = query(collection(db, PRODUCTS_COLLECTION), where('isActive', '==', true));
    }
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      // In-memory sort if needed
      return items.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    }
  } catch (error) {
    console.warn('Could not fetch products from Firestore, returning initial catalogue:', error);
  }
  // Return seed data if Firestore empty or offline
  return options?.onlyActive ? initialDemoProducts.filter(p => p.isActive) : initialDemoProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
  } catch (error) {
    console.warn('Could not fetch product by ID from Firestore:', error);
  }
  const fallback = initialDemoProducts.find(p => p.id === id);
  return fallback || null;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// ==========================================
// SPECIALITIES
// ==========================================

export async function getSpecialities(options?: { onlyActive?: boolean }): Promise<Speciality[]> {
  try {
    const q = query(collection(db, SPECIALITIES_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Speciality));
      return options?.onlyActive ? items.filter(s => s.isActive) : items;
    }
  } catch (error) {
    console.warn('Could not fetch specialities from Firestore, returning initial list:', error);
  }
  return options?.onlyActive ? initialSpecialities.filter(s => s.isActive) : initialSpecialities;
}

export async function createSpeciality(speciality: Omit<Speciality, 'id'>): Promise<string> {
  const colRef = collection(db, SPECIALITIES_COLLECTION);
  const docRef = await addDoc(colRef, speciality);
  return docRef.id;
}

export async function updateSpeciality(id: string, speciality: Partial<Speciality>): Promise<void> {
  const docRef = doc(db, SPECIALITIES_COLLECTION, id);
  await updateDoc(docRef, speciality);
}

export async function deleteSpeciality(id: string): Promise<void> {
  const docRef = doc(db, SPECIALITIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// ==========================================
// BRANDS
// ==========================================

export async function getBrands(options?: { onlyActive?: boolean }): Promise<Brand[]> {
  try {
    const q = query(collection(db, BRANDS_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Brand));
      return options?.onlyActive ? items.filter(b => b.isActive) : items;
    }
  } catch (error) {
    console.warn('Could not fetch brands from Firestore, returning initial list:', error);
  }
  return options?.onlyActive ? initialBrands.filter(b => b.isActive) : initialBrands;
}

export async function createBrand(brand: Omit<Brand, 'id'>): Promise<string> {
  const colRef = collection(db, BRANDS_COLLECTION);
  const docRef = await addDoc(colRef, brand);
  return docRef.id;
}

export async function updateBrand(id: string, brand: Partial<Brand>): Promise<void> {
  const docRef = doc(db, BRANDS_COLLECTION, id);
  await updateDoc(docRef, brand);
}

export async function deleteBrand(id: string): Promise<void> {
  const docRef = doc(db, BRANDS_COLLECTION, id);
  await deleteDoc(docRef);
}

// ==========================================
// ENQUIRIES
// ==========================================

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const colRef = collection(db, ENQUIRIES_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...enquiry,
    status: 'new',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const q = query(collection(db, ENQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry));
  } catch (error) {
    console.warn('Could not fetch enquiries from Firestore:', error);
    return [];
  }
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status'], adminNotes?: string): Promise<void> {
  const docRef = doc(db, ENQUIRIES_COLLECTION, id);
  const payload: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString()
  };
  if (adminNotes !== undefined) {
    payload.adminNotes = adminNotes;
  }
  await updateDoc(docRef, payload);
}

export async function deleteEnquiry(id: string): Promise<void> {
  const docRef = doc(db, ENQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// ==========================================
// 1-CLICK SEED DATABASE HELPER
// ==========================================

export async function seedInitialDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);

    // 1. Site Settings
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'general');
    batch.set(settingsRef, initialSiteSettings);

    // 2. Homepage Content
    const homepageRef = doc(db, HOMEPAGE_COLLECTION, 'content');
    batch.set(homepageRef, initialHomepageContent);

    // 3. Specialities
    for (const spec of initialSpecialities) {
      const specRef = doc(db, SPECIALITIES_COLLECTION, spec.id);
      batch.set(specRef, spec);
    }

    // 4. Brands
    for (const brand of initialBrands) {
      const brandRef = doc(db, BRANDS_COLLECTION, brand.id);
      batch.set(brandRef, brand);
    }

    // 5. Demo Products
    for (const prod of initialDemoProducts) {
      const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(prodRef, {
        ...prod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await batch.commit();
    return { success: true, message: 'Initial specialities, brands, demo products, and site settings seeded successfully!' };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message || 'Failed to seed database.' };
  }
}
