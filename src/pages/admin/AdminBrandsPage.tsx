import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  ExternalLink
} from 'lucide-react';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../../firebase/firestore';
import { Brand } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const { success, error } = useToast();

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setLogoUrl('');
    setDescription('');
    setWebsiteUrl('');
    setDisplayOrder(brands.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setLogoUrl(b.logoUrl);
    setDescription(b.description || '');
    setWebsiteUrl(b.websiteUrl || '');
    setDisplayOrder(b.displayOrder || 1);
    setIsActive(b.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Please provide a brand name');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
        description: description.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      if (editingBrand) {
        await updateBrand(editingBrand.id, payload);
        success('Brand updated successfully!');
      } else {
        await createBrand(payload);
        success('Brand added successfully!');
      }
      setIsModalOpen(false);
      await loadBrands();
    } catch (err: any) {
      console.error('Error saving brand:', err);
      error(err.message || 'Failed to save brand');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBrand(brandToDelete.id);
      success(`${brandToDelete.name} deleted successfully`);
      setBrandToDelete(null);
      await loadBrands();
    } catch (err: any) {
      error(err.message || 'Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (b: Brand) => {
    try {
      await updateBrand(b.id, { isActive: !b.isActive });
      setBrands((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, isActive: !item.isActive } : item))
      );
      success(`${b.name} is now ${!b.isActive ? 'Active' : 'Disabled'}`);
    } catch (err: any) {
      error(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">
            Pharmaceutical Brands & Manufacturers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage partner brands (Cipla, Sun Pharma, Dr. Reddy's, Lupin, Zydus, Mankind, Intas, Abbott, etc.)
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Brand / Manufacturer</th>
              <th className="p-4">Description</th>
              <th className="p-4">Website</th>
              <th className="p-4 text-center">Order</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loading brands...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No brands found. Click Add Brand or Seed Initial Data.
                </td>
              </tr>
            ) : (
              brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="w-10 h-10 rounded-xl object-contain border border-slate-200 p-1 bg-white flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop';
                        }}
                      />
                      <span className="font-bold text-navy-900">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">{b.description}</td>
                  <td className="p-4">
                    {b.websiteUrl ? (
                      <a
                        href={b.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">{b.displayOrder}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(b)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase transition-colors ${
                        b.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {b.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3" />}
                      <span>{b.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Edit Brand"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setBrandToDelete(b)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Brand Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand / Manufacturer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cipla / Sun Pharmaceutical"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <ImageUploader
            currentImageUrl={logoUrl}
            onImageUploaded={(url) => setLogoUrl(url)}
            folder="brands"
            label="Brand Logo"
            customPrefix={name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'brand'}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of pharmaceutical expertise..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://www.cipla.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="brand-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <label htmlFor="brand-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Active (Visible on public brand showcases)
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Brand</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      {brandToDelete && (
        <ConfirmModal
          isOpen={!!brandToDelete}
          onClose={() => setBrandToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Brand"
          message={`Are you sure you want to delete "${brandToDelete.name}"?`}
          confirmText="Yes, Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
