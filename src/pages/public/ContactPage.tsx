import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  ExternalLink,
  User,
  Pill,
  FileText
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { createEnquiry } from '../../firebase/firestore';
import { getWhatsAppUrl, getTelUrl } from '../../utils/formatters';

export const ContactPage: React.FC = () => {
  const { settings } = useSite();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      error(err.message || 'Failed to submit enquiry. Please try again or reach out on WhatsApp.');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-navy-800/80 px-3 py-1 rounded-full border border-navy-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kodambakkam, Chennai</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight">
              Contact & Location
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Reach out to our pharmaceutical supply desk for medicine availability, institutional hospital requirements, or clinical enquiries.
            </p>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Phone Support</h3>
              <p className="text-base font-bold text-navy-900">{settings.phoneDisplay || settings.phone}</p>
              <p className="text-xs text-slate-500">Call for immediate stock confirmation</p>
            </div>
            <a
              href={getTelUrl(settings.phone)}
              className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Call Now</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">WhatsApp Desk</h3>
              <p className="text-base font-bold text-navy-900">+{settings.whatsapp}</p>
              <p className="text-xs text-slate-500">Instant enquiry & requirement sharing</p>
            </div>
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Hello New Pharma World, I would like to inquire about pharmaceutical supply.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Email Address</h3>
              <p className="text-sm font-bold text-navy-900 break-all">{settings.email}</p>
              <p className="text-xs text-slate-500">Institutional tenders & official correspondence</p>
            </div>
            <a
              href={`mailto:${settings.email}`}
              className="mt-2 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Send Email</span>
            </a>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Business Hours</h3>
              <p className="text-xs font-bold text-navy-900 leading-relaxed">{settings.businessHours}</p>
              <p className="text-xs text-slate-500">Dispatch & customer service timings</p>
            </div>
            <span className="text-[11px] text-teal-700 font-semibold uppercase tracking-wider">
              Working Days
            </span>
          </div>
        </div>

        {/* Main Section: Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Enquiry Form */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-navy-900">
                Send an Enquiry
              </h2>
              <p className="text-xs text-slate-600">
                Fill in the details below and our team will get in touch with product availability and rate quotes.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-navy-900">
                  Enquiry Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you. We have received your message and our supply desk will contact you soon.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name / Organization <span className="text-red-500">*</span>
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
                      placeholder="e.g. Dr. Rajesh / Chennai Kidney Care"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
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
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
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
                        placeholder="contact@hospital.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Medicine / Requirement
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Pill className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="Medicine name, brand or bulk category"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Requirement Details <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please mention requested quantities, institutional requirements, or delivery schedule..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all text-sm disabled:opacity-50"
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
              </form>
            )}
          </div>

          {/* Right Column: Office Location & Map */}
          <div className="lg:col-span-6 space-y-6">
            {/* Address Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-navy-900">
                    Registered Office & Supply Point
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {settings.addressLine1}, {settings.addressLine2},<br />
                    {settings.area}, {settings.city} – {settings.pincode},<br />
                    {settings.state}, {settings.country}
                  </p>
                  <div className="pt-3">
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-wider"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-80 sm:h-96">
              <iframe
                title="New Pharma World Location Map"
                src={settings.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15547.458239023403!2d80.2166!3d13.0524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266e74b7df7ab%3A0x6a19f4a0bfa1e6f!2sKodambakkam%2C%20Chennai%2C%20Tamil%20Nadu%20600024!5e0!3m2!1sen!2sin!4v1699999999999"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
