import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { HeroSection } from '../../components/public/HeroSection';
import { WhyChooseUsSection } from '../../components/public/WhyChooseUsSection';
import { SpecialityCard } from '../../components/public/SpecialityCard';
import { ProductCard } from '../../components/public/ProductCard';
import { BrandCard } from '../../components/public/BrandCard';
import { EnquiryModal } from '../../components/public/EnquiryModal';
import { Product, Speciality, Brand } from '../../types';
import { getProducts, getSpecialities, getBrands } from '../../firebase/firestore';
import { useSite } from '../../context/SiteContext';
import { ProductCardSkeleton, SpecialityCardSkeleton } from '../../components/common/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<Product | null>(null);
  const { homepage } = useSite();
  const { aboutPreview, ctaBanner } = homepage;

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [specsData, prodsData, brandsData] = await Promise.all([
          getSpecialities({ onlyActive: true }),
          getProducts({ onlyActive: true }),
          getBrands({ onlyActive: true }),
        ]);

        setSpecialities(specsData.slice(0, 6));
        setFeaturedProducts(prodsData.filter(p => p.isFeatured).slice(0, 8));
        setBrands(brandsData.slice(0, 8));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* 3. Medical Specialities Showcase */}
      <section className="py-20 bg-surface-bg border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Therapeutic Categories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight">
                Our Medical Specialities
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Providing specialized formulations for critical therapeutic segments.
              </p>
            </div>
            <Link
              to="/specialities"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors group"
            >
              <span>View All Specialities</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SpecialityCardSkeleton key={i} />)
            ) : (
              specialities.map((spec) => (
                <SpecialityCard key={spec.id} speciality={spec} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. Featured Pharmaceutical Products */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Catalogue Highlights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight">
                Featured Medicines & Formulations
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                High-demand pharmaceutical products available for institutional supply and pharmacy distribution.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors group"
            >
              <span>Explore Full Catalogue</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onEnquire={(p) => setSelectedProductForEnquiry(p)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Trusted Brand Partners */}
      <section className="py-20 bg-surface-bg border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmaceutical Manufacturers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight">
              Leading Pharmaceutical Brands
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We distribute authentic pharmaceutical products manufactured by India’s most reputable enterprises.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Overview Section */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{aboutPreview.badge || 'About New Pharma World'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-900 tracking-tight leading-tight">
                {aboutPreview.title || 'Dedicated Pharmaceutical Supply Partner'}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {aboutPreview.description}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  aboutPreview.highlight1 || '100% Genuine & Batch-Tracked Products',
                  aboutPreview.highlight2 || 'Specialized Handling for Temperature-Sensitive Formulations',
                  aboutPreview.highlight3 || 'Dedicated Support for Hospitals, Clinics & Pharmacies',
                ].map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-navy-900">{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm text-sm"
                >
                  <span>Read Full Company Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop"
                  alt="Healthcare distribution"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent p-8 flex flex-col justify-end text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    Trusted Healthcare Partner
                  </div>
                  <div className="text-xl font-bold font-display mt-1">
                    Kodambakkam, Chennai – 600024
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Serving hospitals, dialysis clinics, oncologists and licensed retail pharmacies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {ctaBanner.title || 'Looking for Specialized Pharmaceutical Supply?'}
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            {ctaBanner.description || 'Connect with our team for bulk enquiries, institutional supply, or specific medicine availability.'}
          </p>
          <div className="pt-2">
            <Link
              to={ctaBanner.buttonLink || '/enquiry'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-teal-500/20 transition-all text-base transform hover:-translate-y-0.5"
            >
              <span>{ctaBanner.buttonText || 'Submit an Enquiry'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
