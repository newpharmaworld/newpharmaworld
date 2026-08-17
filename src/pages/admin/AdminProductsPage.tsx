import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  StarOff,
  Filter,
  ExternalLink
} from 'lucide-react';
import { getProducts, updateProduct, deleteProduct, getSpecialities } from '../../firebase/firestore';
import { Product, Speciality } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, specs] = await Promise.all([getProducts(), getSpecialities()]);
      setProducts(prods);
      setCategories(['All', ...specs.map((s) => s.name)]);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { isActive: !prod.isActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, isActive: !p.isActive } : p))
      );
      success(`${prod.name} is now ${!prod.isActive ? 'Active (Visible)' : 'Hidden'}`);
    } catch (err: any) {
      error(err.message || 'Failed to update product status');
    }
  };

  const handleToggleFeatured = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { isFeatured: !prod.isFeatured });
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
      success(`${prod.name} featured status updated`);
    } catch (err: any) {
      error(err.message || 'Failed to update featured status');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      success(`${productToDelete.name} deleted successfully`);
      setProductToDelete(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.genericName.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query);
    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">
            Medicine Catalogue Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage pharmaceutical products, stock availability, and featured visibility
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, generic molecule, or brand..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Medicine Name & Molecule</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading products catalogue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center p-1">
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=200&auto=format&fit=crop';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-navy-900">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{prod.genericName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{prod.brand}</td>
                    <td className="p-4">
                      <Badge variant="navy" size="sm">
                        {prod.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          prod.availability === 'In Stock'
                            ? 'emerald'
                            : prod.availability === 'Available on Order'
                            ? 'teal'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {prod.availability}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          prod.isFeatured ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100'
                        }`}
                        title={prod.isFeatured ? 'Featured on homepage' : 'Not featured'}
                      >
                        {prod.isFeatured ? <Star className="w-4 h-4 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] tracking-wide uppercase transition-colors ${
                          prod.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {prod.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3" />}
                        <span>{prod.isActive ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <Link
                        to={`/products/${prod.id}`}
                        target="_blank"
                        className="inline-flex p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Live Product Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${prod.id}`}
                        className="inline-flex p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit Medicine"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Medicine"
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
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <ConfirmModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Medicine"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
