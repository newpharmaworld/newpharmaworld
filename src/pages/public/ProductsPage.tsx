import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, X, Pill, AlertCircle } from 'lucide-react';
import { ProductCard } from '../../components/public/ProductCard';
import { EnquiryModal } from '../../components/public/EnquiryModal';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import { Product } from '../../types';
import { getProducts, getSpecialities, getBrands } from '../../firebase/firestore';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<Product | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Synchronize URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedCategory(categoryParam);

    const brandParam = searchParams.get('brand');
    if (brandParam) setSelectedBrand(brandParam);

    const queryParam = searchParams.get('q');
    if (queryParam) setSearchTerm(queryParam);
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, specs, brands] = await Promise.all([
          getProducts({ onlyActive: true }),
          getSpecialities({ onlyActive: true }),
          getBrands({ onlyActive: true }),
        ]);

        setProducts(prods);
        setCategories(['All', ...specs.map((s) => s.name)]);
        setBrandsList(['All', ...brands.map((b) => b.name)]);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query (Name, Generic Name, Brand, Category, Dosage)
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.genericName.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      // 2. Category Match
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      // 3. Brand Match
      const matchesBrand =
        selectedBrand === 'All' || item.brand.toLowerCase() === selectedBrand.toLowerCase();

      // 4. Availability Match
      const matchesAvailability =
        selectedAvailability === 'All' || item.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesBrand && matchesAvailability;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedAvailability]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedAvailability('All');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
              <Pill className="w-3.5 h-3.5" />
              <span>Pharmaceutical Catalogue</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              Medicines & Formulations
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our catalogue of genuine medicines, vaccines, dialysis supplies, oncology therapies, and specialized pharmaceutical products.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          {/* Top Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams((prev) => {
                  if (e.target.value) prev.set('q', e.target.value);
                  else prev.delete('q');
                  return prev;
                });
              }}
              placeholder="Search by medicine name, generic molecule (e.g. Tacrolimus, Paclitaxel), brand, or category..."
              className="w-full pl-11 pr-10 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams((prev) => {
                    prev.delete('q');
                    return prev;
                  });
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Therapeutic Speciality
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSearchParams((prev) => {
                    if (e.target.value !== 'All') prev.set('category', e.target.value);
                    else prev.delete('category');
                    return prev;
                  });
                }}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Manufacturer / Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSearchParams((prev) => {
                    if (e.target.value !== 'All') prev.set('brand', e.target.value);
                    else prev.delete('brand');
                    return prev;
                  });
                }}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {brandsList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Stock Status
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">All Availability</option>
                <option value="In Stock">In Stock</option>
                <option value="Available on Order">Available on Order</option>
                <option value="Limited Stock">Limited Stock</option>
              </select>
            </div>

            {/* Reset Action */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-bold text-navy-900">{filteredProducts.length}</span> medicines
            {selectedCategory !== 'All' && <span> in <strong className="text-teal-700">{selectedCategory}</strong></span>}
            {selectedBrand !== 'All' && <span> by <strong className="text-teal-700">{selectedBrand}</strong></span>}
          </div>
          <div className="hidden sm:block">
            * Wholesale & institutional supply only. Not an online retail e-commerce cart.
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display text-navy-900">
              No matching medicines found
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We could not find any products matching your current search parameters. You can submit an enquiry for unlisted formulations.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onEnquire={(p) => setSelectedProductForEnquiry(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      {selectedProductForEnquiry && (
        <EnquiryModal
          isOpen={!!selectedProductForEnquiry}
          onClose={() => setSelectedProductForEnquiry(null)}
          defaultProduct={selectedProductForEnquiry.name}
        />
      )}
    </div>
  );
};
