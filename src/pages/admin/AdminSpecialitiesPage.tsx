import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Loader2
} from 'lucide-react';
import {
  getSpecialities,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality
} from '../../firebase/firestore';
import { Speciality } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useToast } from '../../context/ToastContext';

export const AdminSpecialitiesPage: React.FC = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeciality, setEditingSpeciality] = useState<Speciality | null>(null);
  const [specialityToDelete, setSpecialityToDelete] = useState<Speciality | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Activity');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const { success, error } = useToast();

  const loadSpecialities = async () => {
    try {
      setLoading(true);
      const data = await getSpecialities();
      setSpecialities(data);
    } catch (err) {
      console.error('Error fetching specialities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialities();
  }, []);

  const openCreateModal = () => {
    setEditingSpeciality(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setIconName('Activity');
    setDisplayOrder(specialities.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (spec: Speciality) => {
    setEditingSpeciality(spec);
    setName(spec.name);
    setDescription(spec.description);
    setImageUrl(spec.imageUrl);
    setIconName(spec.iconName || 'Activity');
    setDisplayOrder(spec.displayOrder || 1);
    setIsActive(spec.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Please provide a name for the speciality');
      return;
    }

    setIsSaving(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        name: name.trim(),
        slug,
        description: description.trim(),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
        iconName,
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      if (editingSpeciality) {
        await updateSpeciality(editingSpeciality.id, payload);
        success('Speciality updated successfully!');
      } else {
        await createSpeciality(payload);
        success('Speciality created successfully!');
      }
      setIsModalOpen(false);
      await loadSpecialities();
    } catch (err: any) {
      console.error('Error saving speciality:', err);
      error(err.message || 'Failed to save speciality');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!specialityToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSpeciality(specialityToDelete.id);
      success(`${specialityToDelete.name} deleted successfully`);
      setSpecialityToDelete(null);
      await loadSpecialities();
    } catch (err: any) {
      error(err.message || 'Failed to delete speciality');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (spec: Speciality) => {
    try {
      await updateSpeciality(spec.id, { isActive: !spec.isActive });
      setSpecialities((prev) =>
        prev.map((s) => (s.id === spec.id ? { ...s, isActive: !s.isActive } : s))
      );
      success(`${spec.name} is now ${!spec.isActive ? 'Active' : 'Disabled'}`);
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
            Medical Specialities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage therapeutic divisions (Transplant, Dialysis, Vaccines, Cancer Care, etc.)
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Speciality</span>
        </button>
      </div>

      {/* Specialities Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Speciality Name & Image</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Order</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Loading specialities...
                </td>
              </tr>
            ) : specialities.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No specialities configured. Click Add Speciality or Seed Initial Data.
                </td>
              </tr>
            ) : (
              specialities.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={spec.imageUrl}
                        alt={spec.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200&auto=format&fit=crop';
                        }}
                      />
                      <div>
                        <div className="font-bold text-navy-900">{spec.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Icon: {spec.iconName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-sm">
                    <p className="line-clamp-2">{spec.description}</p>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">{spec.displayOrder}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(spec)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase transition-colors ${
                        spec.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {spec.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3" />}
                      <span>{spec.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(spec)}
                      className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Edit Speciality"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSpecialityToDelete(spec)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Speciality"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSpeciality ? 'Edit Speciality' : 'Add New Speciality'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Speciality Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Transplant Medicine"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lucide Icon
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Activity">Activity (Transplant)</option>
                <option value="HeartPulse">HeartPulse (Dialysis)</option>
                <option value="Syringe">Syringe (Vaccines)</option>
                <option value="Pill">Pill (General Medicine)</option>
                <option value="Sparkles">Sparkles (Fertility)</option>
                <option value="ShieldAlert">ShieldAlert (Cancer Care)</option>
              </select>
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

          <ImageUploader
            currentImageUrl={imageUrl}
            onImageUploaded={(url) => setImageUrl(url)}
            folder="specialities"
            label="Speciality Card Image"
            customPrefix={name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'spec'}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical explanation of therapies and products under this speciality..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="spec-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <label htmlFor="spec-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Active (Visible in menus and cards)
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
              <span>Save Speciality</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      {specialityToDelete && (
        <ConfirmModal
          isOpen={!!specialityToDelete}
          onClose={() => setSpecialityToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Speciality"
          message={`Are you sure you want to delete "${specialityToDelete.name}"?`}
          confirmText="Yes, Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
