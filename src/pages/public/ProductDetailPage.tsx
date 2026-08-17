import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Building2,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Package,
  Layers
} from 'lucide-react';
import { Product } from '../../types';
import { getProductById, getProducts } from '../../firebase/firestore';
import { Badge } from '../../components/common/Badge';
import { EnquiryModal } from '../../components/public/EnquiryModal';
import { ProductCard } from '../../components/public/ProductCard';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl, getProductWhatsAppMessage } from '../../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { settings } = useSite();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const item = await getProductById(id);
        if (item) {
          setProduct(item);
          // Fetch related products in same category
          const allProds = await getProducts({ onlyActive: true });
          const related = allProds
            .filter((p) => p.category === item.category && p.id !== item.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-bg py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold font-display text-navy-900">Medicine Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested medicine is either inactive or does not exist in our catalogue.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const getAvailabilityBadge = (status: Product['availability']) => {
    switch (status) {
      case 'In Stock':
        return 'emerald';
      case 'Available on Order':
        return 'teal';
      case 'Limited Stock':
        return 'amber';
      default:
        return 'red';
    }
  };

  const whatsappMessage = getProductWhatsAppMessage(product.name, product.genericName);
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, whatsappMessage);

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-teal-700">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-teal-700">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 right-4">
                <Badge variant={getAvailabilityBadge(product.availability)}>
                  {product.availability}
                </Badge>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Authentic pharmaceutical formulation with verifiable batch number</span>
            </div>
          </div>

          {/* Right Column: Information & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="navy">{product.category}</Badge>
                <Badge variant="teal">{product.brand}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-navy-900 leading-tight">
                {product.name}
              </h1>

              {/* Generic molecule name */}
              <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-start gap-3">
                <Pill className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    Generic / Active Ingredient
                  </div>
                  <div className="text-base font-bold text-teal-950">
                    {product.genericName}
                  </div>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {product.manufacturer && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block font-medium">Manufacturer</span>
                    <span className="text-xs font-bold text-navy-900 block truncate">{product.manufacturer}</span>
                  </div>
                )}
                {product.dosageForm && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block font-medium">Dosage Form</span>
                    <span className="text-xs font-bold text-navy-900 block">{product.dosageForm}</span>
                  </div>
                )}
                {product.strength && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block font-medium">Strength</span>
                    <span className="text-xs font-bold text-navy-900 block">{product.strength}</span>
                  </div>
                )}
                {product.packaging && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-3">
                    <span className="text-[11px] text-slate-500 block font-medium">Standard Packaging</span>
                    <span className="text-xs font-bold text-navy-900 block">{product.packaging}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Formulation Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Supply Enquiry</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire via WhatsApp</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Fast confirmation on stock availability, batch expiry, and delivery to Chennai & Tamil Nadu.
              </p>
            </div>
          </div>
        </div>

        {/* Medical & Regulatory Disclaimer Card */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <Info className="w-4 h-4" />
            <span>Informational & Compliance Notice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The product information displayed here is intended strictly for licensed medical practitioners, hospitals, clinics, pharmacies, and authorized healthcare clients. New Pharma World does not dispense prescription drugs without appropriate authorized requisitions. This website does not offer medical advice, disease diagnosis, or treatment recommendations.
          </p>
        </div>

        {/* Related Products from same Speciality */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-display text-navy-900">
                Related {product.category} Formulations
              </h2>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-wider"
              >
                View Category
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        defaultProduct={product.name}
      />
    </div>
  );
};
