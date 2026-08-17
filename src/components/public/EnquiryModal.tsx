import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Phone, User, Mail, FileText, Pill } from 'lucide-react';
import { Modal } from '../common/Modal';
import { createEnquiry } from '../../firebase/firestore';
import { useToast } from '../../context/ToastContext';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = '',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState(defaultProduct);
  const [message, setMessage] = useState(
    defaultProduct
      ? `Hello, I would like to inquire about the pricing, batch availability, and delivery timeline for ${defaultProduct}.`
      : 'Hello, I would like to inquire about pharmaceutical supply availability.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      error('Please fill in your name, phone number, and message.');
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
      success('Your enquiry has been received. Our team will contact you shortly.');
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      error(err.message || 'Failed to submit enquiry. Please try again or reach us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={defaultProduct ? `Enquire: ${defaultProduct}` : 'Submit Product Enquiry'}
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-navy-900">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Thank you for reaching out to <span className="font-semibold text-navy-900">New Pharma World</span>. Our distribution team will review your requirement and contact you promptly.
          </p>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="mt-4 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ramesh / Apollo Hospital"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@institution.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medicine / Product of Interest
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Pill className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product name or active ingredient"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requirement Details / Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify required quantities, institution details, or delivery requirements..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * Note: We supply authorized healthcare institutions, clinics, and pharmacies.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Enquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
