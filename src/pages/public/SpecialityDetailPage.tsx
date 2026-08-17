import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Speciality, Product } from '../../types';
import { getSpecialities, getProducts } from '../../firebase/firestore';
import { ProductCard } from '../../components/public/ProductCard';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';

export const SpecialityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [speciality, setSpeciality] = useState<Speciality | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [specs, prods] = await Promise.all([
          getSpecialities({ onlyActive: true }),
          getProducts({ onlyActive: true }),
        ]);

        const current = specs.find((s) => s.id === id || s.slug === id);
        setSpeciality(current || null);

        if (current) {
          const matchingProds = prods.filter(
            (p) => p.category.toLowerCase() === current.name.toLowerCase()
          );
          setProducts(matchingProds);
        }
      } catch (err) {
        console.error('Error fetching speciality detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Loading speciality...</p>
        </div>
      </div>
    );
  }

  if (!speciality) {
    return (
      <div className="min-h-screen bg-surface-bg py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-teal-600 mx-auto" />
          <h2 className="text-xl font-bold font-display text-navy-900">Speciality Not Found</h2>
          <p className="text-xs text-slate-600">The requested speciality could not be found.</p>
          <Link
            to="/specialities"
            className="inline-block px-5 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-xl"
          >
            Back to Specialities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link to="/specialities" className="hover:text-teal-700">Specialities</Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold">{speciality.name}</span>
        </div>

        {/* Speciality Banner Card */}
        <div className="bg-navy-900 rounded-3xl overflow-hidden shadow-xl text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="p-8 sm:p-12 lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Specialized Therapeutic Division</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              {speciality.name}
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              {speciality.description}
            </p>
            <div className="pt-2">
              <Link
                to={`/products?category=${encodeURIComponent(speciality.name)}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all text-xs shadow-md"
              >
                <span>Filter In Product Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative overflow-hidden bg-navy-950">
            <img
              src={speciality.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'}
              alt={speciality.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-navy-900 via-transparent to-transparent" />
          </div>
        </div>

        {/* Products in this category */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display text-navy-900">
                Available {speciality.name} Medicines
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic formulations from trusted manufacturers
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
              {products.length} Products
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
              <p className="text-sm text-slate-600">
                No specific medicines currently catalogued under this speciality. Contact us for offline hospital requisition.
              </p>
              <Link
                to="/enquiry"
                className="inline-block px-5 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-xl"
              >
                Send Custom Requisition
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
