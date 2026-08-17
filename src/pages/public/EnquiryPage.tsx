import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, CheckCircle2, Loader2, Phone, Mail, User, Pill, FileText, ArrowLeft, MessageSquare } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { createEnquiry, getProducts } from '../../firebase/firestore';
import { getWhatsAppUrl, getTelUrl } from '../../utils/formatters';
import { Product } from '../../types';

export const EnquiryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultProdParam = searchParams.get('product') || '';
  const { settings } = useSite();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState(defaultProdParam);
  const [message, setMessage] = useState(
    defaultProdParam
      ? `Hello New Pharma World, I would like to inquire about availability, batch pricing, and delivery timeline for ${defaultProdParam}.`
      : 'Hello New Pharma World, I would like to inquire about medicine availability and institutional supply.'
  );
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const prods = await getProducts({ onlyActive: true });
        setProductsList(prods);
      } catch (err) {
        console.error('Error fetching products for dropdown:', err);
      }
    }
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      error('Please complete all required fields (Name, Phone, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        product: product.trim() || undefined,
        message: message.trim(),
      });
      setIsSubmitted(true);
      success('Thank you! Your enquiry has been received.');
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      error(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setProduct('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-surface-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
            <Send className="w-3.5 h-3.5" />
            <span>Pharmaceutical Supply Enquiry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Submit Medicine Requirement
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Hospitals, doctors, dialysis clinics, pharmacies, and patients can submit direct medicine enquiries below.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-display text-navy-900">
                Enquiry Received Successfully
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting <strong className="text-navy-900">New Pharma World</strong>. Our supply desk in Kodambakkam, Chennai will contact you shortly via phone or WhatsApp.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Submit Another Enquiry
                </button>
                <Link
                  to="/products"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Browse More Medicines
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name / Institution Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. K. Sundaram / LifeCare Hospital"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="purchase@hospital.com"
                      className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specific Medicine or Product (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Pill className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Type medicine name or generic molecule..."
                    list="products-autocomplete"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                  />
                  <datalist id="products-autocomplete">
                    {productsList.map((p) => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Requirement Details & Quantities <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify required quantities, institution details, or delivery requirements..."
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Supply Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Direct WhatsApp: +{settings.whatsapp}</span>
                <a
                  href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to inquire about pharmaceutical supply.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Open WhatsApp Chat
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
