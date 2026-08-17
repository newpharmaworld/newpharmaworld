import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Package, CheckCircle2 } from 'lucide-react';
import { getProductById, createProduct, updateProduct, getSpecialities, getBrands } from '../../firebase/firestore';
import { Product, Speciality, Brand } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('Cipla');
  const [category, setCategory] = useState('General Medicine');
  const [manufacturer, setManufacturer] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [strength, setStrength] = useState('');
  const [packaging, setPackaging] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availability, setAvailability] = useState<Product['availability']>('In Stock');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [specs, brs] = await Promise.all([getSpecialities(), getBrands()]);
        setSpecialities(specs);
        setBrands(brs);

        if (specs.length > 0 && !isEditMode) setCategory(specs[0].name);
        if (brs.length > 0 && !isEditMode) setBrand(brs[0].name);

        if (isEditMode && id) {
          const item = await getProductById(id);
          if (item) {
            setName(item.name || '');
            setGenericName(item.genericName || '');
            setBrand(item.brand || 'Cipla');
            setCategory(item.category || 'General Medicine');
            setManufacturer(item.manufacturer || '');
            setDosageForm(item.dosageForm || 'Tablet');
            setStrength(item.strength || '');
            setPackaging(item.packaging || '');
            setDescription(item.description || '');
            setImageUrl(item.imageUrl || '');
            setAvailability(item.availability || 'In Stock');
            setIsFeatured(Boolean(item.isFeatured));
            setIsActive(item.isActive !== false);
            setDisplayOrder(item.displayOrder || 1);
          } else {
            error('Product not found');
            navigate('/admin/products');
          }
        }
      } catch (err: any) {
        console.error('Error loading product edit page:', err);
        error(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !genericName.trim() || !category || !brand) {
      error('Please complete all required fields (Product Name, Generic Molecule, Category, Brand)');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        genericName: genericName.trim(),
        brand,
        category,
        manufacturer: manufacturer.trim(),
        dosageForm: dosageForm.trim(),
        strength: strength.trim(),
        packaging: packaging.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
        availability,
        isFeatured,
        isActive,
        displayOrder: Number(displayOrder) || 1,
      };

      if (isEditMode && id) {
        await updateProduct(id, payload);
        success('Product updated successfully!');
      } else {
        await createProduct(payload);
        success('New product added to catalogue successfully!');
      }
      navigate('/admin/products');
    } catch (err: any) {
      console.error('Error saving product:', err);
      if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
        error('Permission Denied: Please publish your firestore.rules in Firebase Console > Firestore Database > Rules.');
      } else {
        error(err.message || 'Failed to save product');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products Catalogue</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">
            {isEditMode ? 'Edit Medicine Formulation' : 'Add New Medicine Formulation'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the medical specifications, stock availability status, and upload image
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product / Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tacrolimus Capsules 0.5mg"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Generic Active Molecule <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Tacrolimus / Mycophenolate"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturer Name
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Dr. Reddy's Laboratories Ltd."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Therapeutic Speciality / Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {specialities.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pharmaceutical Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dosage Form
              </label>
              <input
                type="text"
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value)}
                placeholder="e.g. Capsule, Injection, Tablet"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Strength
              </label>
              <input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g. 500mg, 4000 IU, 100mg/16.7ml"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Standard Packaging
              </label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="e.g. Box of 10x10 Strips"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 3: Image Upload */}
          <div className="pt-2 border-t border-slate-100">
            <ImageUploader
              currentImageUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
              folder="products"
              label="Medicine Product Image (Auto-Compressed for Firebase Storage)"
              customPrefix={name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'prod'}
            />
          </div>

          {/* Section 4: Description */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Medical & Formulation Overview
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical indication, therapeutic class, and storage requirements..."
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Section 5: Availability & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as Product['availability'])}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="In Stock">In Stock</option>
                <option value="Available on Order">Available on Order</option>
                <option value="Limited Stock">Limited Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col justify-center space-y-3 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Active (Visible on Public Website)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Featured Product (Homepage Showcase)</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Product' : 'Save New Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
